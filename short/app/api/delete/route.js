import { auth } from '@clerk/nextjs/server'
import { Pool } from 'pg';

export async function DELETE(request) {
    const { userId } = await auth();
    const { id } = await request.json();
    // Connect to the database
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: 5432,
    });
    // Check if the URL exists and belongs to the user
    const query = "SELECT * FROM urls WHERE user_id = $1 AND id = $2";
    const values = [userId, id];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
        return new Response(JSON.stringify({ error: "URL not found or you do not have permission to delete it." }), { status: 404 });
    }
    // Delete the URL from the database
    const deleteQuery = "DELETE FROM urls WHERE user_id = $1 AND id = $2";
    await pool.query(deleteQuery, values);
    // Return a success response
    return new Response(JSON.stringify({ message: "URL deleted successfully" }), { status: 200 });
}