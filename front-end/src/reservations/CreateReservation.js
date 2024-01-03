import React, {useState} from "react"
import {useHistory} from 'react-router-dom'
import {createReservation} from "../utils/api"
import ReservationForm from "./ReservationForm"
import ErrorAlert from "../layout/ErrorAlert"
//import {today} from "../utils/date-time"
function CreateReservation({setDate}){
    const history = useHistory()
    

const criteria = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
}

/*const errorResponses = {
    day: "Reservation date must not be on Tuesdays.",
    past: "Reservations must not be made in the past!",
    both: "Reservations must not be made in the past, or on a Tuesday.",
    time: "Reservations need to be within business hours."
}*/

//set the variable to update for creation
const [reservation, setReservation] = useState(criteria)
const [error, setError] = useState(null)
//if cancel return home
function cancelHandler(){
history.push("/")
}

/*function checkValid(reservation){
    const date = new Date(reservation.reservation_date.toString())
    const day = reservation.reservation_date
    const time = reservation.reservation_time.split(":").join("")
   
let result = null

date.getDay() === 1 && day > today()  ? result = "both" 
: date.getDay() === 1 ? result = "day"
: day < today() ? result = "past"
: 1030 < time < 2130 ? result = "time"
: result = null

return result
  
}*/

//submitHandler function for creating reservations
 async function submitHandler(event){
    event.preventDefault()
    
   /*let msg =   await checkValid(reservation)
   if(msg !== null){
    setError(errorResponses[msg])
   }else{*/
    createReservation(reservation)
    .then(setDate(reservation.reservation_date))
    .then(()=>{
        history.push(`/`)
    })
    .catch(setError)
   //}
}

//changeHandler function for altering data for submission
function changeHandler({target: {name, value}}){
    setReservation((previousReservation)=>({
        ...previousReservation,
        [name]: value,
    }))
    console.log(reservation.reservation_date)
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
                    <button type='submit' className='btn btn-primary' >Submit</button>
                </div>
            </div>
        </form>
     </main>   
    )
}

export default CreateReservation