const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const service = require("./tables.service")
const reservationService = require("../reservations/reservations.service")
const reservationsService = require("../reservations/reservations.service")
//const reservationsService = require("../reservations/reservations.service")


async function list(req, res){
    let data = await service.list()
    let response = res.json({data: data})
   res.json({data: response })
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
    const tab = await service.read(tableId)
    const table = tab[0]
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
    const reservation = res.locals.reservation
    const {status} = req.body.data
    
const updatedTable = {
    ...table,
    reservation_id: reservation.reservation_id,
}
const updatedReservation = {
    ...reservation,
    status: status
}

const newTable = await service.update(updatedTable)

const response = await reservationService.updateStatus(updatedReservation)

res.json({ data: response})
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
    const reservation = res.locals.reservation
    const updatedTable = {
        ...table, 
        reservation_id: null,
    }
    
    const updatedReservation = {
        ...reservation,
        status: "finished"
    }
    await service.update(updatedTable)
    const response = await reservationService.updateStatus(updatedReservation)
    
    res.status(200).json({data:  response} )
}

// Verifications for reservation Service to update the status on the call of table/put and table/delete
//status verification to update the status of the reservation, seat and finish


function hasValidStatus(req, res, next){
    const {status} = req.body.data
    const reservation = res.locals.reservation
    if (!status || status === 'booked'){
      return next()
    }else if(status === 'seated' && reservation.status === 'seated'){
      return next({
        status:400, message: 'seated'
      })
    }else if(status === 'cancelled'){
      return next()
    }else if(reservation.status === 'seated' && status === 'finished'){
      return next()
    }else if(reservation.status === 'finished'){
      return next({status:400, message: 'finished'})
    }else if(status === 'seated' && reservation.status === 'booked'){
      return next()
    }else if(reservation.status !== 'finished' && status === 'finished'){
    return next()
    }else{
    return next({
      status:400, message: 'unknown'
    })}
  }
  async function reservationExists(req, res, next){
    const reservationId = req.body.data.reservation_id
    
    const reservation = await service.readReservation(reservationId)
    if(reservation){
      res.locals.reservation = reservation
      return next()
    }
    return next({
      status: 404, message: `Nonexistent reservation: reservation id ${reservationId}`
    })
  }

  //reservationExists for delete request
  async function reservationExistsOnDelete(req, res, next){
    const table = res.locals.table
    const reservationId = table.reservation_id
    const reservation = await service.readReservation(reservationId)
    if(reservation){
        res.locals.reservation = reservation
        return next()
    }
    return next({
        status: 404, message: `Nonexistent reservation: reservation id ${reservationId}`
    })
  }
  /*async function updateStatus(req, res, next){
    const {reservation} = res.locals.reservation
    const {status} = req.body.data
    const updatedReservation = {
      ...reservation,
      status: status}
    await reservationsService.updateStatus(updatedReservation)
    res.json({data: {status: status}})
  }*/


module.exports = {
    list: asyncErrorBoundary(list),
    create: [hasData, hasName, hasCapacity, asyncErrorBoundary(create)],
    delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
    read: [asyncErrorBoundary(tableExists), read],
    update: [hasData, hasId, asyncErrorBoundary(tableExists), asyncErrorBoundary(checkTable),
        asyncErrorBoundary(checkCap), asyncErrorBoundary(reservationExists), hasValidStatus, asyncErrorBoundary(update)],
    finishTable: [ asyncErrorBoundary(tableExists), hasOccupants, asyncErrorBoundary(reservationExistsOnDelete), asyncErrorBoundary(finishTable)]
}