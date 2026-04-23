const createAccount =(name,accountNo,initialBalance)=>{
    let balance = initialBalance
    let history = []

    const deposit=(amount)=>{
        const oldBalance = balance
        const transactionId = crypto.randomUUID();

        balance += amount

        transactionRecord({type:"deposit", amount, oldBalance, balance,transactionId});

        return `deposit of ${amount} successful.Old balance was ${oldBalance}.New balance is ${balance} .Transaction ID ${transactionId}`
    }
    const withdraw=(amount)=>{
        const oldBalance = balance
        const transactionId = crypto.randomUUID();
        if(balance < amount){
            transactionRecord({type:"failed", amount, oldBalance, balance,transactionId});
            return `You have insufficient balance of ${oldBalance}.Withdraw request of ${amount} Unsuccessful .Transaction ID ${transactionId}`
        }

        balance -= amount

        transactionRecord({type:"withdraw", amount, oldBalance, balance,transactionId});

        return`your withdrawal request of ${amount} successful.Original balance was ${oldBalance}.New balance is ${balance}.Transaction ID ${transactionId}`
    }
    const getStatus =()=>{
        if(balance<100){
            return "low balance"
        }
        return "healthy"
    }
    const transactionRecord = (type, amount, oldBalance, newBalance,transactionId) => {
        history.push({
            type,
            amount,
            oldBalance,
            newBalance,
            time: new Date().toLocaleString(),
            transactionId
        });
    };

    const getTransactions = () => [...history];

    const getBalance =()=> balance

    return{name,accountNo,initialBalance,deposit,withdraw,getStatus,getBalance,getTransactions}

}

const acc1 = createAccount("john",332,268)
console.log(acc1.deposit(50))
console.log(acc1.withdraw(500))
console.log(acc1.withdraw(200))
console.log(acc1.getStatus())
console.log(acc1.deposit(100))
console.log(acc1.getTransactions())

