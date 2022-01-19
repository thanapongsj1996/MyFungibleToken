import expect from 'expect'
import ganache from 'ganache-cli'
import { AbiItem } from 'web3-utils'
import { beforeEach, describe, it } from '@jest/globals'

import { WowPlatform } from '../types/web3-v1-contracts/WowPlatform'
import WowPlatformContract from '../build/contracts/WowPlatform.json'
import { BoysToken } from '../types/web3-v1-contracts/BoysToken'
import BoysTokenContract from '../build/contracts/BoysToken.json'

import { testActors } from '../utils/test_util'
import { fromWei, getWeb3, toWei } from '../utils/util'

const ganacheOptions = {}
const web3 = getWeb3(ganache.provider(ganacheOptions))

let wowPlatform: WowPlatform
let boysToken: BoysToken

beforeEach(async () => {
    const actors = await testActors(web3)

    // Deploy BoysToken contract
    const boysContractAbiItems: AbiItem[] = BoysTokenContract.abi as AbiItem[]
    const boysContractByteCode: string = BoysTokenContract.bytecode
    boysToken = new web3.eth.Contract(boysContractAbiItems) as any as BoysToken
    boysToken = await boysToken.deploy({ data: boysContractByteCode, arguments: [] }).send(actors.ownerTx) as any as BoysToken
    // BoysToken address
    const boysTokenAddr = boysToken.options.address

    // Deploy WowPlatform contract
    const wowPlatformAbiItems: AbiItem[] = WowPlatformContract.abi as AbiItem[]
    const wowPlatformByteCode: string = WowPlatformContract.bytecode
    wowPlatform = new web3.eth.Contract(wowPlatformAbiItems) as any as WowPlatform
    wowPlatform = await wowPlatform.deploy({ data: wowPlatformByteCode, arguments: [boysTokenAddr] }).send(actors.ownerTx) as any as WowPlatform

    // Mint 1000 BoysToken for each actors
    const amount = toWei('1000')
    await boysToken.methods.mint(actors.user1Addr, amount).send(actors.ownerTx)
    await boysToken.methods.mint(actors.user2Addr, amount).send(actors.ownerTx)
})

describe('Test BoysToken Contract', () => {
    it('can get total supply', async () => {
        const boysTokenSupply = await boysToken.methods.totalSupply().call()
        expect(fromWei(boysTokenSupply)).toEqual('2000')
    })
    it('can transfer token from user1 to user2', async () => {
        const actors = await testActors(web3)

        // send 200 token from user1 to user2
        const amount = toWei('200')
        await boysToken.methods.transfer(actors.user2Addr, amount).send(actors.user1Tx)

        // get balances and check them
        const balUser1 = await boysToken.methods.balanceOf(actors.user1Addr).call()
        const balUser2 = await boysToken.methods.balanceOf(actors.user2Addr).call()
        expect(fromWei(balUser1)).toEqual('800')
        expect(fromWei(balUser2)).toEqual('1200')
    })
})

describe('Test WowPlatform Contract', () => {
    it('can deposit and withdraw', async () => {
        const actors = await testActors(web3)

        // approve WowPlatform to transfer 100 BoysToken then deposit
        const amount = toWei('100')
        const wowPlatformAddr = wowPlatform.options.address
        await boysToken.methods.approve(wowPlatformAddr, amount).send(actors.user1Tx)
        await wowPlatform.methods.deposit(amount).send(actors.user1Tx)

        // check user1 and platform balance of BoysToken
        let balUser1 = await boysToken.methods.balanceOf(actors.user1Addr).call()
        let balPlatform = await boysToken.methods.balanceOf(wowPlatformAddr).call()
        expect(fromWei(balUser1)).toEqual('900')
        expect(fromWei(balPlatform)).toEqual('100')

        // check user1 can withdraw then check balance
        await wowPlatform.methods.withdraw(toWei('80')).send(actors.user1Tx)
        balUser1 = await boysToken.methods.balanceOf(actors.user1Addr).call()
        balPlatform = await boysToken.methods.balanceOf(wowPlatformAddr).call()
        expect(fromWei(balUser1)).toEqual('980')
        expect(fromWei(balPlatform)).toEqual('20')
    })
})

