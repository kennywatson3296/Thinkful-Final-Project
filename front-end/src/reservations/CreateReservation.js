import React, {useState, useEffect} from "react"
import {useHistory} from 'react-router-dom'
import {createReservation} from "../utils/api"
import ReservationForm from "./ReservationForm"
import ErrorAlert from "../layout/ErrorAlert"
import { today } from "../utils/date-time"

function CreateReservation({setDate}){
    const history = useHistory()
    const toDay = today()

    const criteria = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
    }

    //set the variable to update for creation
const [reservation, setReservation] = useState(criteria)
const [error, setError] = useState(null)



const errorResponses = {
    day: "The store is closed on Tuesdays.",
    past: "Reservations must be made in the future!",
    both: "Reservations must be made on a future working date.",
    time: "Reservations need to be within business hours."
  }

  function checkValid({reservation_date, reservation_time}){
    let result = null
    let day
    let time
    reservation_date.length > 0 ? day = reservation_date : day = toDay
    reservation_time.length > 0 ? time = reservation_time.split(':').join('') : time = 1300
    const date = new Date(day)
    
    date.getDay() === 1 && day < toDay  ? result = "both" 
  : date.getDay() === 1 ? result = "day"
  : day< toDay ? result = "past"
  : time > 2130 || time < 1030 ? result = "time"
  : result = null
  
if(result !== null){
    const newErr = {message: errorResponses[result]}
    setError(newErr)
}else{
    setError(null)
}

  }

  useEffect(()=>{
    checkValid(reservation)
  }, [reservation])





//if cancel return home
function cancelHandler(){
history.goBack()
}


//submitHandler function for creating reservations
  function submitHandler(event){
    event.preventDefault()
    setError(null)
    createReservation(reservation)
    .then(setDate(reservation.reservation_date))
    .then(()=>{
        history.push('/')
    })
    .catch(setError)

}

//changeHandler function for altering data for submission
 function changeHandler({target: {name, value}}){
    if(name === 'people'){
        setReservation((previousReservation)=>({
            ...previousReservation,
            [name]: Number(value),
        }))
    }else{
    setReservation((previousReservation)=>({
        ...previousReservation,
        [name]: value,
    }))}
    
   }
    
  



    return (
     <main>
        <h1 className='mb-3'>New Reservation</h1>
        <ErrorAlert error={error}  />
<form onSubmit = {submitHandler}>
        <ReservationForm data = {reservation} 
        changeHandler={changeHandler}  />
        <div className ='row mb-3 justify-content-end'>
                <div className='col-3 mb-3'>
                    <button type='button' className='btn btn-secondary' onClick={cancelHandler}>Cancel</button>
                </div>
                <div className='col-3 mb-3'>
                    <button type="submit" className='btn btn-primary' >Submit</button>
                </div>
            </div>
        </form>
     </main>   
    )
}

export default CreateReservation