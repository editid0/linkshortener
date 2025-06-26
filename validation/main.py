from dotenv import load_dotenv
import os, psycopg2, re
import validators

env_path = os.path.join(os.path.dirname(__file__), '../short/.env')
load_dotenv(dotenv_path=env_path)

DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')

def connect_to_db():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST
        )
        return conn
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None

def main():
    conn = connect_to_db()
    if conn:
        print("Connection to the database established successfully.")
        validate_rows(conn)
        conn.close()
    else:
        print("Failed to connect to the database.")

def validate_url(url):
    status = validators.url(url,consider_tld=True,private=False)
    if status == True:
        shortener_regex = r'^https?:\/\/(bit\.ly|tinyurl\.com|shorturl\.at|rb\.gy|rebrand\.ly|dub\.sh|short-link\.me|www\.naturl\.link)\/\w+'
        if re.match(shortener_regex, url):
            return False
    return status == True

def validate_rows(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM urls WHERE valid = 'unknown'")
        rows = cursor.fetchall()
        if not rows:
            print("No rows with 'valid' status as 'unknown' found.")
        else:
            print(f"Found {len(rows)} rows with 'valid' status as 'unknown'.")
            for row in rows:
                uid = row[0]
                url = row[1]
                slug = row[3]
                is_random = row[4]
                platform_urls = row[7]
                marked_invalid = False # If this is set to true, something was invalid, otherwise at the end of the loop, the row will be set to valid.
                # print(f"Validating URL: {url}, Slug: {slug}, Is Random: {is_random}, Platform URLs: {platform_urls}")
                valid = validate_url(url)
                if not valid:
                    # Try prefix with https:// if it doesn't start with http or https
                    if not re.match(r'^(http://|https://)', url):
                        url = 'https://' + url
                        valid = validate_url(url)
                        if valid:
                            # Update the URL in the database to include the prefix
                            cursor.execute("UPDATE urls SET url = %s WHERE id = %s", (url, uid))
                    else:
                        # URL is invalid, update the status to 'invalid'
                        cursor.execute("UPDATE urls SET valid = 'invalid', valid_msg = 'Invalid URL' WHERE id = %s", (uid,))
                        marked_invalid = True
                if platform_urls:
                    ios = platform_urls.get('ios')
                    macos = platform_urls.get('macos')
                    android = platform_urls.get('android')
                    windows = platform_urls.get('windows')
                    phone = platform_urls.get('phone')
                    tablet = platform_urls.get('tablet')
                    desktop = platform_urls.get('desktop')
                    chrome = platform_urls.get('chrome')
                    safari = platform_urls.get('safari')
                    firefox = platform_urls.get('firefox')
                    default = platform_urls.get('default')
                    platform_fields = [
                        ('ios', ios, 'iOS'),
                        ('macos', macos, 'macOS'),
                        ('android', android, 'Android'),
                        ('windows', windows, 'Windows'),
                        ('phone', phone, 'Phone'),
                        ('tablet', tablet, 'Tablet'),
                        ('desktop', desktop, 'Desktop'),
                        ('chrome', chrome, 'Chrome'),
                        ('safari', safari, 'Safari'),
                        ('firefox', firefox, 'Firefox'),
                        ('default', default, 'Default'),
                    ]
                    invalid_msgs = []
                    for field, value, label in platform_fields:
                        if value and not validate_url(value):
                            # Try prefixing with https:// if not present
                            if not re.match(r'^(http://|https://)', value):
                                new_value = 'https://' + value
                                if validate_url(new_value):
                                    # Update the platform url in the database
                                    cursor.execute(
                                        f"UPDATE urls SET platform_urls = jsonb_set(platform_urls, '{{{field}}}', %s) WHERE id = %s",
                                        ('"%s"' % new_value, uid)
                                    )
                                    continue
                            # Collect invalid messages
                            invalid_msgs.append(f'Invalid {label} URL')
                    if invalid_msgs:
                        # Set status to invalid and combine all messages
                        cursor.execute(
                            "UPDATE urls SET valid = 'invalid', valid_msg = %s WHERE id = %s",
                            (', '.join(invalid_msgs), uid)
                        )
                        marked_invalid = True
                if not marked_invalid:
                    # If no invalid URLs were found, set the status to valid
                    cursor.execute("UPDATE urls SET valid = 'valid' WHERE id = %s", (uid,))
        conn.commit()
        cursor.close()
    except Exception as e:
        print(f"Error during validation: {e}")

if __name__ == "__main__":
    main()