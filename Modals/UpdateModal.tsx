import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import { router } from '@inertiajs/react';

type UpdateModalProps = {
    result: Record<string, any>;
    submitUrl: string;
    state: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
};

export function UpdateModal({ result, submitUrl, state, set }: UpdateModalProps) {
    const [values, setValues] = useState<Record<string, any>>({});

    // Sync values with result prop when modal opens or result changes
    useEffect(() => {
        if (result) {
            const formattedResult = { ...result };
            if (formattedResult.start_date) {
                formattedResult.start_date = formattedResult.start_date.split('T')[0];
            }
            if (formattedResult.end_date) {
                formattedResult.end_date = formattedResult.end_date.split('T')[0];
            }
            setValues(formattedResult);
        }
    }, [result, state]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.patch(`${submitUrl}/${result.project_id}`, values, {
            onSuccess: () => console.log('Project updated successfully!'),
            onError: (errors) => console.error('Validation errors:', errors),
            preserveScroll: true,
        });
        set(false); // Close modal
    };

    const closeModal = () => set(false);

    return (
        <Modal show={state} onClose={closeModal}>
            <div className="p-6 bg-white rounded shadow-lg mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-yellow-500 text-2xl">Update</div>
                    <button
                        onClick={closeModal}
                        aria-label="Close modal"
                        className="text-gray-500 hover:text-orange-500 text-2xl"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(values).map((key) => (
                            <div key={key}>
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
                                        type={
                                            key.includes('date')
                                                ? 'date'
                                                : typeof values[key] === 'number'
                                                ? 'number'
                                                : 'text'
                                        }
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
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded-lg border p-2 w-32 hover:text-orange-500"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
