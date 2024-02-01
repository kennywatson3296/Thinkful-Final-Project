import React from 'react'
import {useHistory} from 'react-router-dom'
import {deleteReservation} from "../utils/api"

function Reservations({reservations}){
   
    const history = useHistory()
    console.log(history)


  function seatReservation(reservation){

  }

  function editReservation(){}

    
    
    const cards = reservations.map((res)=> {
         return ( <div className='border border-secondary'>
      <div key={res.reservation_id} className='card-body'>
          <h5 className='card-title'>{res.first_name} {res.last_name}</h5>
          <p className='card-text'>
              Party of {res.people}
          </p>
          <p className = 'card-text'>
            Mobile Number: {res.mobile_number}
          </p>
          <p className='card-test'>
             Reservation Time: {res.reservation_time}
          </p>
      </div>
      <button type='button' className="btn btn-danger " onClick={()=> deleteReservation(res.reservation_id)}>Delete</button>
      <button className='btn btn-success' onClick={seatReservation(res)}>Seat</button>
      <button type='button' className='btn btn-info' onClick={editReservation(res)}>
        Edit</button>
      </div>
    )})
  
    return ( <div>
        {cards}
    </div>
    )
    
}


export default Reservations