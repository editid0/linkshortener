import psycopg2
import uuid
import random
import os
from faker import Faker
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables from ../short/.env
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'short', '.env'))

# Configuration
DB_CONFIG = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": 5432
}

USER_ID = "user_2yeRbddIwJ5RczctF4UZcTQx4wf"
NUM_ENTRIES = 1  # adjust as needed

# Connect to the database
conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

fake = Faker()

def generate_url(valid=True):
    if valid:
        return fake.url()
    else:
        return random.choice([
            "htp://invalid-url",     # malformed scheme
            "example.com",           # missing scheme
            "https://",              # incomplete
            "://invalid",            # broken scheme
            "https:/invalid.com",    # malformed
            ""                       # empty
        ])

def generate_entry():
    url = generate_url(valid=random.random() > 0.2)  # 80% valid, 20% invalid
    slug_base = fake.slug() + '-' + ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=6))
    slug = slug_base + '-' + uuid.uuid4().hex[:6]
    return {
        "id": str(uuid.uuid4()),
        "url": url,
        "user_id": USER_ID,
        "slug": slug,
        "slug_random": random.choice([True, False]),
        "expiry": datetime.utcnow() + timedelta(days=random.randint(0, 365)),
        "analytics_key": f"analytics_{uuid.uuid4().hex[:10]}",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "platform_urls": None
    }

# Insert data
entries = [generate_entry() for _ in range(NUM_ENTRIES)]

insert_query = """
    INSERT INTO urls (
        id, url, user_id, slug, slug_random,
        expiry, analytics_key, created_at, updated_at, platform_urls
    )
    VALUES (
        %(id)s, %(url)s, %(user_id)s, %(slug)s, %(slug_random)s,
        %(expiry)s, %(analytics_key)s, %(created_at)s, %(updated_at)s, %(platform_urls)s
    );
"""

for entry in entries:
    cursor.execute(insert_query, entry)

conn.commit()
cursor.close()
conn.close()

print(f"✅ Inserted {NUM_ENTRIES} rows.")
