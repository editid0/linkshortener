"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator";
import { use, useEffect, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";


export default function EditForm({ expiry, slug, slug_random, url, platform_urls, id }) {
    // expiry is now a Date object (or null/undefined)
    const [urlC, setUrl] = useState(url || "");
    const [slugC, setSlug] = useState(slug || "");
    const [slug_randomC, setSlugRandom] = useState(slug_random ?? true);
    const [open, setOpen] = useState(false);

    // If expiry is a Date, extract date and time parts
    const initialDate = expiry instanceof Date ? new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate()) : null;
    const initialTime = expiry instanceof Date
        ? expiry.toISOString().slice(11, 16) // "HH:MM"
        : "15:30";

    const [date, setDate] = useState(initialDate);
    const [expiration_timeC, setExpirationTime] = useState(initialTime);
    const [dateError, setDateError] = useState("");

    const [UTCTime, setUTCTime] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            setUTCTime(new Date(Date.now()));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (date) {
            const timeParts = expiration_timeC.split(":");
            if (timeParts.length === 2) {
                const hours = parseInt(timeParts[0], 10);
                const minutes = parseInt(timeParts[1], 10);

                // Create a Date object from components, interpreting them as UTC
                const selectedDateTimeUTC = new Date(Date.UTC(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    hours,
                    minutes
                ));

                if (selectedDateTimeUTC < UTCTime) {
                    setDateError("Expiration date cannot be in the past.");
                } else {
                    setDateError("");
                }
            } else {
                setDateError("Invalid time format. Please use HH:MM.");
            }
        } else {
            setDateError("");
        }
    }, [date, expiration_timeC, UTCTime]);

    useEffect(() => {
        // If slug_randomC is true, reset slugC to an empty string
        if (slug_randomC) {
            setSlug("");
        }
        // Replace non-alphanumeric characters with dashes
        const slugRegex = /[^a-zA-Z0-9-_]+/g;
        var slugCTrimmed = slugC.replace(slugRegex, '-');
        setSlug(slugCTrimmed);
    }, [slugC])

    return (
        <>
            <div className="flex flex-col gap-4 mx-auto max-w-xl w-full dark:bg-neutral-900/50 p-4 h-fit my-2 rounded-md border-2">
                <h1 className="text-center font-bold text-2xl">Edit URL</h1>
                <div className={"border-2 rounded-md p-4 transition-all duration-300" + (urlC == url ? " border-accent" : " border-accent-foreground")}>
                    <h2 className="font-semibold">URL</h2>
                    <Separator className={"my-2"} />
                    <Input
                        type="text"
                        placeholder="example.com"
                        value={urlC}
                        onChange={(e) => setUrl(e.target.value)}
                        className="mb-4"
                    />
                </div>
                <div className={"border-2 rounded-md p-4 transition-all duration-300" + (((slug_randomC == slug_random) && (slug == slugC)) ? " border-accent" : " border-accent-foreground")}>
                    <h2 className="font-semibold">Slug</h2>
                    <Separator className={"my-2"} />
                    <div className="flex items-center gap-2 mb-4">
                        <Switch
                            checked={slug_randomC}
                            onCheckedChange={(checked) => setSlugRandom(checked)}
                        />
                        <span className="text-sm">Random Slug</span>
                    </div>
                    {!slug_randomC && (
                        <Input
                            type="text"
                            placeholder="example-slug"
                            value={slugC}
                            onChange={(e) => setSlug(e.target.value)}
                            className="mb-4"
                        />)}
                </div>
                <div className={
                    "border-2 rounded-md p-4 transition-all duration-300" +
                    (
                        (date?.getTime?.() === initialDate?.getTime?.() && expiration_timeC === initialTime)
                            ? " border-accent"
                            : " border-accent-foreground"
                    )
                }>
                    <h2 className="font-semibold">Expiration</h2>
                    <p className="text-muted-foreground text-sm">Expiration is based on UTC time: {formatInTimeZone(UTCTime, "UTC", "PPP p")}</p>
                    <Separator className={"my-2"} />
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="date-picker" className="px-1">
                                Date
                            </Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date-picker"
                                        className="w-32 justify-between font-normal"
                                    >
                                        {date ? date.toLocaleDateString() : "Select date"}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setDate(date);
                                            setOpen(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="time-picker" className="px-1">
                                Time
                            </Label>
                            <Input
                                type="time"
                                id="time-picker"
                                step="60"
                                placeholder="10:30"
                                className="bg-backgrund appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                value={expiration_timeC}
                                onChange={(e) => {
                                    const timeValue = e.target.value;
                                    setExpirationTime(timeValue);
                                }}
                            />
                        </div>
                    </div>
                    <p className="dark:text-red-400 mt-1">{dateError}</p>
                </div>
                <Button onClick={() => {
                    if (dateError) {
                        alert("Please fix the errors before saving.");
                        return;
                    }
                    const formattedDate = date ? date.toISOString().split('T')[0] : null;
                    const formattedTime = expiration_timeC ? expiration_timeC : "15:30"; // Default time if not set
                    const [hours, minutes] = formattedTime.split(':').map(Number);
                    const expirationDate = new Date(Date.UTC(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                        hours,
                        minutes
                    ));

                    // Here you would typically send the data to your server
                    const to_submit = {
                        url: urlC,
                        slug: slug_randomC ? null : slugC,
                        slug_random: slug_randomC,
                        expiry: expirationDate.toISOString(),
                        platform_urls: platform_urls, // Assuming this is handled elsewhere
                        id: id // Include the ID for editing
                    };
                    // Make a post request to /api/edit
                    fetch(`/api/edit`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(to_submit),
                    }).then(response => {
                        if (response.ok) {
                            // Redirect to /urls
                            window.location.href = `/urls`;
                        } else {
                            response.json().then(data => {
                                alert(`Error: ${data.error || "Failed to update URL"}`);
                            });
                        }
                    });
                }}>
                    Save Changes
                </Button>
            </div>
        </>
    )
}