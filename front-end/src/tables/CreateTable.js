import React, {useState} from "react"

import {useHistory} from 'react-router-dom'
import {createTable} from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"


function CreateTable({setDate}){
const history = useHistory()
    const criteria = {
       table_name: '',
       capacity: '',
    }

    const [table, setTable] = useState(criteria)
    const [error, setError] = useState(null)

    function changeHandler({target: {name, value}}){
        setTable((previousTable)=>({
            ...previousTable,
            [name]: value,
        }))
    }

    function cancelHandler(){
        history.goBack()
        }

    function submitHandler(event){
        event.preventDefault()
        table.capacity = Number(table.capacity)
        createTable(table)
        .then(()=>{
            history.push('/')
        })
        .catch(setError)
    }

    return (
        <main>
            <h1 className="mb-3">New Table</h1>
            <ErrorAlert error={error} />
            <form onSubmit = {submitHandler}>
            <div className='row mb-3'>
                    <div className='col-6 form-group'>
                        <label className='form-label' htmlFor='firstName'>
                            Table Name:
                        </label>
                        <input name="table_name"
                        id='table_name'
                        className='form-control'
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
            <div className="row mb-3 justify-content-end">
                <div className="col-3 mb-3">
                    <button onClick={cancelHandler} className='btn btn-secondary'>
                        Cancel</button>
                </div>
                <div className="col-3 mb-3">
                    <button type="submit" className="btn btn-primary"
                    onClick={submitHandler}>Submit </button>
                </div>
            </div>
            </form>

        </main>
    )
}

export default CreateTable