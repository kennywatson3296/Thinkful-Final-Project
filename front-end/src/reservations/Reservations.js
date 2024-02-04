import React from 'react'

import {deleteReservation} from "../utils/api"

function Reservations({reservations}){  
  
    
    const cards = reservations.map((reservation)=> {
      const reservation_id = reservation.reservation_id
      if(reservation.status !== 'finished')
         return ( <div key={reservation.reservation_id} className='border border-secondary'>
      <div  className='card-body'>
          <h5 className='card-title'>{reservation.first_name} {reservation.last_name}</h5>
          <p className='card-text'>
              Party of {reservation.people}
          </p>
          <p className = 'card-text'>
            Mobile Number: {reservation.mobile_number}
          </p>
          <p className='card-text'>
             Reservation Time: {reservation.reservation_time}
          </p>
          <p data-reservation-id-status={reservation.reservation_id} className='card-text'>
            Status: {reservation.status}
          </p>
      </div>
      <button type='button' className="btn btn-danger " onClick={()=> deleteReservation(reservation_id)}>Delete</button>
      {reservation.status === 'booked' ? <a href={`/reservations/${reservation_id}/seat`} className='btn btn-success'>Seat</a>
      : null }
      <a href={`/reservations/${reservation_id}/edit`} className='btn btn-secondary'>Edit</a>
      </div>
    )})
  
    return ( <div>
        {cards}
    </div>
    )
    
}


export default Reservations