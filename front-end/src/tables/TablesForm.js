import React from 'react'


function TablesForm({table, changeHandler}) {
   
    return (
        
    <>
                <div className='row mb-3'>
                    <div className='col-6 form-group'>
                        <label className='form-label' htmlFor='firstName'>
                            Table Name:
                        </label>
                        <input className='form-control'
                        id='table_name'
                        name="table_name"
                        type='text'
                        value = {table.table_name}
                        onChange = {changeHandler}
                        required = {true}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label className='form-label' htmlFor='lastName'>
                            Capacity:
                        </label>
                        <input className = 'form-control'
                        id='capacity'
                        name="capacity"
                        type = 'number'
                        min='1'
                        value = {table.capacity}
                        onChange = {changeHandler}
                        required = {true}
                        />
                    </div>
                </div>
        
               
                
              </>  
           
        )
    }

    export default TablesForm
    