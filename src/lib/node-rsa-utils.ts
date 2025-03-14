import NodeRSA from "encrypt-rsa";


export const generateKeypair = () => {
    const nodeRSA = new NodeRSA(); // defaults to 2048 bits.

    const { publicKey, privateKey } = nodeRSA.createPrivateAndPublicKeys();

    return({ publicKey, privateKey });
}

export const encryptWithPrivateKey = (text: string, privateKey: string) => {
    const nodeRSA = new NodeRSA(); 

    const encryptedData = nodeRSA.encrypt({ text, privateKey })
    
    return encryptedData;
}

export const decryptWithPublicKey = (text: string, publicKey: string) => {
    const nodeRSA = new NodeRSA();

    const decrptedData = nodeRSA.decrypt({ text, publicKey })

    return decrptedData;
}