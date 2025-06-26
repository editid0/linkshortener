from dotenv import load_dotenv
import os, psycopg2, re

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
    if re.match(r'^\w+$', url, re.IGNORECASE):
        # Only contains alphanumeric characters
        # Invalid
        return False
    elif re.match(r'^htts', url, re.IGNORECASE):
        # Starts with 'htts' instead of 'https'
        # Invalid
        return False
    elif re.match(r'^htps', url, re.IGNORECASE):
        # Starts with 'htps' instead of 'https'
        # Invalid
        return False
    elif re.match(r'^\W+', url, re.IGNORECASE):
        # Starts with : or /
        # Invalid
        return False
    elif re.match(r'^http(s)?(//|:/|:|/)\w+', url, re.IGNORECASE):
        # Starts with Only has // or :/ or : or /
        # Invalid
        return False
    elif re.match(r'^http(s)?://\w+$', url, re.IGNORECASE):
        # Starts with http:// or https:// and only has alphanumeric characters
        # Invalid
        return False
    elif re.match(r'^http(s?)[:/]*$', url, re.IGNORECASE):
        # Starts with http:// or https:// and has no other characters
        # Invalid
        return False
    elif re.match(r'^(http(s)?://)?(\w+)(\.\b\w+)*(\.)[/?&#]', url, re.IGNORECASE):
        # Trailing dot in URL
        # Invalid
        return False
    elif re.match(r'^(?!http)\w+://', url, re.IGNORECASE):
        # Invalid protocol (not http or https)
        # Invalid
        return False
    elif re.match(r'^(http(s)?://)?(127\.\d+\.\d+\.\d+)|(169\.254\.\d+\.\d+)|(10\.\d+\.\d+\.\d+)|(172\.(16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31)\.\d+\.\d+)|(192\.168\.\d+\.\d+)', url, re.IGNORECASE):
        # Private IP address
        # Invalid
        return False
    elif re.match(r'(^::1)|(^https?://\[::1\])|(^fe80::1)|(^https?://\[fe80::1\])|(^fd00::1)|(^https?://\[fd00::1\])', url, re.IGNORECASE):
        # IPv6 loopback address
        # Invalid
        return False
    return True  # If none of the above conditions are met, the URL is valid

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
                # print(f"Validating URL: {url}, Slug: {slug}, Is Random: {is_random}, Platform URLs: {platform_urls}")
                if validate_url(url):
                    # print(f"URL {url} is valid.")
                    ...
                else:
                    print(f"URL {url} is invalid.")
        cursor.close()
    except Exception as e:
        print(f"Error during validation: {e}")

if __name__ == "__main__":
    main()