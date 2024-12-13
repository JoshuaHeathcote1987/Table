import React from 'react';
import Modal from '@/Components/Modal';
import { router } from '@inertiajs/react';

export function DeleteModal({ result, submitUrl, state, set, onSuccessCallback }: { 
    result: Record<string, any>, 
    submitUrl: string, 
    state: boolean, 
    set: React.Dispatch<React.SetStateAction<boolean>>,
    onSuccessCallback?: (deletedId: string | number) => void // Callback to update parent list
}) {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const id = Object.values(result)[0];
        router.delete(`${submitUrl}/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (onSuccessCallback) {
                    onSuccessCallback(id); // Notify parent to remove item
                }
                console.log('Item deleted successfully!');
            },
            onError: (errors) => console.error('Error deleting item:', errors),
        });
        set(false); // Close modal
    };

    const closeModal = () => {
        set(false);
    };

    return (
        <>
            <Modal show={state} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="text-red-500 text-2xl">Delete</div>
                    <div>Are you sure you want to delete?</div>
                    <div className="flex flex-row justify-end items-center gap-4">
                        <button 
                            type="button" 
                            onClick={closeModal} 
                            className="p-2 rounded-lg border w-32 hover:text-orange-500"
                        >
                            No
                        </button>
                        <button 
                            type="submit" 
                            className="p-2 rounded-lg border w-32 hover:text-orange-500"
                        >
                            Yes
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
