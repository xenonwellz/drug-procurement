import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Web3Context } from '../utils/contexts/Contract.jsx';

const UserSuppliedDrugs = () => {
    const { contract, account, web3 } = useContext(Web3Context);
    const [userSuppliedDrugs, setUserSuppliedDrugs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (contract) {
            fetchUserSuppliedDrugs();
        }
    }, [contract]);

    const fetchUserSuppliedDrugs = async () => {
        try {
            const userSupplied = await contract.methods.getUserSupplies(account).call();
            const suppliedDetails = await Promise.all(userSupplied.map(async (drugId) => {
                const drugDetails = await contract.methods.drugs(drugId).call();
                return {
                    drugId: drugId,
                    drug: drugDetails
                };
            }));
            setUserSuppliedDrugs(suppliedDetails);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching user supplied drugs:', error);
            setIsLoading(false);
        }
    };

    return (
        <PageLayout>
            {isLoading ? (
                <p className={"text-center"}>Loading...</p>
            ) : userSuppliedDrugs.length === 0 ? (
                <p className={"text-center"}>No supplies yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userSuppliedDrugs.map((item) => (
                        <div key={item.drugId} className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold mb-2">{item.drug.name}</h2>
                            <p className="text-gray-600">Quantity: {item.drug.quantity}</p>
                            <p className="text-gray-600">Status: {item.drug.status === '0' ? 'Not for Sale' : 'For Sale'}</p>
                            <p className="text-gray-600">Unit Price: {web3.utils.fromWei(item.drug.price, 'ether')}</p>
                            <Link
                                to={`/drugs/${item.drugId}`}
                                className="mt-2 px-2 py-1 bg-blue-500 text-white rounded inline-block"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </PageLayout>
    );
};

export default UserSuppliedDrugs;
