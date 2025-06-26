import NotFound from "@/app/not-found";
import { Pool } from "pg";

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
    return (
        <>
            <p>Bah</p>
        </>
    )
}