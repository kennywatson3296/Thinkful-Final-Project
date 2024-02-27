import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import { searchReservations } from '../utils/api'
import ErrorAlert from "../layout/ErrorAlert"
import Reservations from './Reservations'


function FindReservation(){
const history = useHistory()

const [mobile_number, setMobile_Number] = useState('')
const [found, setFound] = useState([])
const [error, setError] = useState(null)
const [tried, setTried] = useState(false)



function submitHandler(event){
event.preventDefault()
const abortController = new AbortController()
searchReservations({mobile_number}, abortController.signal)
.then(setFound)
.catch(setError)
setTried(true)
return () => abortController.abort()
}

function cancelHandler(){
    history.goBack()
}

function changeHandler({target: {name, value}}){
    let val = value.replace(/\D/g, '')
    if(val.length >3){
        val = val.substring(0,3) + '-' + val.substring(3)
    }
    if(val.length > 7){
        val = val.substring(0,7) + '-' + val.substring(7)
    }
    setMobile_Number(val)
}

 if(found.length === 0){   
return( <div>
    <h1>Search Reservations</h1>
    <h5>{tried ? `No reservations found for mobile number ${mobile_number} ` : null}</h5>
    <ErrorAlert error={error} />
    <form className="mt-3" onSubmit={submitHandler}>
        <input name="mobile_number" className='col-4 mb-3 ml-3'  value={mobile_number} onChange={changeHandler} placeholder="Enter a customer's phone number"></input>
    <div className='row mb-3 justify-content-end'>
        <button className='btn btn-secondary col-3 mb-3' onClick={cancelHandler}>Cancel</button>
        <button type='submit' className='btn btn-primary col-3 mb-3'>Search</button>
    </div>
    </form></div>
     )}else{
        return(<div>
<Reservations reservations={found} />
        </div>)
     }

}

export default FindReservation