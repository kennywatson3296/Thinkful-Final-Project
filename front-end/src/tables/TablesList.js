import React from "react"

function TablesList({tables, handleFinish}){

   
const cards = tables.map((tab)=>{
    if(tab.reservation_id !== null){
    return (
        <div key={tab.table_id} className="border border-secondary">
            <div className="card-body">
                <h5 className="card-title">{tab.table_name}</h5>
                <p className="card-text">Capacity: {tab.capacity}</p>
                <p className="card-text">Reservation: {tab.reservation_id}</p>
                
                <div className="row justify-content-end mb-3">
                        <button data-table-id-finish={tab.table_id} name={tab.table_id} className="btn btn-success" onClick={handleFinish}>Finish</button>
                        <button data-table-id-status={tab.table_id} className="btn btn-danger">Occupied</button>
                   
                </div>
            </div>
        </div>
    )}
    else{
        return(
            <div key={tab.table_id} className="border border-secondary">
            <div  className="card-body">
                <h5 className="card-title">{tab.table_name}</h5>
                <p className="card-text">Capacity: {tab.capacity}</p>
                <div className="row justify-content-end mb-3">
                    <div className="col-3 mb-3">
                        <button data-table-id-status={tables.table_id} className='btn btn-success'>Free</button>
                    </div>
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