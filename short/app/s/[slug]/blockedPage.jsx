"use client";

export default function BlockedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-lg mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Access Blocked</h1>

            <div className="bg-red-50 dark:bg-red-500/7 border border-red-200 rounded-md p-4 mb-6">
                <p className="mb-2">This link has been blocked due to security concerns or policy violations.</p>
                <p className="text-sm font-medium">We cannot guarantee the safety or validity of this link.</p>
            </div>

            <p className="text-sm text-gray-500">
                If you believe this is an error, please contact support.
            </p>
        </div>
    );
}