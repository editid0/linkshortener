import { LoaderCircle } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <LoaderCircle className="animate-spin h-8 w-8 text-blue-500" />
            <p className="ml-4 text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
    );
}