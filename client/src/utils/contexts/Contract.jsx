import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import myContractABI from '../../contracts/DrugProcurement.json';

export const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState(1);

    useEffect(() => {
        const loadBlockchainData = async () => {
            let status = 0;
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setAccount(accounts[0]);
                    const networkId = await web3.eth.net.getId();
                    const contractData = myContractABI.networks[networkId];
                    if (contractData) {
                        const contract = new web3.eth.Contract(
                            myContractABI.abi,
                            contractData.address
                        );
                        setWeb3(web3);
                        setContract(contract);
                        status = 3;
                        window.ethereum.on('accountsChanged', loadBlockchainData);
                        window.ethereum.on('networkChanged', loadBlockchainData);
                    } else {
                        status = 2;
                    }
                } catch (error) {
                    console.error(error);
                    status = 0;
                }
            } else if (window.web3) {
                const web3 = window.web3;
                setWeb3(web3);
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
                const networkId = await web3.eth.net.getId();
                const contractData = myContractABI.networks[networkId];
                if (contractData) {
                    const contract = new web3.eth.Contract(
                        myContractABI.abi,
                        contractData.address
                    );
                    setContract(contract);
                    status = 3;
                } else {
                    status = 2;
                }
            } else {
                status = 0;
            }
            setConnectionStatus(status);
        };

        loadBlockchainData();
    }, []);

    return (
        <Web3Context.Provider value={{ web3, contract, account, connectionStatus }}>
            {children}
        </Web3Context.Provider>
    );
};
