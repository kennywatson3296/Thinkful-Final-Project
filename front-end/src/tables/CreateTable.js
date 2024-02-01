import React, {useState} from "react"
import TablesForm from "./TablesForm"
import {useHistory} from 'react-router-dom'
import {createTable} from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"
function CreateTable(){
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
        console.log(table)
    }

    function cancelHandler(){
        history.goBack()
        }

    function submitHandler(event){
        event.preventDefault()
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
            <TablesForm data={table} changeHandler={changeHandler}/>
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