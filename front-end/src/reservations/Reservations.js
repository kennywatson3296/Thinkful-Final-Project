import React from 'react'
import {deleteReservation} from "../utils/api"

function Reservations({reservations}){
   
  

    
    
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
              Reservation date: {res.reservation_date}, Reservation Time: {res.reservation_time}
          </p>
      </div>
      <button className="btn btn-danger " onClick={()=> deleteReservation(res.reservation_id)}>Delete</button>
      </div>
    )})
  
    return ( <main>
        {cards}
    </main>
    )
    
}


export default Reservations