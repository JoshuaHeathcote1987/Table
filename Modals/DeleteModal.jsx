import React from 'react';
import Modal from '@/Components/Modal';
import { router } from '@inertiajs/react';

export function DeleteModal({ result, submitUrl, state, set }) {

    const handleSubmit = (e) => {
        e.preventDefault();

        const id = Object.values(result)[0];
        router.delete(submitUrl + '/' + id, { preserveScroll: true });
        set(!state)
    };

    const closeModal = () => {
        set(!state)
    }

    return (
        <>
            <Modal show={state} onClose={() => closeModal()}>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="text-red-500 text-2xl">Delete</div>
                    <div>Are you sure you want to delete?</div>
                    <div className="flex flex-row justify-end items-cente gap-4">
                        <button onClick={() => closeModal()} className="p-2 rounded-lg border w-32 hover:text-orange-500">
                            No
                        </button>
                        <button onClick={() => handleSubmit()} className="p-2 rounded-lg border w-32 hover:text-orange-500">
                            Yes
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
