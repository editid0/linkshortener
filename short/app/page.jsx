"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, SlidersHorizontal, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useTheme } from "next-themes";
import { SignedOut } from "@clerk/nextjs";
import moment from "moment";
import posthog from "posthog-js";

export default function Home() {
	const [url, setUrl] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [slug, setSlug] = useState("");
	const [randomSlug, setRandomSlug] = useState(true);
	const [analytics, setAnalytics] = useState(false);
	const [expiration, setExpiration] = useState();
	const [UTCTime, setUTCTime] = useState(new Date()); const [expiryTime, setExpiryTime] = useState("00:00");
	const [expiryDate, setExpiryDate] = useState(""); const [resultDialogOpen, setResultDialogOpen] = useState(false);
	const [shortenedUrl, setShortenedUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!expiration) return;
		const utcDate = new Date(expiration);
		// Store as a string, exactly as it is
		const formattedDate = format(utcDate, "dd/MM/yyyy");
		console.log("Formatted Date:", formattedDate);
		setExpiryDate(formattedDate);
	}, [expiration]);

	// Set the UTC time to the current UTC time every second
	useEffect(() => {
		const interval = setInterval(() => {
			setUTCTime(new Date(Date.now()));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

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
	useEffect(() => {
		if (expiration) {
			const now = new Date();
			now.setHours(0, 0, 0, 0);
			if (expiration < now) {
				setExpiration();
			}
		}
	}, [expiration])
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
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
					<div className="flex items-center justify-center rounded-md selection:bg-primary dark:bg-input/30 bg-transparent rounded-l-none border border-input px-2">
						<DialogTrigger>
							<SlidersHorizontal className="cursor-pointer" color={mounted && resolvedTheme == "dark" ? "lightgrey" : "black"} />
						</DialogTrigger>
					</div>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Customise options</DialogTitle>
						</DialogHeader>
						<div>
							<div className="flex flex-col gap-2">
								<Label>
									Use Custom Slug?
								</Label>
								<Switch checked={!randomSlug} onCheckedChange={(checked) => {
									setRandomSlug(!checked);
									if (checked) {
										setSlug("");
									}
								}}
								/>
							</div>
							{!randomSlug && (
								<div className="flex flex-col gap-2">
									<Label className="mt-2">
										Custom Slug
									</Label>
									<Input
										value={slug}
										onChange={(e) => setSlug(e.target.value)}
										placeholder="Enter custom slug"
										className="w-full"
									/>
								</div>
							)}
							<Separator className={"my-2"} />
							{/* <div className="flex flex-col gap-2 mt-2 py-1">
								<Label>
									Track Analytics?
								</Label>
								<Switch
									checked={analytics}
									onCheckedChange={(checked) => setAnalytics(checked)}
								/>
							</div>
							<Separator className={"my-2"} /> */}
							<div className="flex flex-col gap-2 mt-2">
								<Label>
									Expiration Date
								</Label>
								<p className="text-sm text-muted-foreground">Based on UTC time: {formatInTimeZone(UTCTime, "UTC", "PPP p")}</p>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											data-empty={!expiration}
											className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
										>
											<CalendarIcon />
											{expiration ? format(expiration, "PPP") : <span>Select a date</span>}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar mode="single" selected={expiration} onSelect={(e) => {
											if (e) {
												setExpiration(e);
											} else {
												setExpiration(undefined);
											}
										}} />
									</PopoverContent>
								</Popover>
								<Input
									type="time"
									value={expiryTime}
									onChange={(e) => {
										setExpiryTime(e.target.value);
									}
									}
									className="mt-2 w-fit"
									placeholder="Select time"
								/>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
			<div className="flex justify-center mt-4">
				<Button
					disabled={!isValid || isLoading}
					className={isValid ? "" : "opacity-50 cursor-not-allowed"}
					onClick={async (e) => {
						e.preventDefault();
						if (!isValid) return;
						setIsLoading(true);
						try {
							// Make an API call to /api/shorten with the URL, slug, randomSlug, analytics, expiration, expiryDate, and expiryTime
							var to_send = {
								url: url,
								slug: slug,
								slug_random: randomSlug,
								analytics: analytics,
								expiration: expiration ? expiryDate : "",
								expiryTime: expiryTime
							}
							// Make a post request to the API
							const res = await fetch("/api/shorten", {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify(to_send),
							});

							const data = await res.json();

							if (data.error) {
								alert(data.error);
							} else {
								setShortenedUrl(data.shortened_url);
								setResultDialogOpen(true);
								posthog.capture("url_shortened", {
									url: url,
								});
							}
						} catch (err) {
							console.error(err);
							alert("An error occurred while shortening the URL.");
						} finally {
							setIsLoading(false);
						}
					}}
				>
					{isLoading ? "Shortening..." : "Shorten"}
				</Button>
			</div>
			<p className="text-muted-foreground text-sm mt-1">
				Usage is subject to our{" "}
				<Link href={"/tos"} className="underline">
					TOS
				</Link>{" "}
				and{" "}
				<Link href={"/privacy"} className="underline">
					Privacy
				</Link>{" "}
				policy.
			</p>			<SignedOut>
				<p className="text-muted-foreground text-sm mt-1">
					Sign in to save and edit your shortened URLs.
				</p>
			</SignedOut>

			{/* Result Dialog */}
			<Dialog open={resultDialogOpen} onOpenChange={(open) => {
				setResultDialogOpen(open);
				if (!open) {
					setCopied(false);
				}
			}}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>URL Shortened Successfully!</DialogTitle>
						<DialogDescription>
							Your shortened URL is ready to use. You can copy it below.
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center space-x-2">
						<div className="grid flex-1 gap-2">
							<Input
								id="shortened-url"
								value={shortenedUrl}
								readOnly
								className="h-9"
							/>
						</div>						<Button
							type="button"
							size="sm"
							className="px-3"
							variant={copied ? "default" : "outline"}
							onClick={async () => {
								try {
									await navigator.clipboard.writeText(shortenedUrl);
									setCopied(true);
									setTimeout(() => setCopied(false), 2000);
									posthog.capture("url_copied", {
										shortened_url: shortenedUrl,
									});
								} catch (err) {
									console.error('Failed to copy:', err);
								}
							}}
						>
							{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
							<span className="sr-only">{copied ? 'Copied!' : 'Copy'}</span>
						</Button>
					</div>
					<div className="flex justify-center">
						<Button
							variant="outline"
							onClick={() => setResultDialogOpen(false)}
						>
							Close
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
