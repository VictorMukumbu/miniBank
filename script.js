const createAccount =(name,accountNo,initialBalance)=>{
    let balance = initialBalance
    let history = []

    const deposit=(depositAmount)=>{
        const oldBalance = balance
        balance += depositAmount

        history.push({
            type: "deposit",
            depositAmount,
            oldBalance,
            newBalance: balance
        })

        return `deposit of ${depositAmount} successful.Old balance was 
            ${oldBalance}.New balance is ${balance}`
    }
    const withdraw=(withadrawAmount)=>{
        const oldBalance = balance
        if(balance < withadrawAmount){
            return `You have insufficient balance of ${oldBalance}.Withdaw 
                request of ${withadrawAmount} Unsuccessful`
        }

        balance -= withadrawAmount

        history.push({
            type: "withdraw",
            withadrawAmount,
            oldBalance,
            newBalance: balance
        });

        return`your withdrawal request of ${withadrawAmount} 
            successful.Original balance was ${oldBalance}.New balance is ${balance}`
    }
    const getStatus =()=>{
        if(balance<100){
            return "low balance"
        }
        return "healthy"
    }

    const getTransactions = () => [...history];

    const getBalance =()=> balance

    return{name,accountNo,initialBalance,deposit,withdraw,getStatus,getBalance,getTransactions}

}

const acc1 = createAccount("john",332,268)
console.log(acc1.deposit(50))
console.log(acc1.withdraw(500))
console.log(acc1.withdraw(200))
console.log(acc1.getStatus())
console.log(acc1.getTransactions())

