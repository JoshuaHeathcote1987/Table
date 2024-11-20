import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { IoIosAddCircle } from "react-icons/io";
import { router } from '@inertiajs/react';

export function CreateModal({ initialOpen = false, fields, submitUrl }) {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [values, setValues] = useState(
        fields.reduce((acc, field) => {
            acc[field.name] = field.value || '';
            return acc;
        }, {})
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(submitUrl, values);
        closeModal();
    };

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            <button onClick={openModal} className="flex flex-col justify-center items-center gap-2 group">
                <IoIosAddCircle className="text-xl" />
                <div className="group-hover:text-orange-500">Create</div>
            </button>

            <Modal show={isOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-lg mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Create New Project</h2>
                        <button onClick={closeModal} aria-label="Close modal" className="text-gray-500 hover:text-orange-500 text-2xl">
                            &times;
                        </button>
                    </div>

                    {fields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    name={field.name}
                                    value={values[field.name]}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded mt-1"
                                    placeholder={field.placeholder}
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={values[field.name]}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded mt-1"
                                    required
                                >
                                    {field.options.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={values[field.name]}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded mt-1"
                                    placeholder={field.placeholder}
                                    required={field.type !== 'date'}
                                />
                            )}
                        </div>
                    ))}

                    <div className="flex justify-end">
                        <button type="submit" className="rounded-lg border p-2 w-32 hover:text-orange-500">
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
