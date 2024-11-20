import React from 'react';
import { Link } from '@inertiajs/react';

interface Percentage {
    name: string;
    percentage: number;
    color: string;
}

export function Percentage({ name, percentage, color }: Percentage) {
    return (
        <Link href="/" className="space-y-4 group">
            <div className="font-small group-hover:text-orange-400">
                {name}
            </div>
            <div className="relative border border-slate-200 rounded-lg w-full h-10">
                <div className="absolute inset-0 flex items-center justify-center text-black font-semibold">
                    {percentage}%
                </div>
                <div
                    className={`h-full ${color} rounded-lg`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </Link>
    )
}
