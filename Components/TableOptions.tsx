import React, { useState } from 'react';
import { FaSearch, FaFilter, FaSort, FaSortAlphaDownAlt, FaSortAlphaDown } from "react-icons/fa";
import { PiDeviceMobileFill } from "react-icons/pi";
import { MdDesktopWindows } from "react-icons/md";
import { IoHelpBuoy } from "react-icons/io5";
import Dropdown from "@/Components/Dropdown";
import { CreateProject as CreateProjectModal } from "@/Components/TaskManager/Modals/CreateProject";

interface TableProps {
    headers: string[]
}

export function TableOptions({ headers }: TableProps) {
    const [visibleHeaders, setVisibleHeaders] = useState(headers);
    const [sortHeader, setSortHeader] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    // Toggle visibility of headers based on checkbox
    const handleFilterChange = (header: string) => {
        setVisibleHeaders((prev) =>
            prev.includes(header) ? prev.filter(h => h !== header) : [...prev, header]
        );
    };

    // Set sorting order based on selected header and order
    const handleSortOrderChange = (order: 'asc' | 'desc') => {
        setSortOrder(order);
    };

    return (
        <div>
            <div className="flex flex-row justify-between items-center gap-4 pl-4 py-4 bg-gray-100">
                <div className="flex flex-row justify-start items-center gap-8">
                    <CreateProjectModal />
                    
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
                                    <div key={index} className="flex flex-row justify-between items-center hover:bg-slate-100 p-1 rounded-lg">
                                        <label>{header.substring(0, 8)}</label>
                                        <input
                                            type="checkbox"
                                            checked={visibleHeaders.includes(header)}
                                            onChange={() => handleFilterChange(header)}
                                            className="rounded-md cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        </Dropdown.Content>
                    </Dropdown>

                    {/* Sort Dropdown */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex flex-col justify-center items-center gap-2 group">
                                <FaSort className="text-xl" />
                                <div className="group-hover:text-orange-500">Sort</div>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align='left' contentClasses='py-1 bg-white w-96'>
                            <div className="p-4 border-b font-semibold">Sort Column</div>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 border-b">
                                {headers.map((header, index) => (
                                    <div key={index} className="flex flex-row justify-between items-center hover:bg-slate-100 p-1 rounded-lg">
                                        <label>{header.substring(0, 8)}</label>
                                        <input
                                            type="radio"
                                            name="sortColumn"
                                            checked={sortHeader === header}
                                            onChange={() => setSortHeader(header)}
                                            className="rounded-md cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 flex flex-row justify-center gap-12 text-4xl">
                                <button onClick={() => handleSortOrderChange('asc')}>
                                    <FaSortAlphaDownAlt className={`hover:text-orange-500 ${sortOrder === 'asc' && 'text-orange-500'}`} />
                                </button>
                                <button onClick={() => handleSortOrderChange('desc')}>
                                    <FaSortAlphaDown className={`hover:text-orange-500 ${sortOrder === 'desc' && 'text-orange-500'}`} />
                                </button>
                            </div>
                        </Dropdown.Content>
                    </Dropdown>

                    {/* Other Buttons */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex flex-col justify-center items-center gap-2 group">
                                <PiDeviceMobileFill className="text-xl" />
                                <div className="group-hover:text-orange-500">Mobile</div>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align='left'>
                            <div className="p-4">Mobile view settings here...</div>
                        </Dropdown.Content>
                    </Dropdown>

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex flex-col justify-center items-center gap-2 group">
                                <MdDesktopWindows className="text-xl" />
                                <div className="group-hover:text-orange-500">Desktop</div>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align='left'>
                            <div className="p-4">Desktop view settings here...</div>
                        </Dropdown.Content>
                    </Dropdown>

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
        </div>
    )
}
