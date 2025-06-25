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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


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
        : "";

    const [date, setDate] = useState(initialDate);
    const [expiration_timeC, setExpirationTime] = useState(initialTime);
    const [dateError, setDateError] = useState("");
    const [showPlatformUrls, setShowPlatformUrls] = useState(platform_urls || false);
    const [platformUrls, setPlatformUrls] = useState(platform_urls || {});

    const [UTCTime, setUTCTime] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            setUTCTime(new Date(Date.now()));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        platformUrls.default = urlC; // Ensure the default URL is always set to the current URL
    }, [urlC]);

    useEffect(() => {
        platformUrls.default = urlC; // Ensure the default URL is always set to the current URL
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
                    <div className="flex items-center gap-2 mb-4">
                        <Switch
                            checked={showPlatformUrls}
                            onCheckedChange={(checked) => setShowPlatformUrls(checked)}
                            className=""
                        />
                        <span className="text-sm">Show Platform URLs</span>
                    </div>
                    {!showPlatformUrls && (
                        <Input
                            type="text"
                            placeholder="example.com"
                            value={urlC}
                            onChange={(e) => {
                                setUrl(e.target.value)
                                // Update the default/fallback URL in platform_urls
                                setPlatformUrls({ ...platformUrls, default: e.target.value });
                            }}
                            className="mb-4"
                        />
                    )}
                    {showPlatformUrls && (
                        <div className="flex flex-col gap-2">
                            <Table>
                                <TableCaption>Platform information is obtained through a user agent, and can be spoofed, do not use this if platform accuracy is critical.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="">Platform</TableHead>
                                        <TableHead className="w-full">Destination</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>iOS</TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                placeholder="example.com"
                                                value={platformUrls.ios || ""}
                                                onChange={(e) => setPlatformUrls({ ...platformUrls, ios: e.target.value })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Android</TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                placeholder="example.com"
                                                value={platformUrls.android || ""}
                                                onChange={(e) => setPlatformUrls({ ...platformUrls, android: e.target.value })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Windows</TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                placeholder="example.com"
                                                value={platformUrls.windows || ""}
                                                onChange={(e) => setPlatformUrls({ ...platformUrls, windows: e.target.value })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>MacOS</TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                placeholder="example.com"
                                                value={platformUrls.macos || ""}
                                                onChange={(e) => setPlatformUrls({ ...platformUrls, macos: e.target.value })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow />
                                    <TableRow>
                                        <TableCell>Desktop</TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                placeholder="example.com"
                                                value={platformUrls.desktop || ""}
                                                onChange={(e) => setPlatformUrls({ ...platformUrls, desktop: e.target.value })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Phone</TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                placeholder="example.com"
                                                value={platformUrls.phone || ""}
                                                onChange={(e) => setPlatformUrls({ ...platformUrls, phone: e.target.value })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Tablet</TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                placeholder="example.com"
                                                value={platformUrls.tablet || ""}
                                                onChange={(e) => setPlatformUrls({ ...platformUrls, tablet: e.target.value })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow />
                                    <TableRow>
                                        <TableCell>Chrome</TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                placeholder="example.com"
                                                value={platformUrls.chrome || ""}
                                                onChange={(e) => setPlatformUrls({ ...platformUrls, chrome: e.target.value })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Firefox</TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                placeholder="example.com"
                                                value={platformUrls.firefox || ""}
                                                onChange={(e) => setPlatformUrls({ ...platformUrls, firefox: e.target.value })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Safari</TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                placeholder="example.com"
                                                value={platformUrls.safari || ""}
                                                onChange={(e) => setPlatformUrls({ ...platformUrls, safari: e.target.value })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow />
                                    <TableRow className={""}>
                                        <TableCell className={""}>Default/Fallback (Required)</TableCell>
                                        <TableCell className={"my-auto"}>
                                            <Input
                                                type="text"
                                                placeholder="example.com"
                                                value={urlC}
                                                onChange={(e) => {
                                                    setUrl(e.target.value);
                                                    // Update the default/fallback URL in platform_urls
                                                    setPlatformUrls({ ...platformUrls, default: e.target.value });
                                                }}
                                                className="mb-4"
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
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
                    if (date) {

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
                    } else {
                        var expirationDate = null; // No expiration date set
                    }


                    // Here you would typically send the data to your server
                    const to_submit = {
                        url: urlC,
                        slug: slug_randomC ? null : slugC,
                        slug_random: slug_randomC,
                        expiry: expirationDate ? expirationDate.toISOString() : null,
                        platform_urls: showPlatformUrls ? platformUrls : {}, // Assuming this is handled elsewhere, as no checks are done here
                        id: id // Include the ID for editing.
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