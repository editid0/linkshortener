"use client";

import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { redirect } from "next/navigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function InvalidPage({ url }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-lg mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Security Check Failed</h1>

            <div className="bg-red-50 dark:bg-red-500/7 border border-red-200 rounded-md p-4 mb-6">
                <p className="mb-2">We cannot verify the safety or validity of this link. It may lead to harmful content or be completely invalid.</p>
                <p className="text-sm font-medium">We are not responsible for any content on external websites.</p>
            </div>
            <div className="w-full max-w-md mx-auto mb-6">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Why am I seeing this warning?</AccordionTrigger>
                        <AccordionContent className={"text-left"}>
                            This link has not passed our security checks and may be suspicious. We cannot guarantee its safety or that it even leads to a valid website. By continuing, you acknowledge that you're proceeding at your own risk.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <Button
                className="w-full mb-4"
                onClick={() => redirect(url)}
                variant="destructive"
            >
                Proceed at Your Own Risk
            </Button>

            <p className="text-sm text-gray-500">
                Destination: <span className="font-medium break-all">{url}</span>
            </p>
            <p className="text-xs text-gray-400 mt-2">
                We are not responsible for the content, security or validity of external websites.
            </p>
        </div>
    );
}