import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from 'rsuite';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { GetTransactionsAction } from "../actions/GetTransactionsAction";
import 'rsuite/dist/rsuite.min.css';
import { GetCSVDataAction } from "../actions/GetCSVDataAction";

function Transactions(){
    const [activePage, setActivePage] = useState(1);
    const [radio, setRadio ] = useState("created_dt");
    const [ csvDownload, setCsvDownload ] = useState(0);
    const [ requiredCSVData, setRequiredCSVData ] = useState(0);
    const walletHome = useSelector(state => state.walletHome);
    const transactionsData = useSelector(state => state.getTransactions);
    const allCSVData = useSelector(state => state.getCSVData);
    

    const { result, count } = transactionsData;
  
    const dispatch = useDispatch();

    useEffect(() => {
        setRequiredCSVData(allCSVData?.result);
    },[allCSVData]);
    
    useEffect(() => {
        if(Object.keys(walletHome).length > 0){
            if(typeof walletHome.id !== "undefined"){
                dispatch(GetTransactionsAction(walletHome.id, activePage, radio))
            }
           
        }
    },[activePage]);

    useEffect(() => {
        if(typeof walletHome.id !== "undefined"){
            dispatch(GetTransactionsAction(walletHome.id, activePage, radio))
        }
        
    }, [radio]);

    useEffect(() => {
        if(csvDownload > 0){
            dispatch(GetCSVDataAction(walletHome.id));
        }
    }, [csvDownload]);
    
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

    const radioHandler = (e) => {
        setRadio(e.target.value)
    };
    const downloadDataAsCsvHandler = () => {
        setRequiredCSVData([])
        setCsvDownload(1)
    }

    if(requiredCSVData?.length > 0 && csvDownload > 0){
        const arrayToCSV = (data) => {
            const csv = Papa.unparse(data);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
            saveAs(blob, 'data.csv');
          };
        arrayToCSV(requiredCSVData);
        setCsvDownload(0);
    }
    return(
        <>
        <div className="container d-md-flex mt-3 clearfix">
            <div className="mx-auto d-flex">
                <div className="me-3">Sort By:</div>
                <div className="form-check">
                    <input type="radio" className="form-check-input" id="radio1" name="optradio" value="amount_vch" onClick={radioHandler}/>Amount
                    <label className="form-check-label"></label>
                </div>
                <div className="form-check ms-3">
                    <input type="radio" className="form-check-input" id="radio2" name="optradio" value="created_dt" onClick={radioHandler}/>Date
                    <label className="form-check-label"></label>
                </div>
            </div>
           
            <div className="float-md-right">
                <button className="btn btn-outline-success rounded-0" onClick={downloadDataAsCsvHandler}>Export All Transactions As .csv</button>
            </div>
        </div>
        <div className="container mt-5">
            <table className="table">
  <thead className="thead-dark">
    <tr>
      <th scope="col">Wallet Id</th>
      <th scope="col">Transaction Id</th>
      <th scope="col">Amount</th>
      <th scope="col">Balance</th>
      <th scope="col">Type</th>
      <th scope="col">Description</th>
      <th scope="col">Date</th>
    </tr>
  </thead>
  <tbody>
    {
        result?.length > 0 ? (result.map((item, i) => {
            return(
                    <tr key={i}>
                        <td>{item.wallet_id_vch}</td>
                        <td>{item.transactionId_vch}</td>
                        <td>{item.amount_vch}</td>
                        <td>{item.balance_vch}</td>
                        <td>{item.type_vch}</td>
                        <td>{item.description_vch}</td>
                        <td>{item.created_dt}</td>
                    </tr>
            )
        })):<></>
    }
  </tbody>
</table>
<div className="container">
<Pagination
        style={{justifyContent:"center"}}
        size="lg"
        total={count}
        limit={10}
        activePage={activePage}
        onChangePage={(e) => {
            setActivePage(e)
        }
        }
      />
</div>

        </div>
        </>
    )
}
export default Transactions