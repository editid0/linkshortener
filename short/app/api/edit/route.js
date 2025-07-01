import { auth } from '@clerk/nextjs/server'
import moment from 'moment';
import { Pool } from 'pg';
import crypto from 'crypto';

function validateURL(url) {
    try {
        let parsed = new URL(url);
        // Must have a valid protocol (http or https) and a hostname
        return (
            /^(https?):$/.test(parsed.protocol) &&
            !!parsed.hostname
        );
    } catch {
        // Try prepending https:// and validating again
        if (!/^https?:\/\//i.test(url)) {
            try {
                let parsed = new URL("https://" + url);
                return (
                    /^(https?):$/.test(parsed.protocol) &&
                    !!parsed.hostname
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
    // Allow null, undefined, or empty string (no expiry)
    if (!expiry || expiry === '') {
        return true;
    }
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

function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function validatePlatformURLs(platform_urls) {
    if (isEmptyObject(platform_urls)) {
        return true; // Empty object is valid
    }
    // Only the following keys are allowed, if there are any extra keys, return false
    const allowedKeys = ['ios', 'macos', 'phone', 'chrome', 'safari', 'tablet', 'android', 'default', 'desktop', 'firefox', 'windows'];
    for (const key in platform_urls) {
        if (!allowedKeys.includes(key)) {
            return false;
        }
        // If value is null, undefined, or empty string, it is valid
        if (!platform_urls[key] || platform_urls[key] === '') {
            continue;
        }
        // Check if the value is a valid URL
        if (!validateURL(platform_urls[key])) {
            return false;
        }
    }
    // Make sure that default is present and is a valid URL
    if (!platform_urls.default || platform_urls.default === '') {
        return false;
    }
    if (!validateURL(platform_urls.default)) {
        return false;
    }
    return true;
}

export async function POST(request) {
    const { userId } = await auth();
    // Get JSON data from the request body
    const { url, slug, slug_random, expiry, platform_urls, id } = await request.json();
    if (!validateURL(url)) {
        return new Response(JSON.stringify({ error: "Invalid URL" }), { status: 400 });
    }
    if (slug && !validateSlug(slug)) {
        return new Response(JSON.stringify({ error: "Invalid slug" }), { status: 400 });
    } if (expiry !== null && expiry !== undefined && expiry !== '' && !validateExpiry(expiry)) {
        return new Response(JSON.stringify({ error: "Invalid expiry date" }), { status: 400 });
    }
    if ((platform_urls || platform_urls != {}) && !validatePlatformURLs(platform_urls)) {
        return new Response(JSON.stringify({ error: "Invalid platform URLs" }), { status: 400 });
    }
    // Connect to the database
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: 5432,
    });
    // Check that the user owns the id
    const query = "SELECT * FROM urls WHERE user_id = $1 AND id = $2";
    const values = [userId, id];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
        return new Response(JSON.stringify({ error: "URL not found or you do not have permission to edit it." }), { status: 404 });
    }
    // Check if the slug is already taken
    if (slug && !slug_random) {
        const slugQuery = "SELECT * FROM urls WHERE slug = $1 AND id != $2";
        const slugValues = [slug, id];
        const slugResult = await pool.query(slugQuery, slugValues);
        if (slugResult.rows.length > 0) {
            return new Response(JSON.stringify({ error: "Slug already taken" }), { status: 400 });
        }
    }
    var slugValue = slug;
    // If slug_random is true, generate a random slug
    if (slug_random) {
        // Generate a random slug of 5-8 characters, using alphanumeric characters, dashes, and underscores, use crypto to generate a random string
        slugValue = crypto.randomBytes(5).toString('base64url').slice(0, 8);
        // Ensure the random slug is valid
        if (!validateSlug(slugValue)) {
            return new Response(JSON.stringify({ error: "Failed to generate a valid random slug" }), { status: 500 });
        }
        // Set slug_random to false in the database
        await pool.query(`
            UPDATE urls
            SET slug_random = false 
            WHERE id = $1 AND user_id = $2
        `, [id, userId]);
    }
    // Remove leading and trailing whitespace, dashes, and underscores from the slug
    const trimmedSlug = slugValue.replace(/^[-_\s]+|[-_\s]+$/g, '');
    if (trimmedSlug.length < 3 || trimmedSlug.length > 63) {
        return new Response(JSON.stringify({ error: "Slug must be between 3 and 63 characters long" }), { status: 400 });
    }
    // Update the URL in the database
    const updateQuery = `
        UPDATE urls 
        SET url = $1, slug = $2, slug_random = $3, expiry = $4, platform_urls = $5, updated_at = NOW(), valid = 'unknown', valid_msg = '' 
        WHERE id = $6 AND user_id = $7
    `;
    const updateValues = [url, trimmedSlug, slug_random, expiry, platform_urls, id, userId];
    try {
        await pool.query(updateQuery, updateValues);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Error updating URL:", error);
        return new Response(JSON.stringify({ error: "Failed to update URL" }), { status: 500 });
    }
}