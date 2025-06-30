"use client";

import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function UnknownPage({ url }) {
    const [countdown, setCountdown] = useState(5);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    redirect(url);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [paused]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-lg mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Security Check Pending</h1>

            <div className="bg-amber-50 dark:bg-amber-500/7 border border-amber-200 rounded-md p-4 mb-6">
                <p className="mb-2">This link has not been verified yet. Our system will check it shortly.</p>
                <div className="text-xl font-medium my-3">
                    Redirecting in <span className="font-bold text-amber-600">{countdown}</span> seconds
                </div>
                <div className="flex justify-center items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPaused((prev) => !prev)}
                        className="text-xs flex items-center gap-1"
                    >
                        {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                        {paused ? "Resume countdown" : "Pause countdown"}
                    </Button>
                </div>
            </div>
            <div className="w-full max-w-md mx-auto mb-6">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Is this your link?</AccordionTrigger>
                        <AccordionContent className={"text-left"}>
                            This message appears when a link has not been checked by our system yet. It may be a new link, or a recently updated link that requires verification. This process is automatic and this message will disappear once the link is verified.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <Button
                className="w-full mb-4"
                onClick={() => redirect(url)}
            >
                Continue to Destination Now
            </Button>

            <p className="text-sm text-gray-500">
                Destination: <span className="font-medium break-all">{url}</span>
            </p>
        </div>
    );
}