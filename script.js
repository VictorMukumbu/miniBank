const createAccount = (name,accountNo,initialBalance)=>{
    let balance = initialBalance
    let history = []

    const deposit=(amount)=>{
        const oldBalance = balance
        const transactionId = crypto.randomUUID();

        if (amount <= 0) {
            return "Invalid amount";
        }

        balance += amount

        const newBalance = balance;

        transactionRecord({type:"deposit-success", amount, oldBalance, newBalance,transactionId});

        return `deposit of ${amount} successful.Old balance was ${oldBalance}.New balance is ${newBalance} .Transaction ID ${transactionId}`
    }
    const withdraw=(amount)=>{
        const oldBalance = balance
        const transactionId = crypto.randomUUID();

        if (amount <= 0) {
            return "Invalid amount";
        }
        if(balance < amount){
            const newBalance = balance;
            transactionRecord({type:"withdraw-failed", amount, oldBalance, newBalance,transactionId});
            return `You have insufficient balance of ${oldBalance}.Withdraw request of ${amount} Unsuccessful .Transaction ID ${transactionId}`
        }

        balance -= amount

        const newBalance = balance;
        transactionRecord({type:"withdraw-success", amount, oldBalance, newBalance,transactionId});

        return`your withdrawal request of ${amount} successful.Original balance was ${oldBalance}.New balance is ${newBalance}.Transaction ID ${transactionId}`
    }
    const getStatus =()=>{
        if (balance < 100) return "low balance";
        if (balance < 500) return "moderate";
        return "healthy";
    }

    const _receiveTransfer=(amount,accountNo,transactionId)=>{
            const oldBalance = balance

            if (amount <= 0) {
                return "Invalid amount";
            }//just for defensive purposes

            balance += amount

            const newBalance = balance
         
            transactionRecord({type:"transfer-in-success", amount, oldBalance, newBalance,accountNo,transactionId});
            return `You have successfully received ${amount} from account ${accountNo} .Old balance was ${oldBalance}.New balance is ${newBalance}.Transaction ID is ${transactionId}`
        }

    const transferFunds =(amount,targetAccount)=>{
        const currentAccount =accountNo

         if (amount <= 0) {
            return "Invalid amount";
        }
        
        if (!targetAccount || typeof targetAccount._receiveTransfer !== "function") {
            return "Invalid target account";
        }

        if (targetAccount.accountNo === accountNo) {
            return "Cannot transfer to the same account";
        }

        const otherAccount = targetAccount.accountNo
        const transactionId = crypto.randomUUID()

        const oldBalance = balance;

        if(amount <= balance ){
            
            balance-=amount

            const newBalance = balance

            transactionRecord({type:"transfer-out-success", amount, oldBalance, newBalance,targetAccount:targetAccount.accountNo,transactionId});

            targetAccount._receiveTransfer(amount,accountNo,transactionId);

            return `Transfer of ${amount} from ${currentAccount} to account ${otherAccount} Successful.Old balance was ${oldBalance}.New balance ${newBalance}.Transaction ID ${transactionId}`
        }

        const newBalance = balance
        transactionRecord({type:"transfer-out-failed", amount,oldBalance,newBalance,transactionId});

        return  `Transaction failed.You have insufficient balance of ${oldBalance} to transfer ${amount} .Transaction ID ${transactionId}`

        
    }

    const transactionRecord = ({ type, amount, oldBalance, newBalance, transactionId, targetAccount, accountNo }) => {
        history.push({
            type,
            amount,
            oldBalance,
            newBalance,
            targetAccount,
            accountNo,
            time: new Date().toLocaleString(),
            transactionId
        });
    };

    const getTransactions = () => history.map(transaction =>({...transaction}));//avoid original history mutation

    const getBalance =()=> balance

    const getAccountDetails = () => ({ name, accountNo });

    return Object.freeze({name,accountNo,deposit,withdraw,transferFunds,getStatus,getBalance,getAccountDetails,getTransactions})

}

const acc1 = createAccount("john",332,268)
console.log(acc1.deposit(50))
console.log(acc1.withdraw(500))
console.log(acc1.withdraw(200))
console.log(acc1.getStatus())
console.log(acc1.deposit(100))
console.log(acc1.deposit(-900))
console.log(acc1.getTransactions())

