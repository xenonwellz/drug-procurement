import { useState } from 'react';
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';


const useInfura = () => {
    const projectId = 'ID';
    const projectSecret = 'SECRET';
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

    const uploadFile = async (file) => {

        let ipfs;
        try {
            ipfs = create({
                host: 'ipfs.infura.io',
                port: 5001,
                protocol: 'https',
                headers: {
                    authorization: auth
                }
            });
        } catch (error) {
            console.error('Error connecting to IPFS via Infura', error);
            return;
        }
        try {
            const response = await ipfs.add(file);
            console.log('IPFS file hash:', response.cid.toString());
            return response.cid.toString();
        } catch (error) {
            console.error('Error uploading file to IPFS', error);
        }
    };

    return { uploadFile };
};

export default useInfura;