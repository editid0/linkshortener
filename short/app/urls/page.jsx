import { currentUser } from "@clerk/nextjs/server";
import Data from "./data";
import { Pool } from "pg";

export default async function Page() {
	const user = await currentUser();
	// Example of using a database connection (not used in this example)
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
	// expiry_date DATE,             -- stores just the date
	// expiration_time TIME,         -- stores just the time of day
	// analytics_key TEXT,
	// created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	// updated_at TIMESTAMP NOT NULL DEFAULT NOW()
	// );
	// Select data from database
	const query = "SELECT * FROM urls WHERE user_id = $1";
	const values = [user.id];
	const { rows } = await pool.query(query, values);
	console.log("User:", user);
	console.log("URLs:", rows);
	return (
		<>
			<div>
				<Data data={rows} />
			</div>
		</>
	);
}
