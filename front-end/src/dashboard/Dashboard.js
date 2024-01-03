import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "../reservations/Reservations"
import {next, previous} from "../utils/date-time"
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({date, setDate}) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  
  

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function handlePrevious(event){
    event.preventDefault()
   setDate(previous(date))

  }

  function handleNext(event){
    event.preventDefault()
    setDate(next(date))
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
      <ErrorAlert error={reservationsError} />
      <Reservations reservations={reservations} />
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
      <ErrorAlert error={reservationsError} />
      <h6 className="mb-0">No Reservations for date: {date}</h6>
    </main>
  )
}
}

export default Dashboard;
