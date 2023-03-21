import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'
import { TransactionAction } from "../actions/TransactionAction";
import { WalletHomeAction } from "../actions/WalletHomeAction";

function WalletHome(){
    const [ name, setName ] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [ balance, setBalance ] = useState(0);
    const [ transactionAmount, setTransactionAmount ] = useState(0);
    const [ submit, setSubmit ] = useState(0);
    const [ transactionSubmit, setTransactionSubmit ] = useState(0);
    const [ toggleValue, setToggleValue ] = useState("Credit");
    const walletHome = useSelector(state => state.walletHome);
    const walletBalance = useSelector(state => state.walletBalance);
   
    const dispatch = useDispatch();
   
    if(walletBalance?.length > 0){
        var [{
            name_vch,
            balance_vch
        }] = walletBalance;
    }
    useEffect(() => {
        setIsMounted(true); // set isMounted to true after component has mounted
      }, []);

    useEffect(() => {
        if (isMounted && typeof walletHome?.msg === "string") {
            Swal.fire({
                title: 'Error!',
                text: `${walletHome.msg}`,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }, [walletHome]);

    useEffect(() => {
        if(submit > 0){
            const bodyData = {
                name,
                balance
            }
            dispatch(WalletHomeAction(bodyData))
            setSubmit(0)
        }
    },[submit]);

    useEffect(() => {
        const { id } = walletHome;
        if(typeof id !== "undefined" && transactionSubmit > 0){
            const bodyData = {
                amount:transactionAmount ? transactionAmount : 0,
                description:"Recharge",
            }
            dispatch(TransactionAction(id, toggleValue, bodyData))
            setTransactionSubmit(0);
        }
    },[transactionSubmit]);

    useEffect(() => {
        const handleStorageChange = (e) => {
          if (e.key === null && e.newValue === null) {
            window.location.reload();
          }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
          window.removeEventListener('storage', handleStorageChange);
        };
      }, []);

    const nameHandler = (e) => {
        setName(e.target.value);
    };
    const balanceHandler = (e) => {
        setBalance(e.target.value);
    };
    const submitHandler = (e) => {
        e.preventDefault();
        if(!name){
            Swal.fire({
                title: 'Error!',
                text: 'Name is required!',
                icon: 'error',
                confirmButtonText: 'Ok'
              })
        }
        else if(parseFloat(balance) < 0){
            Swal.fire({
                title: 'Error!',
                text: 'Balance should be a positive Number',
                icon: 'error',
                confirmButtonText: 'Ok'
              })
        }else{
            setSubmit(1);
        }
       
        
    }
    const transactionAmountHandler = (e) => {
        e.preventDefault();
        setTransactionAmount(parseFloat(e.target.value).toFixed(4))
    }
    const toggleHandler = () => {
        setToggleValue(toggleValue === "Credit" ? "Debit" : "Credit")
    }
    const transactionSubmitHandler = (e) => {
        e.preventDefault();
        if(parseFloat(transactionAmount) < 0){
            Swal.fire({
                title: 'Error!',
                text: 'Amount should be a positive Number',
                icon: 'error',
                confirmButtonText: 'Ok'
              })
        }else if(parseFloat(transactionAmount) > parseFloat(balance_vch) && toggleValue === "Debit"){
            Swal.fire({
                title: 'Error!',
                text: 'Not Enough Balance!',
                icon: 'error',
                confirmButtonText: 'Ok'
              })
        }else{
            setTransactionSubmit(1)
        }
       
    }
    return(
        <>
        <div className="container mt-5" style={{textAlign:"center"}}>
         {Object.keys(walletHome).length > 0 && Object.keys(walletHome).indexOf("msg") < 0 ?( 
            <div style={{textAlign:"center"}}>
                <Link to="/transactions">Wallet Transactions</Link>
            </div>
            ) : <></>}
            {balance_vch >= 0 ? (
            <div className="mt-5" style={{textAlign:"center"}}>
                <kbd>{`Wallet Name: ${name_vch}`}</kbd>
                <br/>
                <kbd>{`Wallet Balance: ${balance_vch}`}</kbd>
            </div>
            ):<></>}
         
        </div>
        <div className="d-flex ">
           {Object.keys(walletHome).length > 0 && Object.keys(walletHome).indexOf("msg") < 0 ? <></>: (
           <div className="container w-100" >
                
                <form className="was-validated w-100">
                    <div className="mt-5">
                        <label className="form-label mt-5">Name:</label>
                        <input type="name" className="form-control" id="name" placeholder="Enter Name" name="name" onChange={nameHandler}/>
                        <div className="valid-feedback">Valid.</div>
                        <div className="invalid-feedback">Please fill out this field.</div>
                    </div>
                    <div className="mt-5">
                        <label className="form-label">Balance:</label>
                        <input type="name" className="form-control" id="name" placeholder="Enter Balance To Setup Your Wallet" name="name" defaultValue={0} onChange={balanceHandler}/>
                    </div>
                    <div className="mt-5" style={{ textAlign: "center" }}>
                        <button className="btn btn-success w-100 rounded-0" onClick={submitHandler}>Submit</button>
                    </div>

                </form>
            </div>)}
            {Object.keys(walletHome).length > 0 && Object.keys(walletHome).indexOf("msg") < 0? (
                <div className="container w-100">
                    <form className="was-validated w-100">
                        <div className="mt-5">
                            <label className="form-label mt-5">Transaction Amount:</label>
                            <input type="transaction-amount" className="form-control" id="transaction" placeholder="Enter Transaction" name="transaction-amount" defaultValue={0} onChange={transactionAmountHandler}/>
                            <div className="valid-feedback">Valid.</div>
                            <div className="invalid-feedback">Please fill out this field.</div>
                        </div>
                        <div className="form-check form-switch mt-2 mb-5">
                        <label className="form-check-label">{toggleValue}</label>
                        <input className="form-check-input" type="checkbox" id="mySwitch" name="darkmode" value={toggleValue} onClick={toggleHandler}/>
                            
                        </div>
                        <div className="mt-5" style={{ textAlign: "center" }}>
                            <button className="btn btn-success w-100 rounded-0" onClick={transactionSubmitHandler}>Submit</button>
                        </div>

                    </form>
                </div>) : <></>}

        </div>
        </>
    )
}
export default WalletHome