import Web3 from "web3"

export const gasLimit = 6721975

export interface TestActors {
    ownerAddr: string
    ownerTx: Tx
    user1Addr: string
    user1Tx: Tx
    user2Addr: string
    user2Tx: Tx
}

export interface Tx {
    from: string
    gas: number
}

export const testActors = async (web3: Web3): Promise<TestActors> => {
    const accounts = await web3.eth.getAccounts()
    return {
        ownerAddr: accounts[0],
        ownerTx: { from: accounts[0], gas: gasLimit },
        user1Addr: accounts[1],
        user1Tx: { from: accounts[1], gas: gasLimit },
        user2Addr: accounts[2],
        user2Tx: { from: accounts[2], gas: gasLimit }
    }
}
