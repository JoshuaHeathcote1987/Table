import { useState, useEffect } from "react";

// Components
import Dropdown from "@/Components/Dropdown";
import { CreateModal } from "./Modals/CreateModal";
import { UpdateModal } from "./Modals/UpdateModal";
import { DeleteModal } from "./Modals/DeleteModal";

// Icons
import { FaSearch, FaFilter, FaSort, FaSortAlphaDownAlt, FaSortAlphaDown } from "react-icons/fa";
import { PiDeviceMobileFill } from "react-icons/pi";
import { MdDesktopWindows, MdEditSquare, MdDelete } from "react-icons/md";
import { IoHelpBuoy } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoIosAddCircle } from "react-icons/io";

// Transitions
import { Transition } from "@headlessui/react";

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
    const [displayedResults, setDisplayedResults] = useState<any[]>(results);
    const [display, setDisplay] = useState<'desktop' | 'mobile' | 'help'>('desktop');
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 20;
    const [totalPages, setTotalPages] = useState(Math.ceil(displayedResults.length / itemsPerPage));

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        const indexOfLastItem = pageNumber * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setDisplayedResults(results.slice(indexOfFirstItem, indexOfLastItem));
    };

    const [toggleCreateModal, setToggleCreateModal] = useState(false);
    const [toggleUpdateModal, setToggleUpdateModal] = useState(false);
    const [toggleDeleteModal, setToggleDeleteModal] = useState(false);

    const [result, setResult] = useState({});

    // Update displayedResults whenever the results prop changes
    useEffect(() => {
        setDisplayedResults(results);

    }, [results]); // This will run whenever the results prop changes

    // Effect to load the display mode from localStorage when the component mounts
    useEffect(() => {
        const storedDisplay = localStorage.getItem('taskManagerDisplayState');
        if (storedDisplay) {
            setDisplay(storedDisplay as 'desktop' | 'mobile'); // Ensure type safety
        }

        // const indexOfLastItem = 1 * itemsPerPage;
        // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        // setDisplayedResults(results.slice(indexOfFirstItem, indexOfLastItem));
        handlePageChange(1);
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

    useEffect(function displayState() {
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

            setDisplayedResults(sorted);
        }
    };

    const updateDeleteDisplay = (result: any[]) => {
        return (
            <Dropdown>
                <Dropdown.Trigger>
                    <button className="hover:text-orange-400 text-2xl flex flex-row items-center">
                        <HiDotsHorizontal />
                    </button>
                </Dropdown.Trigger>
                <Dropdown.Content>
                    <div className="p-4 space-y-4 flex flex-col">
                        <button onClick={() => handleUpdate(result)}>
                            <div className="flex flex-row items-center space-x-4 hover:bg-yellow-100 p-2 rounded text-left">
                                <MdEditSquare className="text-xl" />
                                <div>Update</div>
                            </div>
                        </button>
                        <button onClick={() => handleDelete(result)}>
                            <div className="flex flex-row items-center space-x-4 hover:bg-red-100 p-2 rounded text-left">
                                <MdDelete className="text-xl" />
                                <div>Delete</div>
                            </div>
                        </button>
                    </div>
                </Dropdown.Content>
            </Dropdown>
        );
    }

    const handleDelete = (result: any[]) => {
        setResult(result);
        setToggleDeleteModal(!toggleDeleteModal);
    }

    const handleUpdate = (result: any[]) => {
        setResult(result);
        setToggleUpdateModal(!toggleUpdateModal);
    }

    // Search function is not working correctly.
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase(); // Only convert to lowercase, do not trim spaces
        setSearchQuery(query);

        if (query === "") {
            // Reset to the original results when the search box is empty
            setDisplayedResults(results); // Use the original `results` array
        } else {
            // Filter the rows based on the query
            const filtered = results.filter((row) =>
                Object.values(row).some((value) =>
                    String(value).toLowerCase().includes(query) // Convert values to strings for comparison
                )
            );
            setDisplayedResults(filtered);
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

    const displayPagination = () => {
        return (
            <div className="flex space-x-2 p-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 rounded border ${currentPage === index + 1
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <>
            <CreateModal
                fields={fields}
                submitUrl={pageSlug}
                state={toggleCreateModal}
                set={setToggleCreateModal}
            />
            <UpdateModal
                result={result}
                submitUrl={pageSlug}
                state={toggleUpdateModal}
                set={setToggleUpdateModal}
            />
            <DeleteModal
                result={result}
                submitUrl={pageSlug}
                state={toggleDeleteModal}
                set={setToggleDeleteModal}
            />
            <div className="space-y-8">
                <div className="flex flex-row justify-between items-center gap-4 pl-4">
                    <div className="flex flex-row justify-start items-center gap-8">

                        <button onClick={() => setToggleCreateModal(!toggleCreateModal)} className="flex flex-col justify-center items-center gap-2 group">
                            <IoIosAddCircle className="text-xl" />
                            <div className="group-hover:text-orange-500 transition-all">Create</div>
                        </button>
                        {/* Filter Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex flex-col justify-center items-center gap-2 group">
                                    <FaFilter className="text-xl" />
                                    <div className="group-hover:text-orange-500 transition-all">Filter</div>
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
                                    <div className="group-hover:text-orange-500 transition-all">Sort</div>
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
                                        className={sortDirection === "asc" ? "text-orange-500 transition-all" : ""}
                                    >
                                        <FaSortAlphaDown className="hover:text-orange-500 transition-all" />
                                    </button>
                                    <button
                                        onClick={() => handleSort("desc")}
                                        className={sortDirection === "desc" ? "text-orange-500 transition-all" : ""}
                                    >
                                        <FaSortAlphaDownAlt className="hover:text-orange-500 transition-all" />
                                    </button>
                                </div>
                            </Dropdown.Content>
                        </Dropdown>
                        <button onClick={() => setDisplay("desktop")} className={`flex flex-col justify-center items-center gap-2 group ${display === 'desktop' ? 'text-orange-500 transition-all' : ''}`}>
                            <MdDesktopWindows className="text-xl" />
                            <div className="group-hover:text-orange-500 transition-all">Desktop</div>
                        </button>
                        <button onClick={() => setDisplay("mobile")} className={`flex flex-col justify-center items-center gap-2 group ${display === 'mobile' ? 'text-orange-500 transition-all' : ''}`}>
                            <PiDeviceMobileFill className="text-xl" />
                            <div className="group-hover:text-orange-500 transition-all">Mobile</div>
                        </button>
                        <button onClick={() => setDisplay("help")} className={`flex flex-col justify-center items-center gap-2 group ${display === 'help' ? 'text-orange-500 transition-all' : ''}`}>
                            <IoHelpBuoy className="text-xl" />
                            <div className="group-hover:text-orange-500 transition-all">Help</div>
                        </button>
                    </div>
                    {/* Search */}
                    <div className="flex flex-row justify-end items-center gap-4">
                        <div className="relative">
                            <input
                                className="w-64 rounded-lg border border-gray-300 p-2 pl-10 focus:outline-none"
                                type="text"
                                placeholder="Search..."
                                aria-label="Search input"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                        </div>
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
                                        {displayedResults.length > 0 ? (
                                            displayedResults.map((result, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    {shownHeaders.map((header) => (
                                                        <td key={header} className="px-4 py-2">
                                                            {result[header]} {/* Display the value for the header */}
                                                        </td>
                                                    ))}
                                                    <td className="px-4 py-2">
                                                        {/* Additional Options Column if needed */}
                                                        {updateDeleteDisplay(result)}
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
                                {displayPagination()}
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
                                {displayedResults.length > 0 ? (
                                    displayedResults.map((result, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col justify-between w-full mx-auto bg-white shadow-lg rounded-lg border border-gray-200 p-6"
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
                                                {updateDeleteDisplay(result)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-flow justify-center items-center">
                                        There are currently no results.
                                    </div>
                                )}
                            </div>
                            <div>{displayPagination()}</div>

                        </Transition>
                    )}
                    {display === 'help' && (
                        <Transition
                            key="help"
                            appear
                            show={true}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="min-h-screen">
                                <div className="mx-auto bg-white rounded-lg p-4">
                                    <h1 className="text-3xl font-bold text-gray-800 mb-4">ℹ️ Help Page</h1>
                                    <p className="text-gray-600 mb-8">
                                        Welcome to the Help Page for the <span className="font-semibold">Dynamic Table Component</span>. This guide covers frequently asked questions, troubleshooting tips, and advanced usage to help you get the most out of the component.
                                    </p>
                                    <div className="space-y-6">
                                        {/* Section 1: Getting Started */}
                                        <section>
                                            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1️⃣ Getting Started</h2>
                                            <p className="text-gray-600 mb-3">
                                                If you’re new to the Dynamic Table Component, start by setting up the project using the following steps:
                                            </p>
                                            <ul className="list-disc pl-6 text-gray-600">
                                                <li>
                                                    Clone the repository: <code className="bg-gray-200 px-2 py-1 rounded">git clone https://github.com/JoshuaHeathcote1987/Table.git</code>
                                                </li>
                                                <li>Prepare your data as specified in the documentation.</li>
                                                <li>Set up the pages and integrate the Table component.</li>
                                            </ul>
                                        </section>
                                        {/* Section 2: Common Issues and Fixes */}
                                        <section>
                                            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2️⃣ Common Issues and Fixes</h2>
                                            <p className="text-gray-600 mb-3">
                                                Here are solutions to common issues users face:
                                            </p>
                                            <ul className="list-disc pl-6 text-gray-600">
                                                <li>
                                                    <span className="font-semibold">Table not rendering?</span> Ensure the `results` and `fields` props are correctly passed to the Table component.
                                                </li>
                                                <li>
                                                    <span className="font-semibold">Styling not applied?</span> Verify TailwindCSS is configured correctly in your project.
                                                </li>
                                                <li>
                                                    <span className="font-semibold">Data mismatch?</span> Double-check that the keys in your data match the `name` attributes in the fields array.
                                                </li>
                                            </ul>
                                        </section>
                                    </div>
                                    {/* Footer */}
                                    <footer className="mt-8 text-center">
                                        <p className="text-gray-500">
                                            Need more help? Contact us or contribute to the project on{" "}
                                            <a
                                                href="https://github.com/JoshuaHeathcote1987/Table"
                                                className="text-blue-500 underline"
                                            >
                                                GitHub
                                            </a>
                                            . Happy coding! 🎉
                                        </p>
                                    </footer>
                                </div>
                            </div>
                        </Transition>
                    )}
                </Transition>
            </div>
        </>
    );
}