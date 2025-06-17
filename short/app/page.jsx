"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"

export default function Home() {
	const [url, setUrl] = useState("");
	const [isValid, setIsValid] = useState(false);
	const handleChange = (e) => {
		setUrl(e.target.value);
	};
	useEffect(() => {
		if (url === "") {
			setIsValid(false);
			return;
		}
		if (url.length >= 4 && url.length <= 2048) {
			try {
				new URL(url);
				setIsValid(true);
			} catch (e) {
				// prefix with https if it doesn't start with http or https
				if (!url.startsWith("http://") && !url.startsWith("https://")) {
					try {
						new URL("https://" + url);
						setIsValid(true);
					} catch (e) {
						setIsValid(false);
					}
				}
			}
		} else {
			setIsValid(false);
		}
	}, [url]);
	return (
		<div className="flex flex-col items-center justify-center min-h-screen w-full">
			<h1 className="text-center text-4xl font-semibold mt-2">
				URL Shortener
			</h1>
			<div className="flex flex-row justify-center mt-4 max-w-md mx-auto">
				<Input
					value={url}
					onChange={handleChange}
					placeholder="Enter URL"
					className={"rounded-r-none"}
				/>
				<Dialog>
					<div className="flex items-center justify-center rounded-md selection:bg-primary dark:bg-input/30 bg-transparent rounded-l-none border border-input px-2 group cursor-pointer">
						<DialogTrigger>

							<SlidersHorizontal className="group-hover:cursor-pointer" />
						</DialogTrigger>
					</div>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Are you absolutely sure?</DialogTitle>
							<DialogDescription>
								This action cannot be undone. This will permanently delete your account
								and remove your data from our servers.
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</div>
			<div className="flex justify-center mt-4">
				<Button asChild disabled={!isValid} className={isValid ? "" : "opacity-50 cursor-not-allowed"} onClick={(e) => {
					if (!isValid) {
						e.preventDefault();
					}
				}}>
					<Link
						href={`/shorten?url=${encodeURIComponent(btoa(url))}`}
					>
						Shorten
					</Link>
				</Button>
			</div>
			<p className="text-muted-foreground text-sm mt-1">Usage is subject to our <Link href={"/tos"} className="underline">TOS</Link> and <Link href={"/privacy"} className="underline">Privacy</Link> policy.</p>
			<p className="text-muted-foreground text-sm mt-1">Sign in to track analytics.</p>
		</div>
	);
}
