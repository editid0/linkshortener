"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, SlidersHorizontal } from "lucide-react";
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

export default function Home() {
	const [url, setUrl] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [slug, setSlug] = useState("");
	const [randomSlug, setRandomSlug] = useState(true);
	const [analytics, setAnalytics] = useState(false);
	const [expiration, setExpiration] = useState();
	const [UTCTime, setUTCTime] = useState(new Date());
	const [AmPm, setAmPm] = useState("am");

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
							<SlidersHorizontal className="group-hover:cursor-pointer" color="lightgray" />
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
							<div className="flex flex-col gap-2 mt-2">
								<Label>
									Track Analytics?
								</Label>
								<Switch
									checked={analytics}
									onCheckedChange={(checked) => setAnalytics(checked)}
								/>
							</div>
							<Separator className={"my-2"} />
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
										<Calendar mode="single" selected={expiration} onSelect={setExpiration} />
									</PopoverContent>
								</Popover>
								<Select defaultValue={AmPm} onValueChange={(value) => setAmPm(value)}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Select expiry time" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="am">12:00 AM</SelectItem>
										<SelectItem value="pm">11:59 PM</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
			<div className="flex justify-center mt-4">
				<Button
					asChild
					disabled={!isValid}
					className={isValid ? "" : "opacity-50 cursor-not-allowed"}
					onClick={(e) => {
						if (!isValid) {
							e.preventDefault();
						}
					}}
				>
					<Link
						href={`/shorten?url=${encodeURIComponent(btoa(url))}?slug=${encodeURIComponent(btoa(slug))}&randomSlug=${randomSlug}&analytics=${analytics}&expiration=${expiration ? encodeURIComponent(expiration.toISOString()) : ""}&AmPm=${AmPm}`}
					>
						Shorten
					</Link>
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
			</p>
			<p className="text-muted-foreground text-sm mt-1">
				Sign in to track analytics.
			</p>
		</div>
	);
}
