import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Web3Context } from '../utils/contexts/Contract.jsx';

const ViewDrug = () => {
    const { contract, account, web3 } = useContext(Web3Context);
    const { id } = useParams();
    const [drug, setDrug] = useState(null);
    const [newQuantity, setNewQuantity] = useState(0);
    const [quantityToBuy, setQuantityToBuy] = useState(1); // New state for quantity to buy
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if (contract && id) {
            fetchDrugDetails();
        }
    }, [contract, id]);

    const fetchDrugDetails = async () => {
        try {
            const drugDetails = await contract.methods.drugs(id).call();
            setDrug(drugDetails);
            setNewQuantity(drugDetails?.quantity ?? 0);
            setIsOwner(drugDetails.supplier.toLowerCase() === account.toLowerCase());
        } catch (error) {
            console.error('Error fetching drug details:', error);
        }
    };

    const handleBuy = async () => {
        try {
            await contract.methods.buyDrug(id, quantityToBuy).send({ from: account, value: drug.price * quantityToBuy });
            // You might want to add a success notification here
            fetchDrugDetails();
            setQuantityToBuy(1);
        } catch (error) {
            console.error('Error buying drug:', error);
        }
    };

    const handleUpdateQuantity = async () => {
        try {
            await contract.methods.updateDrugQuantity(id, newQuantity).send({ from: account });
            // You might want to add a success notification here
            fetchDrugDetails();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleToggleStatus = async () => {
        try {
            await contract.methods.toggleDrugStatus(id).send({ from: account });
            // You might want to add a success notification here
            fetchDrugDetails();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    return (
        <PageLayout>
            {drug ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-2">{drug.name}</h2>
                    <p className="text-gray-600">Quantity: {drug.quantity}</p>
                    <p className="text-gray-600">Expiry Date: {drug.expiry}</p>
                    <p className="text-gray-600">Price: {web3.utils.fromWei(drug.price, 'ether')} ETH</p>
                    {isOwner ? (
                        <>
                            <div className="mt-4">
                                <label htmlFor="newQuantity" className="block font-semibold mb-1">New Quantity:</label>
                                <input
                                    type="number"
                                    id="newQuantity"
                                    className="w-full p-2 border rounded"
                                    value={newQuantity}
                                    onChange={(e) => setNewQuantity(parseInt(e.target.value))}
                                />
                            </div>
                            <button
                                className="mt-2 mr-2 px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={handleUpdateQuantity}
                            >
                                Save Quantity
                            </button>
                            <button
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={handleToggleStatus}
                            >
                                {parseInt(drug.status) !== 0 ? 'Make Available' : 'Make Unavailable'}
                            </button>
                        </>
                    ) : (
                        <div className="mt-4">
                            {parseInt(drug.status) !== 0 ?
                                <span
                                    className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Not For Sale
                                </span>
                                :<>
                                <label htmlFor="quantityToBuy" className="block font-semibold mb-1">Quantity to
                                    Buy:</label>
                                <input
                                    type="number"
                                    id="quantityToBuy"
                                    className="w-full p-2 border rounded"
                                    value={quantityToBuy}
                                    onChange={(e) => setQuantityToBuy(parseInt(e.target.value))}
                                />
                                <button
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                                    onClick={handleBuy}
                                >
                                    Buy
                                </button>
                            </>}
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </PageLayout>
    );
};

export default ViewDrug;
