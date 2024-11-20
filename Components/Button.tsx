import React from 'react';
import { Link, usePage } from '@inertiajs/react';

interface ButtonProps {
    title: string;
    url: string;
}

export function Button({ title, url }: ButtonProps) {

    const { url: currentUrl } = usePage(); // Inertia's current page URL

    // Compare the current URL with the target URL
    const isActive = currentUrl === url;

    function capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function removeFirstLetter(str: string) {
        return str.slice(11); // Corrected to remove the first letter
    }

    return (
        <Link href={url} preserveScroll preserveState>
            <div className="group relative cursor-pointer flex flex-row justify-center items-center bg-slate-100 border border-slate-200 rounded-lg p-4">
                <div className="text-black">{capitalizeFirstLetter(title)}</div>
                <div className={`absolute -bottom-0.5 mx-auto ${isActive ? 'bg-blue-300' : 'bg-slate-400'} group-hover:bg-blue-300 h-1 w-16 group-hover:w-32 transition-all rounded-lg`} />
            </div>
        </Link>
    );
}

