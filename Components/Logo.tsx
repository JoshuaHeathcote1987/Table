import React from 'react'

interface LogoProps {
    size: string;
}

export function Logo({ size }: LogoProps) {
    return (
        <img className={`rounded-full ${size}`} src="/images/logo.png" />
    )
}
