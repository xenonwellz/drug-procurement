import React, { useState, useContext } from 'react';
import PageLayout from '../components/PageLayout';
import { Web3Context } from '../utils/contexts/Contract.jsx';

const AddDrug = () => {
    const { contract, account, web3 } = useContext(Web3Context);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState("");


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const priceInWei = web3.utils.toWei(price, 'ether'); // Convert ether to wei
            await contract.methods.addDrug(name, quantity, priceInWei).send({ from: account });
            setName('');
            setQuantity(0);
            setPrice('');
        } catch (error) {
            console.log('Error adding drug:', error);
        }
    };

    return (
        <PageLayout>
            <h2 className="text-lg font-semibold mb-4">Add Drug</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block font-semibold mb-1">Name:</label>
                    <input
                        type="text"
                        id="name"
                        className="w-full p-2 border rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="quantity" className="block font-semibold mb-1">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        className="w-full p-2 border rounded"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="price" className="block font-semibold mb-1">Price:</label>
                    <input
                        type="number"
                        id="price"
                        className="w-full p-2 border rounded"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Add Drug
                </button>
            </form>
        </PageLayout>
    );
};

export default AddDrug;
