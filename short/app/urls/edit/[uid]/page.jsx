import { Pool } from "pg";
import { currentUser } from "@clerk/nextjs/server";
import EditForm from "./form";

export default async function EditPage({ params }) {
    const { uid } = await params;

    const user = await currentUser();
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: 5432,
    });
    const query = "SELECT * FROM urls WHERE user_id = $1 AND id = $2";
    const values = [user.id, uid];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">URL not found or you do not have permission to edit it.</p>
            </div>
        );
    }
    const urlData = rows[0];
    const expiry = urlData.expiry;
    const slug = urlData.slug;
    const slug_random = urlData.slug_random;
    const url = urlData.url;
    const platform_urls = urlData.platform_urls;
    const id = urlData.id;
    return (
        <>
            <EditForm expiry={expiry} slug={slug} slug_random={slug_random} url={url} platform_urls={platform_urls} id={id} />
        </>
    );
}