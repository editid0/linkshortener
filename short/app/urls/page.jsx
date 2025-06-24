import { currentUser } from "@clerk/nextjs/server";
import Data from "./data";
import { Pool } from "pg";

export default async function Page() {
    const user = await currentUser();
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: 5432,
    });
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
    // Select data from database
    const query = "SELECT * FROM urls WHERE user_id = $1";
    const values = [user.id];
    const { rows } = await pool.query(query, values);
    console.log("User:", user);
    console.log("URLs:", rows);
    return (
        <>
            <div className="w-full mx-auto max-w-7xl px-2">
                <Data data={rows} />
            </div>
        </>
    );
}
