import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import { listTables, readReservation, seatReservation } from '../utils/api'
import ErrorAlert from '../layout/ErrorAlert'

function SeatReservation({setDate}){
const {reservationId} = useParams()
console.log(reservationId)

const status = 'seated'
const history = useHistory()
const [tables, setTables] = useState([])
const [error, setError] = useState(null)
const [reservation, setReservation] = useState({})
const [selected, setSelected] = useState('Please select a table')
const [table, setTable] = useState([])


useEffect(()=>{
    listTables()
    .then(setTables)
    .catch((err)=> {
        setError({ message: err })
    })
}, [])


useEffect(()=> {
    readReservation(reservationId)
    .then(setReservation)
    .catch((err)=> {
        setError({message: err})
    })
   
}, [])


useEffect(()=>{
    if(selected !== 'Please select a table'){
        setTable(findTable(selected))
}}, [selected, findTable])

useEffect(()=>{
    function checkCap(tab){
        if(tab.capacity < reservation.people){
            setError({message: 'Table capacity must be more than people'})
        }
    }
    checkCap(table)
}, [table])

function changeHandler({target}){
  setError(null)
 setSelected(target.value)
}

function findTable(id){
     return tables.find(el => el.table_id === Number(id))
}


function submitHandler(event){
    event.preventDefault()
    setError(null)
    seatReservation(table.table_id, reservation.reservation_id, status)
    .then(setDate(reservation.reservation_date))
            .then(()=>{
                history.push('/')   
            })
    .catch(setError)
}

function cancelHandler(){
    history.goBack()
}

    return(
        <div>
    <h1>Select a table to seat a party of {reservation.people}</h1>
        <ErrorAlert error={error} />
        <form onSubmit={submitHandler}className='mt-3' >
            <label htmlFor='tableSelect'>Table Number:</label>
        <select name="table_id" value={selected} className='form-select form-select-lg mb-3 col-6' onChange={changeHandler}>
        <option value="" >Please select a table</option>
        {tables.map(table => (
          <option key={table.table_id} value={table.table_id}>
            {`${table.table_name} - ${table.capacity}`}
          </option>
        ))}
        </select>
        <div className='row justify-content-end'>
            <button className='col-3 mb-3 btn btn-secondary' onClick={cancelHandler}>Cancel</button>
            <button type="submit" className='col-3 mb-3 btn btn-primary' onClick={submitHandler}>Submit</button>
        </div>
        </form>
        </div>
    )

}

export default SeatReservation