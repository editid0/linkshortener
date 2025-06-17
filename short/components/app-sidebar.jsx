"use client"

import { Calendar, Home, Inbox, LoaderCircle, Search, Settings } from "lucide-react"

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
        url: "#",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
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
            <SidebarFooter>
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