import { auth } from '@clerk/nextjs/server'
import moment from 'moment';
import { Pool } from 'pg';

function validateURL(url) {
    try {
        let parsed = new URL(url);
        // Must have a dot in the hostname and a valid protocol
        return (
            /^(https?):$/.test(parsed.protocol) &&
            parsed.hostname.includes('.') &&
            !/^\d+\.\d+\.\d+\.\d+$/.test(parsed.hostname) // avoid matching plain IPs if you want
        );
    } catch {
        // Try prepending https:// and validating again
        if (!/^https?:\/\//i.test(url)) {
            try {
                let parsed = new URL("https://" + url);
                return (
                    /^(https?):$/.test(parsed.protocol) &&
                    parsed.hostname.includes('.') &&
                    !/^\d+\.\d+\.\d+\.\d+$/.test(parsed.hostname)
                );
            } catch {
                return false;
            }
        }
        return false;
    }
}

function validateSlug(slug) {
    // alphanumeric characters, dashes, and underscores only, remove trailing dashes and underscores
    const regex = /^[a-zA-Z0-9-_]+$/;
    if (!regex.test(slug)) {
        return false;
    }
    // Check if it is between 3 and 63 characters long
    if (slug.length < 3 || slug.length > 63) {
        return false;
    }
    // Remove trailing dashes and underscores
    const trimmedSlug = slug.replace(/[-_]+$/, '');
    // Check if it is still between 3 and 63 characters long after trimming
    if (trimmedSlug.length < 3 || trimmedSlug.length > 63) {
        return false;
    }
    return true;
}
function validateExpiry(expiry) {
    // String in this format: '2025-06-25T15:30:00.000Z'
    // Check if it meets the format
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    if (!regex.test(expiry)) {
        return false;
    }
    // Check if it is a valid date, using momentjs
    const date = new moment(expiry);
    return date.isValid() && date.isAfter(moment());
}

// Helper function to generate cryptographically secure random string without bias
function generateSecureRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const maxValidValue = Math.floor(256 / chars.length) * chars.length;
    let result = '';

    while (result.length < length) {
        const randomBytes = crypto.getRandomValues(new Uint8Array(length * 2)); // Generate extra bytes
        for (let i = 0; i < randomBytes.length && result.length < length; i++) {
            if (randomBytes[i] < maxValidValue) {
                result += chars[randomBytes[i] % chars.length];
            }
        }
    }

    return result.substring(0, length);
}

export async function POST(request) {
    const { userId } = await auth();
    const { url, slug, slug_random, analytics, expiration, expiryTime } = await request.json();
    console.log(expiration, expiryTime);

    // Problem 10: Input size validation
    if (!url || typeof url !== 'string') {
        return new Response(JSON.stringify({ error: "URL is required and must be a string" }), { status: 400 });
    }
    if (url.length > 2048) { // Common URL length limit
        return new Response(JSON.stringify({ error: "URL is too long (maximum 2048 characters)" }), { status: 400 });
    }
    if (slug && typeof slug !== 'string') {
        return new Response(JSON.stringify({ error: "Slug must be a string" }), { status: 400 });
    }
    if (slug && slug.length > 63) { // Already checked in validateSlug but adding here for DoS protection
        return new Response(JSON.stringify({ error: "Slug is too long (maximum 63 characters)" }), { status: 400 });
    }
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: 5432,
    });
    // Validate URL
    if (!validateURL(url)) {
        return new Response(JSON.stringify({ error: "Invalid URL" }), { status: 400 });
    }
    // If slug_random is false, validate slug
    if (!slug_random && slug && !validateSlug(slug)) {
        return new Response(JSON.stringify({ error: "Invalid slug" }), { status: 400 });
    }    // If expiration is true, validate expiry date, use moment to take in the day, month, year, hour, and minute
    let expiry = null;
    if (expiration && expiryTime &&
        expiration.trim() !== '' && expiryTime.trim() !== '') {
        const [hour, minute] = expiryTime.split(':');
        const date = moment.utc(expiration, "DD/MM/YYYY").set({ hour, minute, second: 0, millisecond: 0 });
        // Check that the date is valid and in the future (using UTC)
        if (!date.isValid() || !date.isAfter(moment.utc())) {
            return new Response(JSON.stringify({ error: "Invalid expiry date or time" }), { status: 400 });
        }
        expiry = date.toISOString();
    }
    // Only allow analytics if the user is authenticated
    if (analytics && !userId) {
        return new Response(JSON.stringify({ error: "Analytics can only be enabled for authenticated users" }), { status: 400 });
    }
    // Check if the slug already exists in the database
    if (slug && !slug_random) {
        const slugQuery = "SELECT * FROM urls WHERE slug = $1";
        const slugValues = [slug];
        const { rows } = await pool.query(slugQuery, slugValues);
        if (rows.length > 0) {
            return new Response(JSON.stringify({ error: "Slug already exists" }), { status: 400 });
        }
    }
    // If the slug is random, generate a random slug, using crypto to generate a random string of 5-8 characters
    let randomSlug = slug_random;
    let finalSlug = slug;
    if (slug_random) {
        // Generate random slug with collision detection
        let attempts = 0;
        const maxAttempts = 10;
        do {
            randomSlug = generateSecureRandomString(6);
            // Check if random slug already exists
            const slugCheckQuery = "SELECT COUNT(*) as count FROM urls WHERE slug = $1";
            const slugCheckResult = await pool.query(slugCheckQuery, [randomSlug]);
            if (slugCheckResult.rows[0].count == 0) {
                break; // Slug is unique, exit loop
            }
            attempts++;
        } while (attempts < maxAttempts);

        if (attempts >= maxAttempts) {
            return new Response(JSON.stringify({ error: "Failed to generate unique slug, please try again" }), { status: 500 });
        }
        finalSlug = ""; // Clear slug when randomSlug is specified
    }
    // Generate a random analytics key if analytics is enabled
    let analyticsKey = null;
    if (analytics) {
        // Generate analytics key with collision detection
        let attempts = 0;
        const maxAttempts = 10;
        do {
            analyticsKey = generateSecureRandomString(16);

            // Check if analytics key already exists
            const keyCheckQuery = "SELECT COUNT(*) as count FROM urls WHERE analytics_key = $1";
            const keyCheckResult = await pool.query(keyCheckQuery, [analyticsKey]);

            if (keyCheckResult.rows[0].count == 0) {
                break; // Key is unique, exit loop
            }
            attempts++;
        } while (attempts < maxAttempts);

        if (attempts >= maxAttempts) {
            return new Response(JSON.stringify({ error: "Failed to generate unique analytics key, please try again" }), { status: 500 });
        }
    }
    // Insert the URL into the database
    // CREATE TABLE urls (
    // id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    // url TEXT NOT NULL,
    // user_id TEXT NOT NULL,
    // slug TEXT UNIQUE NOT NULL,
    // slug_random BOOLEAN NOT NULL DEFAULT false,
    // expiry TIMESTAMPTZ,
    // analytics_key TEXT UNIQUE,
    // platform_urls JSONB,
    // created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    // updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    // valid TEXT default 'unknown' NOT NULL
    // );
    const query = `
        INSERT INTO urls (url, user_id, slug, slug_random, expiry, analytics_key, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, gen_random_uuid(), NOW(), NOW())
        RETURNING id
    `;
    const values = [url, userId, finalSlug || randomSlug, slug_random, expiry];
    try {
        const { rows } = await pool.query(query, values);
        const id = rows[0].id;
        // If analytics is enabled, insert the analytics key
        if (analytics) {
            const analyticsQuery = `
                UPDATE urls 
                SET analytics_key = $1 
                WHERE id = $2
            `;
            await pool.query(analyticsQuery, [analyticsKey, id]);
        }
        return new Response(JSON.stringify({ shortened_url: `${process.env.NEXT_PUBLIC_SHORT_URL}/${finalSlug || randomSlug}`, id }), { status: 200 });
    } catch (error) {
        console.error("Error inserting URL:", error); return new Response(JSON.stringify({ error: "An error occurred while shortening the URL." }), { status: 500 });
    }
}
// URL validation bypasses: The current URL validation only checks basic URL format but doesn't validate against:
// Malicious URLs (phishing, malware)
// Internal network URLs (localhost, 127.0.0.1, 192.168.x.x)
// File:// protocol URLs
// JavaScript: protocol URLs
// Slug injection: While the regex validation helps, there could be edge cases with Unicode characters or encoded strings that bypass validation.