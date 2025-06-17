"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
	const [url, setUrl] = useState("");
	const [isValid, setIsValid] = useState("");
	const handleChange = (e) => {
		setUrl(e.target.value);
	};
	useEffect(() => {
		if (url === "") {
			setIsValid("");
			return;
		}
		const regex =
			/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:\d+)?(\/[\w-./?%&=]*)?$/;
		setIsValid(regex.test(url));
	}, [url]);
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
					className={
						isValid === false
							? "border-red-500"
							: isValid === true
							? "border-green-500"
							: ""
					}
				/>
			</div>
			<div className="flex justify-center mt-4">
				<Button asChild>
					<Link
						href={`/shorten?url=${encodeURIComponent(btoa(url))}`}
					>
						Shorten
					</Link>
				</Button>
			</div>
		</>
	);
}
