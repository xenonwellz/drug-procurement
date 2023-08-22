import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Web3Context } from '../utils/contexts/Contract.jsx';

const Home = () => {
    const { contract, account, web3 } = useContext(Web3Context);
    const [drugs, setDrugs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (contract) {
            fetchDrugs();
        }
    }, [contract]);

    const fetchDrugs = async () => {
        try {
            const totalDrugs = await contract.methods.totalDrugs().call();
            const drugsArray = [];

            for (let i = 1; i <= totalDrugs; i++) {
                const drug = await contract.methods.drugs(i).call();
                drugsArray.push(drug);
            }

            setDrugs(drugsArray);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching drugs:', error);
            setIsLoading(false);
        }
    };

    return (
        <PageLayout>
            {isLoading ? (
                <p className="text-center mt-4">Loading...</p>
            ) : drugs.length === 0 ? (
                <p className="text-center mt-4">No drugs available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {drugs.map(drug => (
                        <div key={drug.id} className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold mb-2">{drug.name}</h2>
                            <p className="text-gray-600">Quantity: {drug.quantity}</p>
                            <p className="text-gray-600">
                                Status: {drug.status === '0' ? 'Not for Sale' : 'For Sale'}
                            </p>
                            <p className="text-gray-600">Unit Price: {web3.utils.fromWei(drug.price, 'ether')}</p>
                            {console.log(drug)}
                            <Link
                                to={`/drugs/${drug.id}`}
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

export default Home;
