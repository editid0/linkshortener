import { SignedIn } from "@clerk/nextjs"

export default function NotFound({ slug = false }) {
    if (slug) {
        return (
            <>
                <div className="w-full mx-auto max-w-7xl px-2">
                    <div className="flex flex-col items-center justify-center min-h-screen w-full">
                        <div className="bg-gradient-to-r from-blue-500 to-fuchsia-500 dark:from-blue-400 dark:to-fuchsia-500 inline-block text-transparent bg-clip-text text-center">
                            <h1 className="text-9xl font-bold">404</h1>
                            <p className="text-2xl font-semibold">URL not found</p>
                            <SignedIn>
                                <p>The slug is all yours!</p>
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            <div className="w-full mx-auto max-w-7xl px-2">
                <div className="flex flex-col items-center justify-center min-h-screen w-full">
                    <div className="bg-gradient-to-r from-blue-500 to-fuchsia-500 dark:from-blue-400 dark:to-fuchsia-500 inline-block text-transparent bg-clip-text text-center">
                        <h1 className="text-9xl font-bold">404</h1>
                        <p className="text-2xl font-semibold">Sorry, page not found</p>
                    </div>
                </div>
            </div>
        </>
    )
}