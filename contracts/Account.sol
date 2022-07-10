// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Bank {
    address[] private addresses;
    address payable private bank;

    struct TransactionStruct {
        string sender;
        string receiver;
        uint256 txvalue;
        uint256 amount;
        bool feeCollected;
        bool toBank;
        uint256 timestamp;
    }
    // name => account
    // address => [name, name, name]

    // address => [account, account, account]
    // name => address

    struct AccountStruct {
        address addr;
        string name;
        uint256 balance;
        bool isExisted;
        // mapping(uint256 => TransactionStruct) transactionHistory;
        // uint256 transactionLength;
        // string[] transactionList;
        TransactionStruct[] transactionHistory;
    }

    constructor() {
        bank = payable(msg.sender);
    }

    // mapping (address => AccountStruct) private AccountsRecord;
    mapping(string => AccountStruct) private AccountsRecord;
    mapping(address => string[]) private AccountsAddrRecord;

    function ToOwner() public {
        require(msg.sender == bank);
        bank.transfer(address(this).balance);
    }

    function CreateAccount(string memory accountName) public {
        require(
            AccountsRecord[accountName].isExisted != true,
            "Account already exists"
        );
        AccountsAddrRecord[msg.sender].push(accountName);
        // TransactionStruct[] memory transactionHistory;
        // TransactionStruct[] storage transactionHistory;
        AccountStruct storage _acc = AccountsRecord[accountName];
        _acc.name = accountName;
        _acc.balance = 0;
        _acc.isExisted = true;
        _acc.addr = msg.sender;
        // AccountsRecord[accountName] = _acc;
        // AccountsRecord[accountName] = AccountStruct({
        //     name: accountName,
        //     balance: 0,
        //     isExisted: true,
        //     addr: msg.sender
        //     // transactionHistory: []
        //     // transactionLength:
        // });
    }

    function Deposit(string memory accountName) public payable {
        require(
            AccountsRecord[accountName].isExisted,
            "Account does not exist"
        );
        require(
            AccountsRecord[accountName].addr == msg.sender,
            "Account does not belong to this address"
        );
        uint256 amountToAdd = msg.value - tx.gasprice;
        AccountsRecord[accountName].balance += amountToAdd;
        AccountsRecord[accountName].transactionHistory.push(
            TransactionStruct({
                sender: "",
                receiver: accountName,
                txvalue: msg.value,
                amount: amountToAdd,
                feeCollected: false,
                toBank: true,
                timestamp: block.timestamp
            })
        );
        // toOwner();
    }

    function Withdraw(string memory accountName, uint256 amount) public {
        // string memory accountName = AccountsAddrRecord[msg.sender];
        require(
            AccountsRecord[accountName].isExisted,
            "Account does not exist"
        );
        require(
            AccountsRecord[accountName].addr == msg.sender,
            "Account does not belong to this address"
        );
        require(amount > 0, "Amount is invalid");
        require(
            AccountsRecord[accountName].balance >= amount,
            "Insufficient balance on this account"
        );

        require(address(this).balance >= amount, "internal affairs");
        AccountsRecord[accountName].balance -= amount;
        payable(msg.sender).transfer(amount);
        AccountsRecord[accountName].transactionHistory.push(
            TransactionStruct({
                sender: accountName,
                receiver: "",
                txvalue: amount,
                amount: amount,
                feeCollected: false,
                toBank: true,
                timestamp: block.timestamp
            })
        );
    }

    function compareStrings(string memory a, string memory b)
        private
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function Transfer(
        string memory _accountName,
        string memory _targetAccName,
        uint256 amount
    ) private {
        AccountStruct storage _senderAcc = AccountsRecord[_accountName];
        AccountStruct storage _targetAcc = AccountsRecord[_targetAccName];
        require(_senderAcc.isExisted, "Sender Account does not exist");
        require(_targetAcc.isExisted, "Receiver Account does not exist");
        // require(
        //     _senderAcc.addr == msg.sender,
        //     "Account does not belong to this address"
        // );
        require(amount > 0, "Amount is invalid");
        require(
            _senderAcc.balance >= amount,
            "Insufficient balance on this account"
        );
        require(!compareStrings(_accountName, _targetAccName));
        uint256 amountToAdd = amount;
        bool feeCollected = false;
        if (_senderAcc.addr != _targetAcc.addr) {
            amountToAdd = (amount * 99) / 100;
            feeCollected = true;
        }
        _senderAcc.balance -= amount;
        _targetAcc.balance += amountToAdd;
        TransactionStruct memory _transaction = TransactionStruct({
            sender: _accountName,
            receiver: _targetAccName,
            txvalue: amount,
            amount: amountToAdd,
            feeCollected: feeCollected,
            toBank: false,
            timestamp: block.timestamp
        });
        AccountsRecord[_accountName].transactionHistory.push(_transaction);
        AccountsRecord[_targetAccName].transactionHistory.push(_transaction);
    }

    function BulkTransfer(
        string memory _accountName,
        string[] memory _targetAccsName,
        uint256 amount
    ) public {
        require(
            AccountsRecord[_accountName].isExisted,
            "Account does not exist"
        );
        require(
            AccountsRecord[_accountName].addr == msg.sender,
            "Account does not belong to this address"
        );
        require(amount > 0, "Amount is invalid");
        uint256 _totalAmount = amount * _targetAccsName.length;
        require(
            AccountsRecord[_accountName].balance >= _totalAmount,
            "Insufficient balance on this account"
        );
        // AccountsRecord[_accountName].balance -= _totalAmount;
        uint256 _i;
        for (_i = 0; _i < _targetAccsName.length; _i++) {
            Transfer(_accountName, _targetAccsName[_i], amount);
        }
        // AccountsRecord[targetAccName].balance += amount;
    }

    function GetAccountsInfo(string memory _accountName)
        public
        view
        returns (AccountStruct memory)
    {
        require(
            AccountsRecord[_accountName].addr == msg.sender,
            "Account does belong to this address"
        );
        AccountStruct memory _payload = AccountsRecord[_accountName];
        return _payload;
    }

    function GetAccountsList() public view returns (string[] memory) {
        string[] memory _AccNameList = AccountsAddrRecord[msg.sender];
        return _AccNameList;
    }
}
