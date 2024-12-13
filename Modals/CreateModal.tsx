import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { IoIosAddCircle } from 'react-icons/io';
import { router } from '@inertiajs/react';

type Field = {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'date';
    placeholder?: string;
    value?: string | number;
    options?: string[];
};

type CreateModalProps = {
    fields: Field[];
    submitUrl: string;
    state: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccessCallback?: (newItem: Record<string, any>) => void; // Callback to update parent list
};

export function CreateModal({ fields = [], submitUrl, state, set, onSuccessCallback }: CreateModalProps) {
    const [values, setValues] = useState<Record<string, any>>(
        fields.reduce<Record<string, any>>((acc, field) => {
            acc[field.name] = field.value || '';
            return acc;
        }, {})
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(submitUrl, values, {
            onSuccess: (page) => {
                const newItem = page.props.newItem; // Assuming the backend sends `newItem`
                if (newItem && onSuccessCallback) {
                    onSuccessCallback(newItem); // Update the parent list
                }
                console.log('Data submitted successfully!');
            },
            onError: (errors) => console.error('Validation errors:', errors),
            preserveScroll: true,
        });
        set(false); // Close modal
    };

    const closeModal = () => set(false);

    return (
        <Modal show={state} onClose={closeModal}>
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-lg mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-green-500 text-2xl">Create</div>
                    <button
                        onClick={closeModal}
                        aria-label="Close modal"
                        className="text-gray-500 hover:text-orange-500 text-2xl"
                    >
                        &times;
                    </button>
                </div>
                {fields.map((field) => (
                    <div key={field.name} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                        </label>
                        {field.type === 'textarea' ? (
                            <textarea
                                name={field.name}
                                value={values[field.name] || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mt-1"
                                placeholder={field.placeholder}
                            />
                        ) : field.type === 'select' ? (
                            <select
                                name={field.name}
                                value={values[field.name] || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mt-1"
                                required
                            >
                                {field.options?.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                value={values[field.name] || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mt-1"
                                placeholder={field.placeholder}
                                required={field.type !== 'date'}
                            />
                        )}
                    </div>
                ))}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="rounded-lg border p-2 w-32 hover:text-orange-500"
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
}
