import React, { useEffect } from 'react';

interface PlaySoundProps {
    source: string; // Define the 'source' prop as a string
}

export function PlaySound({ source }: PlaySoundProps) {
    useEffect(() => {
        // Play the sound when the component mounts
        const audio = new Audio(source);
        audio.play().catch((error) => {
            console.error('Failed to play audio:', error);
        });
    }, [source]); // Run the effect when 'source' changes

    return (
        <></>
    );
}
