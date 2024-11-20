import React from 'react';

interface ContactProps {
    forename: string;
    surname: string;
    img: string;
    email: string;
    telephone: string;
}

export function Contact({ forename, surname, img, email, telephone }: ContactProps) {

    function capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function removeFirstLetter(str: string) {
        return str.slice(1); // Corrected to remove the first letter
    }

    return (
        <div className="group flex flex-col cursor-pointer justify-center items-center bg-slate-100 border border-slate-200 text-slate-400 rounded-lg">
            <img className="rounded-t-lg" src={img} alt="contact" />
            <div className="text-sm p-4 text-black group-hover:text-orange-400">{forename} {surname}</div>
        </div>
    );
}

