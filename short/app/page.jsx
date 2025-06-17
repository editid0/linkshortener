"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
	const [url, setUrl] = useState("");
	const handleChange = (e) => {
		setUrl(e.target.value);
	};
	return (
		<>
			<h1 className="text-center text-4xl font-semibold mt-2">
				Link Shortener
			</h1>
			<div className="flex justify-center mt-4 max-w-md mx-auto">
				<Input
					value={url}
					onChange={handleChange}
					placeholder="Enter URL"
				/>
			</div>
		</>
	);
}
