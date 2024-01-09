import React from "react"

function ReservationForm({data, changeHandler}){

    return (
        
<>
            <div className='row mb-3'>
                <div className='col-6 form-group'>
                    <label className='form-label' htmlFor='firstName'>
                        First Name:
                    </label>
                    <input className='form-control'
                    id='first_name'
                    name="first_name"
                    type='text'
                    value = {data.first_name}
                    onChange = {changeHandler}
                    required = {true}
                    />
                </div>
                <div className='col-6 form-group'>
                    <label className='form-label' htmlFor='lastName'>
                        Last name:
                    </label>
                    <input className = 'form-control'
                    id='last_name'
                    name="last_name"
                    type = 'text'
                    value = {data.last_name}
                    onChange = {changeHandler}
                    required = {true}
                    />
                </div>
            </div>

            <div className='row mb-3'>
                <div className='col-6 form-group'>
                    <label className = 'form-label' htmlFor='mobileNumber'>
                        Phone Number:
                    </label>
                    <input className = 'form-control'
                    id = 'mobile_number'
                    name="mobile_number"
                    type='tel'
                    pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
                    value = {data.mobile_number}
                    onChange = {changeHandler}
                    required = {true}
                    />
                </div>
                <div className='col-6 form-group'>
                    <label className='form-label' htmlFor='people'>
                        Amount of Guests:
                    </label>
                    <input className = 'form-control'
                    id='people'
                    name="people"
                    type='number'
                    min='1'
                    value = {data.people}
                    onChange = {changeHandler}
                    required = {true}
                    />
                </div>
            </div>

            <div className='row mb-3'>
                <div className='col-6 form-group'>
                    <label className = 'form-label' htmlFor='reservationDate'>
                        Reservation Date:
                    </label>
                    <input className='form-control'
                    id='reservation_date'
                    name="reservation_date"
                    type='date'
                    value={data.reservation_date}
                    onChange = {changeHandler}
                    required = {true}
                    />
                </div>
                <div className = 'col-6 form-group'>
                    <label className = 'form-label' htmlFor='reservationTime'>
                        Reservation Time:
                    </label>
                    <input className = 'form-control'
                    id='reservation_time'
                    name="reservation_time"
                    type='time'
                   
                    value = {data.reservation_time}
                    onChange = {changeHandler}
                    required = {true}
                    />
                </div>
            </div>
          </>  
       
    )
}

export default ReservationForm