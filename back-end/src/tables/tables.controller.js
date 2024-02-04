const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const service = require("./tables.service")

async function list(req, res){
    res.json({data: await service.list()})
}

function hasData(req, res, next){
    
    if(req.body.data){
        return next()
    }
    next({ status: 400, message: "Body must have a data property."})
}

function hasName(req, res, next){
    const {data: {table_name} = {}} = req.body
    if(table_name && table_name.length > 1){
        return next()
    }
    next({status: 400, message: `table_name`})
}

function hasCapacity(req, res, next){
    const {data: {capacity}} = req.body
    if(typeof capacity === 'number'){
    if(capacity && capacity >= 1){
        return next()
    }}
    next({status: 400, message: `capacity`})
}

function hasId(req, res, next){
    const {data} = req.body
    if(data.reservation_id){
        return next()
    }
    return next({
        status:400, message: 'reservation_id'
    })
}

async function create(req, res){
    const newTable = await service.create(req.body.data)
    res.status(201).json({
        data: newTable[0]
    })}

    //checks if a table exists
async function tableExists(req, res, next){
    const {tableId} = req.params
    const table = await service.read(tableId)
    
    if(table){
        res.locals.table = table
        return next()
    }
    return next({
        status: 404, message: `Nonexistent table: table id ${tableId}.`
    })
}

//checks capacity of table vs people in party
async function checkCap(req, res, next){
    const cap = res.locals.table.capacity
    const {reservation_id} = req.body.data
    
    const reservation = await service.readReservation(reservation_id)
   if(reservation){
    if(Number(cap) >= Number(reservation.people)){
        return next()
    }
    return next({
        status: 400, message: `Table capacity too low for reservation!`
    })}
return next({
    status: 404, message: '999'
})}

//checks if a table is occupied
async function checkTable(req, res, next){
    const table = res.locals.table
    if(table.reservation_id){
        return next({
            status: 400, message: `Table already occupied with reservation!`
        })}
    return next()}

    //Updates a table to add a reservation
async function update(req, res, next){
    const table = res.locals.table
    const {reservation_id} = req.body.data
const updatedTable = {
    ...table,
    reservation_id: reservation_id,
}
await service.update(updatedTable)
res.json({ data: await service.read(updatedTable.table_id)})
}


async function destroy(req, res, next){
    await service.delete(res.locals.table.table_id)
    res.sendStatus(204)
}

function read(req, res, next){
    const {table} = res.locals
    res.json({data: table})
}

function hasOccupants(req, res, next){
    const table = res.locals.table
    if(table.reservation_id){
        return next()
    }return next({
        status: 400, message: 'not occupied'
    })
}
async function finishTable(req, res, next){
    const table = res.locals.table
    const updatedTable = {
        ...table, 
        reservation_id: null,
    }
    await service.update(updatedTable)
    res.status(200).json({data: updatedTable })
}


module.exports = {
    list: asyncErrorBoundary(list),
    create: [hasData, hasName, hasCapacity, asyncErrorBoundary(create)],
    delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
    read: [asyncErrorBoundary(tableExists), read],
    update: [hasData, hasId, asyncErrorBoundary(tableExists), asyncErrorBoundary(checkTable),
        asyncErrorBoundary(checkCap), asyncErrorBoundary(update)],
    finishTable: [ asyncErrorBoundary(tableExists), hasOccupants, asyncErrorBoundary(finishTable)]
}