import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import { router } from '@inertiajs/react';

export function UpdateModal({ result, submitUrl, state, set }) {
    const [values, setValues] = useState({});

    // Sync the `values` state with the `result` prop when the modal is opened or `result` changes
    useEffect(() => {
        if (result) {
            const formattedResult = { ...result };
            // Format date fields for `input[type="date"]`
            if (formattedResult.start_date) {
                formattedResult.start_date = formattedResult.start_date.split('T')[0];
            }
            if (formattedResult.end_date) {
                formattedResult.end_date = formattedResult.end_date.split('T')[0];
            }
            setValues(formattedResult);
        }
    }, [result, state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.patch(`/dashboard/projects/${result.project_id}`, values, {
            onSuccess: () => {
                console.log('Project updated successfully!');
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
            preserveScroll: true,
        });
        set(false);  // Close the modal by setting state to false
    };

    const closeModal = () => {
        set(false);  // Directly set state to false to close the modal
    };

    return (
        <>
            <Modal show={state} onClose={closeModal}>
                    <div className="p-6 bg-white rounded shadow-lg mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Update</h2>
                            <button onClick={closeModal} aria-label="Close modal" className="text-gray-500 hover:text-orange-500 text-2xl">
                                &times;
                            </button>
                        </div>
                        
                                        <form onSubmit={handleSubmit} className="">
                        {/* Use Tailwind grid to create two columns on larger screens and one column on mobile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.keys(values).map((key) => (
                                <div key={key} className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 capitalize">
                                        {key.replace('_', ' ')}
                                    </label>
                                    {key === 'description' ? (
                                        <textarea
                                            name={key}
                                            value={values[key] || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded mt-1"
                                            placeholder={`Enter ${key}`}
                                        />
                                    ) : key === 'status' ? (
                                        <select
                                            name={key}
                                            value={values[key] || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded mt-1"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Archived">Archived</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    ) : (
                                        <input
                                            type={key.includes('date') ? 'date' : typeof values[key] === 'number' ? 'number' : 'text'}
                                            name={key}
                                            value={values[key] || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded mt-1"
                                            placeholder={`Enter ${key}`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="submit" className="rounded-lg border p-2 w-32 hover:text-orange-500">
                                Save
                            </button>
                        </div>
                                        </form>
                    </div>
            </Modal>
        </>
    );
}
