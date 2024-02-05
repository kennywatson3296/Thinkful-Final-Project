import React from 'react'
import {Link} from 'react-router-dom'


function Reservations({reservations, handleCancel}){  
  const options = ['finished', 'cancelled']
    
    const cards = reservations.map((reservation)=> {
      if(options.indexOf(reservation.status)<0){
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
      <button type='button' name={reservation.reservation_id} data-reservation-id-cancel={reservation.reservation_id} className="btn btn-danger " onClick={handleCancel}>Cancel</button>
      {reservation.status === 'booked' ? <Link to={`/reservations/${reservation.reservation_id}/seat`} className="btn btn-success">Seat</Link>
      : null }
      <Link to={`/reservations/${reservation.reservation_id}/edit`}><button className='btn btn-secondary'>Edit</button></Link>
      </div>
    )}})
  
    return ( <div>
        {cards}
    </div>
    )
    
}


export default Reservations