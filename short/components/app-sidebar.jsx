"use client"

import { Calendar, Home, Inbox, Link, LoaderCircle, Search, Settings } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Your Links",
        url: "/urls",
        icon: Link,
    },

]

export function AppSidebar() {
    const { resolvedTheme } = useTheme()
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>URL Shortener</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className={"dark:bg-neutral-800 bg-neutral-200"}>
                <ClerkLoading>
                    <LoaderCircle className="animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedOut>
                        <Button asChild variant="outline">
                            <SignInButton mode="redirect" appearance={{
                                baseTheme: "dark",
                            }}>Sign In</SignInButton>
                        </Button>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonBox: {
                                        flexDirection: "row-reverse"
                                    },
                                    userButtonOuterIdentifier: {
                                        color: resolvedTheme === "dark" ? "#fff" : "#000",
                                    }
                                },
                            }}
                            showName={true}
                        />
                    </SignedIn>
                </ClerkLoaded>
            </SidebarFooter>
        </Sidebar>
    )
}