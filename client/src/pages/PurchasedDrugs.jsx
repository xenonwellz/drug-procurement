import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Web3Context } from '../utils/contexts/Contract.jsx';

const PurchasedDrugs = () => {
    const { contract, account, web3 } = useContext(Web3Context);
    const [purchasedDrugs, setPurchasedDrugs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (contract) {
            fetchPurchasedDrugs();
        }
    }, [contract]);

    const fetchPurchasedDrugs = async () => {
        try {
            const userPurchases = await contract.methods.getUserPurchases(account).call();
            const purchasedDetails = await Promise.all(userPurchases.map(async (purchaseId) => {
                const purchase = await contract.methods.purchases(purchaseId).call();
                const drugDetails = await contract.methods.drugs(purchase.drugId).call();
                return {
                    purchaseId: purchaseId,
                    drug: drugDetails,
                    purchase: purchase
                };
            }));

            const groupedPurchases = purchasedDetails.reduce((groups, item) => {
                const groupId = item.drug.id;
                if (!groups[groupId]) {
                    groups[groupId] = {
                        drug: item.drug,
                        totalQuantityBought: parseInt(item.purchase.quantity)
                    };
                } else {
                    groups[groupId].totalQuantityBought += parseInt(item.purchase.quantity);
                }
                return groups;
            }, {});

            setPurchasedDrugs(Object.values(groupedPurchases));
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching purchased drugs:', error);
            setIsLoading(false);
        }
    };

    return (
        <PageLayout>
            {isLoading ? (
                <p className={"text-center"}>Loading...</p>
            ) : purchasedDrugs.length === 0 ? (
                <p className={"text-center"}>No purchased drugs yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {purchasedDrugs.map((item) => (
                        <div key={item.drug.id} className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold mb-2">{item.drug.name}</h2>
                            <p className="text-gray-600">Quantity Bought: {item.totalQuantityBought}</p>
                            <p className="text-gray-600">Available In stock: {item.drug.quantity}</p>
                            <p className="text-gray-600">
                                Status: {item.drug.status === '0' ? 'Not for Sale' : 'For Sale'}
                            </p>
                            <p className="text-gray-600">Unit Price: {web3.utils.fromWei(item.drug.price, 'ether')}</p>
                            <Link
                                to={`/drugs/${item.drug.id}`}
                                className="mt-2 px-2 py-1 bg-blue-500 text-white rounded inline-block"
                            >
                                View Drug Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </PageLayout>
    );
};

export default PurchasedDrugs;
