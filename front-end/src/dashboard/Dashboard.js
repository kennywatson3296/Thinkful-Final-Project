import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "../reservations/Reservations"
import {next, previous} from "../utils/date-time"
import TablesList from "../tables/TablesList"
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({date, setDate}) {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([])
  
  

  useEffect(()=>{
    loadDashboard()
  }, [date]);

 useEffect(loadTables, [])
 useEffect(loadDashboard, [])

  
  
   function loadDashboard() {
      const abortController = new AbortController();
      setError(null);
      
      listReservations( {date} , abortController.signal)
        .then(setReservations)
        .catch(setError);
        
        
      return () => abortController.abort();
    }


  function loadTables(){
    const abortController = new AbortController()
    setError(null)
listTables(abortController.signal)
.then(setTables)
.catch(setError)
return () => abortController.abort()
  }

  function handlePrevious(event){
    event.preventDefault()
   setDate(previous(date))

  }

  function handleNext(event){
    event.preventDefault()
    setDate(next(date))
  }

  function handleFinish(event){
    event.preventDefault()
    const confirmation = window.confirm("Is this table ready to seat new guests? This cannot be undone.")
    if(confirmation){
      const id = event.target.id
      finishTable(id)
      .then(()=>{
        loadTables()
      })
      .then(()=>{
        const status = 'finished'
        updateStatus(event.target.name, status)
        .then(loadDashboard)
      })
      .catch(setError)
    }
  }

  function handleCancel(event){
    event.preventDefault()
    const confirmation = window.confirm("Do you want to cancel this reservation? This cannot be undone.")
    if(confirmation){
      const status = 'cancelled'
      updateStatus(event.target.name, status)
      .then(loadDashboard)
      .catch(setError)
    }
  }

if(reservations.length > 0){
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
        
      </div>
      <div className='d-md-flex mb-3'>
        <button className='col-3' type='button' onClick={handlePrevious}>Previous</button>
        <button className="col-3" type="button" onClick={handleNext}>Next</button>
      </div>
      <ErrorAlert error={error} />
      <div className="row">
      <div className="col-6">
      <Reservations reservations={reservations} handleCancel={handleCancel} />
</div>
<div className="col-6 ">
  <TablesList tables={tables} handleFinish={handleFinish}/>
</div>
</div>
    </main>
  );
}
else{
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <div className='d-md-flex mb-3'>
        <button className='col-3' type='button' onClick={handlePrevious}>Previous</button>
        <button className="col-3" type="button" onClick={handleNext}>Next</button>
      </div>
      <ErrorAlert error={error} />
      <div className="col-6 mb-6">
      <h6 className="mb-0">No Reservations for date: {date}</h6>
      </div>
      <div className="row">
        <div className="col-6">{null}</div>
      <div className="col-6">
      <TablesList tables={tables} handleFinish={handleFinish}/>
      </div>
      </div>
    </main>
  )
}
}

export default Dashboard;
