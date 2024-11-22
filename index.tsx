import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSort, FaSortAlphaDownAlt, FaSortAlphaDown } from "react-icons/fa";
import { PiDeviceMobileFill } from "react-icons/pi";
import { MdDesktopWindows } from "react-icons/md";
import { IoHelpBuoy } from "react-icons/io5";
import { Transition } from '@headlessui/react';
import { CreateModal as CreateProjectModal } from "@/Components/Table/Modals/CreateModal";
import Dropdown from "@/Components/Dropdown";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

// Update TableProps to use the User type for the user property
interface TableProps {
    results: { [key: string]: any }[];
    fields: any[];
}

export function Table({ results = [], fields = [] }: TableProps) {

    const pageSlug = window.location.pathname;

    const headers = results && results.length > 0 && results[0] ? Object.keys(results[0]) : [];
    const [shownHeaders, setShownHeaders] = useState<string[]>([]);
    const [selectedHeader, setSelectedHeader] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
    const [sortedResults, setSortedResults] = useState<any[]>(results);
    const [display, setDisplay] = useState<'desktop' | 'mobile'>('desktop');


    // Effect to load the display mode from localStorage when the component mounts
    useEffect(() => {
        const storedDisplay = localStorage.getItem('taskManagerDisplayState');
        if (storedDisplay) {
            setDisplay(storedDisplay as 'desktop' | 'mobile'); // Ensure type safety
        }
    }, []); // Empty dependency array means this runs once when the component mounts


    // Effect to save the display mode to localStorage whenever it changes
    useEffect(() => {
        if (display) {
            localStorage.setItem('taskManagerDisplayState', display);
        }
    }, [display]); // Runs every time 'display' changes


    useEffect(() => {
        // Retrieve hidden headers from localStorage
        const storedHeaders = JSON.parse(localStorage.getItem(`${pageSlug}-hiddenHeaders`) || "[]");

        // Initialize shownHeaders (start with all headers not in localStorage)
        const initialHeaders = headers.filter(header => !storedHeaders.includes(header));

        // Update only if `shownHeaders` is different from `initialHeaders`
        setShownHeaders((prevShownHeaders) => {
            if (JSON.stringify(prevShownHeaders) !== JSON.stringify(initialHeaders)) {
                return initialHeaders;
            }
            return prevShownHeaders; // Avoid triggering a re-render
        });
    }, [headers, pageSlug]);


    useEffect(() => {
        localStorage.setItem('taskManagerDisplayState', display);
    }, [display]);


    const handleSort = (direction: "asc" | "desc") => {
        if (selectedHeader) {
            setSortDirection(direction);

            // Sort the results based on the selectedHeader and direction
            const sorted = [...results].sort((a, b) => {
                const valueA = a[selectedHeader] ?? ""; // Handle undefined or null values
                const valueB = b[selectedHeader] ?? "";

                if (valueA < valueB) return direction === "asc" ? -1 : 1;
                if (valueA > valueB) return direction === "asc" ? 1 : -1;
                return 0;
            });

            setSortedResults(sorted);
        }
    };

    const handleCheckboxChange = (header: string) => {
        let updatedHeaders: string[];

        if (shownHeaders.includes(header)) {
            // Hide header
            updatedHeaders = shownHeaders.filter(h => h !== header);
        } else {
            // Show header
            updatedHeaders = [...shownHeaders, header];
        }

        setShownHeaders(updatedHeaders);

        // Update local storage with hidden headers (inverse of shownHeaders)
        const hiddenHeaders = headers.filter(h => !updatedHeaders.includes(h));
        localStorage.setItem(`${pageSlug}-hiddenHeaders`, JSON.stringify(hiddenHeaders));
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-row justify-between items-center gap-4 pl-4">
                <div className="flex flex-row justify-start items-center gap-8">
                    <CreateProjectModal
                        fields={fields}
                        submitUrl={'/dashboard/projects'}
                    />
                    {/* Filter Dropdown */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex flex-col justify-center items-center gap-2 group">
                                <FaFilter className="text-xl" />
                                <div className="group-hover:text-orange-500">Filter</div>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align='left' contentClasses='py-1 bg-white w-96'>
                            <div className="p-4 border-b font-semibold">Display Headers</div>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {headers.map((header, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-row justify-between items-center hover:bg-slate-100 p-1 rounded-lg"
                                    >
                                        <label>{header.substring(0, 8)}</label>
                                        <input
                                            type="checkbox"
                                            className="rounded-md cursor-pointer"
                                            checked={shownHeaders.includes(header)}
                                            onChange={() => handleCheckboxChange(header)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Dropdown.Content>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex flex-col justify-center items-center gap-2 group">
                                <FaSort className="text-xl" />
                                <div className="group-hover:text-orange-500">Sort</div>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align='left' contentClasses='py-1 bg-white w-96'>
                            <div className="p-4 border-b font-semibold">Sort Column</div>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {shownHeaders.map((header: string, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-row justify-between items-center hover:bg-slate-100 p-1 rounded-lg"
                                    >
                                        <label>{header.substring(0, 8)}</label>
                                        <input
                                            type="radio"
                                            name="sortColumn"
                                            value={header}
                                            checked={selectedHeader === header}
                                            onChange={() => setSelectedHeader(header)}
                                            className="rounded-md cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 flex flex-row justify-center gap-12 text-4xl">
                                <button
                                    onClick={() => handleSort("asc")}
                                    className={sortDirection === "asc" ? "text-orange-500" : ""}
                                >
                                    <FaSortAlphaDown className="hover:text-orange-500" />
                                </button>
                                <button
                                    onClick={() => handleSort("desc")}
                                    className={sortDirection === "desc" ? "text-orange-500" : ""}
                                >
                                    <FaSortAlphaDownAlt className="hover:text-orange-500" />
                                </button>
                            </div>
                        </Dropdown.Content>
                    </Dropdown>
                    <button onClick={() => setDisplay("desktop")} className={`flex flex-col justify-center items-center gap-2 group ${display === 'desktop' ? 'text-orange-500' : ''}`}>
                        <MdDesktopWindows className="text-xl" />
                        <div className="group-hover:text-orange-500">Desktop</div>
                    </button>
                    <button onClick={() => setDisplay("mobile")} className={`flex flex-col justify-center items-center gap-2 group ${display === 'mobile' ? 'text-orange-500' : ''}`}>
                        <PiDeviceMobileFill className="text-xl" />
                        <div className="group-hover:text-orange-500">Mobile</div>
                    </button>
                    <button className="flex flex-col justify-center items-center gap-2 group">
                        <IoHelpBuoy className="text-xl" />
                        <div className="group-hover:text-orange-500">Help</div>
                    </button>
                </div>
                {/* Search */}
                <div className="flex flex-row justify-end items-center gap-4">
                    <input
                        className="rounded-lg border border-gray-300 p-2 focus:outline-none"
                        type="text"
                        placeholder="Search..."
                        aria-label="Search input"
                    />
                    <button
                        className="flex flex-row justify-center items-center rounded-lg p-3 border border-slate-500 w-12 hover:text-orange-500"
                        aria-label="Search button"
                    >
                        <FaSearch />
                    </button>
                </div>
            </div>
            <Transition
                key={pageSlug}
                appear
                show={true}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                {/* Desktop View */}
                {display === 'desktop' && (
                    <Transition
                        key="desktop"
                        appear
                        show={true}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="overflow-auto shadow rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {shownHeaders.map((header) => (
                                            <th
                                                key={header}
                                                className="px-4 py-2 font-semibold text-sm uppercase tracking-wider text-gray-700 text-left"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                        <th className="px-4 py-2 font-semibold text-sm uppercase tracking-wider text-gray-700 text-left">
                                            Options
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedResults.length > 0 ? (
                                        sortedResults.map((result, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                {shownHeaders.map((header) => (
                                                    <td key={header} className="px-4 py-2">
                                                        {result[header]} {/* Display the value for the header */}
                                                    </td>
                                                ))}
                                                <td className="px-4 py-2">
                                                    {/* Additional Options Column if needed */}
                                                    <Dropdown>
                                                        <Dropdown.Trigger>
                                                            <button className="text-blue-600 hover:underline">Edit</button>
                                                        </Dropdown.Trigger>
                                                        <Dropdown.Content>
                                                            <div className="p-4 space-y-4 flex flex-col">
                                                                <button>
                                                                    <div className="hover:bg-yellow-100 p-2 rounded text-left">Update</div>
                                                                </button>
                                                                <button>
                                                                    <div className="hover:bg-red-100 p-2 rounded text-left">Delete</div>
                                                                </button>
                                                            </div>
                                                        </Dropdown.Content>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={shownHeaders.length + 1}
                                                className="px-4 py-2 text-center text-gray-500"
                                            >
                                                There are currently no results.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Transition>
                )}
                {/* Mobile View */}
                {display === 'mobile' && (
                    <Transition
                        key="mobile"
                        appear
                        show={true}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="max-w-full mx-auto my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedResults.length > 0 ? (
                                sortedResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className="w-full mx-auto bg-white shadow-lg rounded-lg border border-gray-200 p-6"
                                    >
                                        {/* Loop through the keys of the result object */}
                                        {Object.keys(result).map(
                                            (key) =>
                                                key !== 'id' &&
                                                key !== 'actions' && (
                                                    <div
                                                        key={key}
                                                        className="text-sm text-gray-600 mb-4"
                                                    >
                                                        <p>
                                                            <span className="font-medium">
                                                                {key
                                                                    .replace(
                                                                        /([A-Z])/g,
                                                                        ' $1'
                                                                    )
                                                                    .toUpperCase()}
                                                                :
                                                            </span>{' '}
                                                            {result[key]}
                                                        </p>
                                                    </div>
                                                )
                                        )}
                                        {/* Actions */}
                                        <div className="flex justify-end space-x-4">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none">
                                                        Edit
                                                    </button>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content>
                                                    <div>Hello</div>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-flow justify-center items-center">
                                    There are currently no results.
                                </div>
                            )}
                        </div>
                    </Transition>
                )}
            </Transition>
        </div>
    );
}