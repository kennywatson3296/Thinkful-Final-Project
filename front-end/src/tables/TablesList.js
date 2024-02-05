import React from "react"

function TablesList({tables, handleFinish}){

   
const cards = tables.map((table)=>{
    if(table.reservation_id !== null){
    return (
        <div key={table.table_id} className="border border-secondary">
            <div className="card-body">
                <h5 className="card-title">{table.table_name}</h5>
                <p className="card-text">Capacity: {table.capacity}</p>
                <p className="card-text">Reservation: {table.reservation_id}</p>
                <p className="card-text" data-table-id-status={table.table_id}>occupied</p>
                <div className="row justify-content-end mb-3">
                        <button id={table.table_id} data-table-id-finish={table.table_id} name={table.reservation_id} className="btn btn-success" onClick={handleFinish}>Finish</button>
                </div>
            </div>
        </div>
    )}
    else{
        return(
            <div key={table.table_id} className="border border-secondary">
            <div  className="card-body">
                <h5 className="card-title">{table.table_name}</h5>
                <p className="card-text">Capacity: {table.capacity}</p>
                <p className="card-text" data-table-id-status={table.table_id}>free</p>
                <div className="row justify-content-end mb-3">
                </div>
            </div>
        </div>
        )
    }
})


return (<>
    {cards}
</>)

}

export default TablesList