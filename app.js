
/* =========================
   MUKUMBU BANK CORE ENGINE
========================= */

function createAccount(name, accountNo, initialBalance) {

  let balance = initialBalance;
  let history = [];


  /* =========================
     TRANSACTION LOGGER
  ========================= */
  const transactionRecord = ({
    type,
    amount,
    oldBalance,
    newBalance,
    transactionId,
    targetAccount,
    senderAccount
  }) => {
    history.push({
      type,
      amount,
      oldBalance,
      newBalance,
      targetAccount,
      senderAccount,
      time: new Date().toLocaleString(),
      transactionId
    });
  };


  /* =========================
     DEPOSIT
  ========================= */
  const deposit = (amount) => {
    const oldBalance = balance;
    const transactionId = crypto.randomUUID();

    if (amount <= 0) {
      transactionRecord({
        type: "deposit-failed",
        amount,
        oldBalance,
        newBalance: balance,
        transactionId
      });

      return "Invalid amount";
    }

    balance += amount;

    const newBalance = balance;

    transactionRecord({
      type: "deposit-success",
      amount,
      oldBalance,
      newBalance,
      transactionId
    });

    return `Deposit successful. New balance: ${newBalance}`;
  };


  /* =========================
     WITHDRAW
  ========================= */
  const withdraw = (amount) => {
    const oldBalance = balance;
    const transactionId = crypto.randomUUID();

    if (amount <= 0) {
      return "Invalid amount";
    }

    if (balance < amount) {
      transactionRecord({
        type: "withdraw-failed",
        amount,
        oldBalance,
        newBalance: balance,
        transactionId
      });

      return `Insufficient balance: ${oldBalance}`;
    }

    balance -= amount;

    const newBalance = balance;

    transactionRecord({
      type: "withdraw-success",
      amount,
      oldBalance,
      newBalance,
      transactionId
    });

    return `Withdrawal successful. New balance: ${newBalance}`;
  };


  /* =========================
     STATUS
  ========================= */
  const getStatus = () => {
    if (balance < 100) return "low balance";
    if (balance < 500) return "moderate";
    return "healthy";
  };


  /* =========================
     RECEIVE TRANSFER (INCOMING)
  ========================= */
  const _receiveTransfer = (amount, senderAccount, transactionId) => {
    const oldBalance = balance;

    if (amount <= 0) {
      return "Invalid amount";
    }

    balance += amount;

    const newBalance = balance;

    transactionRecord({
      type: "transfer-in-success",
      amount,
      oldBalance,
      newBalance,
      senderAccount,
      transactionId
    });

    return `Received KSh ${amount} from ${senderAccount}`;
  };


  /* =========================
     TRANSFER FUNDS (OUTGOING)
  ========================= */
  const transferFunds = (amount, targetAccount) => {
    const oldBalance = balance;
    const transactionId = crypto.randomUUID();

    if (amount <= 0) {
      return "Invalid amount";
    }

    if (!targetAccount || typeof targetAccount._receiveTransfer !== "function") {
      return "Invalid target account";
    }

    if (targetAccount.accountNo === accountNo) {
      return "Cannot transfer to same account";
    }

    if (balance < amount) {
      transactionRecord({
        type: "transfer-out-failed",
        amount,
        oldBalance,
        newBalance: balance,
        transactionId,
        targetAccount: targetAccount.accountNo
      });

      return `Insufficient balance: ${oldBalance}`;
    }

    balance -= amount;

    const newBalance = balance;

    transactionRecord({
      type: "transfer-out-success",
      amount,
      oldBalance,
      newBalance,
      transactionId,
      targetAccount: targetAccount.accountNo
    });

    targetAccount._receiveTransfer(amount, accountNo, transactionId);

    return `Transfer successful to ${targetAccount.accountNo}`;
  };


  /* =========================
     GETTERS
  ========================= */
  const getBalance = () => balance;

  const getTransactions = () =>
    history.map(tx => ({ ...tx }));

  const getAccountDetails = () => ({
    name,
    accountNo
  });


  /* =========================
     EXPORT API
  ========================= */
  return Object.freeze({
    name,
    accountNo,
    deposit,
    withdraw,
    transferFunds,
    getStatus,
    getBalance,
    getAccountDetails,
    getTransactions,
    _receiveTransfer
  });
}