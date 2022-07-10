const { assert, expect } = require("chai");

const BankArtifact = artifacts.require("Bank");

contract("Clean Chain Validation", async (accounts) => {
  var Bank
  before(async () => {
    Bank = await BankArtifact.deployed()
  })
  const user1 = accounts[1];
  const user2 = accounts[2];

  it("Should NOT find any accounts", async () => {
    assert.equal((await Bank.GetAccountsList.call({from:user1})).length, 0)
    assert.equal((await Bank.GetAccountsList.call({from:user2})).length, 0)
  })
})

contract("CreateAccount Test", async (accounts) => {
  var Bank
  before(async () => {
    Bank = await BankArtifact.deployed()
  })
  const user1 = accounts[1];
  const user2 = accounts[2];

  it("Should able to create bank account", async () => {
    // await Bank.CreateAccount("U01A01", {from: user1});
    // await Bank.CreateAccount("U02A01", {from: user2});
    // await Bank.CreateAccount("U02A02", {from: user2});
    // await Bank.CreateAccount("U02A03", {from: user2});
    const AccountToCreate = [Bank.CreateAccount("U01A01", {from: user1}), Bank.CreateAccount("U02A01", {from: user2}), Bank.CreateAccount("U02A02", {from: user2}), Bank.CreateAccount("U02A03", {from: user2})]
    await Promise.all(AccountToCreate)
    expect(await Bank.GetAccountsList.call({from:user1})).to.have.members(["U01A01"])
    expect(await Bank.GetAccountsList.call({from:user2})).to.have.members(["U02A01", "U02A02", "U02A03"])
  })

  it("Should NOT able to create bank account with duplicate name", async () => {
    await Bank.CreateAccount("U01A02", {from: user1});
    try {
      await Bank.CreateAccount("U01A02", {from: user1});
    } catch (err) {
      expect(err.message).to.have.string("Account already exists")
    }
    expect(await Bank.GetAccountsList.call({from:user1})).to.have.members(["U01A01", "U01A02"])
  })
})

contract("Deposit Test", async (accounts) => {
  var Bank
  const user1 = accounts[1];

  before(async () => {
    Bank = await BankArtifact.deployed()
    await Bank.CreateAccount("U01A01", {from: user1});
  })
  
  it("Should be able to Deposit ETH", async () => {
    await Bank.Deposit("U01A01", {from: user1 , value: "1000000000000000000"});
  })

  // it("Should not be able to Deposit Negative ETH", async () => {
  //   try {
  //     await Bank.Deposit("U01A01", {from: user1 , value: "-1000000000000000000"});
  //   } catch (err) {
  //     console.error(err)
  //     expect(err.message).to.have.string("Amount is invalid")
  //   }
  // })

  it("Should not be able to deposit to non-exists account", async () => {
    try {
      await Bank.Deposit("U01A05", {from: user1 , value: "1000000000000000000"});
    } catch (err) {
      expect(err.message).to.have.string("Account does not exist")
    }
  })
})

contract("Withdraw Test", async (accounts) => {
  var Bank
  const user1 = accounts[1];
  before(async () => {
    Bank = await BankArtifact.deployed()
    await Bank.CreateAccount("U01A01", {from: user1});
  })
  

  it("Should be able to Withdraw ETH", async () => {
    
    await Bank.Deposit("U01A01", {from: user1 , value: "100000000000000000"});
    await Bank.Withdraw("U01A01",  "90000000000000000", {from: user1 });
  })

  // it("Should not be able to Withdraw Negative ETH", async () => {
  //   await Bank.Deposit("U01A01", {from: user1 , value: "100000000000000000"});
  //   try {
  //     await Bank.Withdraw("U01A01", "-90000000000000000", {from: user1});
  //   } catch (err) {
  //     expect(err.message).to.have.string("Amount is invalid")
  //   }
  // })

  it("Should not be able to withdraw from non-exists account", async () => {
    try {
      await Bank.Withdraw("U01A05",  "90000000000000000", {from: user1 });
    } catch (err) {
      expect(err.message).to.have.string("Account does not exist")
    }
  })
})

contract("Transfer Test", async (accounts) => {
  var Bank
  const user1 = accounts[1];
  const user2 = accounts[2];
  before(async () => {
    Bank = await BankArtifact.deployed()
    await Bank.CreateAccount("U01A01", {from: user1});
    await Bank.CreateAccount("U01A02", {from: user1});
    await Bank.CreateAccount("U02A01", {from: user2});
  })
  

  it("Should be able to Transfer ETH with Fee Test", async () => {
    
    await Bank.Deposit("U01A01", {from: user1 , value: "1000000000000000000"});
    await Bank.BulkTransfer("U01A01", ["U01A02","U02A01"], "100000000000000000", {from: user1 });
    const U01A01 = await Bank.GetAccountsInfo("U01A01", {from: user1});
    const U01A02 = await Bank.GetAccountsInfo("U01A02", {from: user1});
    const U02A01 = await Bank.GetAccountsInfo("U02A01", {from: user2});
    expect(U01A02.balance).to.equal("100000000000000000")
    expect(U02A01.balance).to.equal("99000000000000000")
  })

  it("Should not be able to Transfer to non-exists account", async () => {
    await Bank.Deposit("U01A01", {from: user1 , value: "100000000000000000"});
    try {
      await Bank.BulkTransfer("U01A01", ["U01A02","U02A04"], "100000000000000000", {from: user1 });
    } catch (err) {
      expect(err.message).to.have.string("Receiver Account does not exist")
    }
  })
})