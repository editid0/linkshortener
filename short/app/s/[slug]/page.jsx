import NotFound from "@/app/not-found";
import { Pool } from "pg";
import { headers } from "next/headers";
import { UAParser } from 'ua-parser-js';
import { redirect } from "next/navigation";
import UnknownPage from "./unknownPage";
import InvalidPage from "./invalidPage";
import BlockedPage from "./blockedPage";

export default async function Page({ params }) {
    const { slug } = await params;
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: 5432,
    });
    // Fetch the URL data based on the slug
    const query = "SELECT * FROM urls WHERE slug = $1";
    const values = [slug];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
        // Return a 404 page if the slug does not exist
        return (
            <>
                <NotFound slug={true} />
            </>
        );
    }
    // Get the user agent from request headers
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || "unknown";
    // Parse the user agent
    const parser = new UAParser();
    const parsedUA = parser.setUA(userAgent).getResult();
    var os = parsedUA.os.name?.toLowerCase() || "unknown";
    var device = parsedUA.device.type?.toLowerCase() || "desktop";
    var browser = parsedUA.browser.name?.toLowerCase() || "unknown";
    const platform_urls = rows[0].platform_urls || {};
    var url = rows[0].url;
    var is_url_final = false;
    const valid = rows[0].valid || "unknown";
    if (platform_urls == {}) {
        is_url_final = true;
        return redirect(url);
    } else {
        // Start OS
        if (platform_urls["ios"] && os === "ios" && !is_url_final) {
            url = platform_urls["ios"];
            is_url_final = true;
        }
        if (platform_urls["android"] && os === "android" && !is_url_final) {
            url = platform_urls["android"];
            is_url_final = true;
        }
        if (platform_urls["windows"] && os === "windows" && !is_url_final) {
            url = platform_urls["windows"];
            is_url_final = true;
        }
        if (platform_urls["macos"] && os === "macos" && !is_url_final) {
            url = platform_urls["macos"];
            is_url_final = true;
        }
        // End OS
        // Start device
        if (platform_urls["desktop"] && device === "desktop" && !is_url_final) {
            url = platform_urls["desktop"];
            is_url_final = true;
        }
        if (platform_urls["phone"] && device === "mobile" && !is_url_final) {
            url = platform_urls["phone"];
            is_url_final = true;
        }
        if (platform_urls["tablet"] && device === "tablet" && !is_url_final) {
            url = platform_urls["tablet"];
            is_url_final = true;
        }
        // End device
        // Start browser
        if (platform_urls["chrome"] && browser === "chrome" && !is_url_final) {
            url = platform_urls["chrome"];
            is_url_final = true;
        }
        if (platform_urls["firefox"] && browser === "firefox" && !is_url_final) {
            url = platform_urls["firefox"];
            is_url_final = true;
        }
        if (platform_urls["safari"] && (browser === "safari" || browser === "mobile safari") && !is_url_final) {
            url = platform_urls["safari"];
            is_url_final = true;
        }
        // End browser
        // Default URL
        if (platform_urls["default"] && !is_url_final) {
            url = platform_urls["default"];
            is_url_final = true;
        }
        if (valid === "unknown") {
            return <UnknownPage url={url} />
        }
        if (valid === "invalid") {
            return <InvalidPage url={url} />
        }
        if (valid === "blocked") {
            return <BlockedPage />
        }
        return redirect(url);
    }
}