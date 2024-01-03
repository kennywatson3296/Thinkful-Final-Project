/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service")

async function list(req, res) {
 if(req.query){
  if(req.query.date){
    res.json({data: await service.list(req.query.date)})
  }
 }
 else {
  res.json({data: await service.listAll()})
 }
}

function hasData(req, res, next) {
  if (req.body.data) {
    return next()
  }
  next({status: 400, message: "body must have data property"})
}

function hasProperty(property){
return function (req, res, next){
  const {data = {}} = req.body
  if(data[property]){
    return next()
  }
  next({status: 400, message: `${property} invalid!`})
}}

function hasPeople(req, res, next){
  const {data: {people} = {}} = req.body
  if(Number(people) > 0){
    return next()
  }
  next({status:400, message: `Number of people in the party must be more than 0!`})
}

function validDate(req, res, next){
  const {data: {reservation_date}} = req.body
  const date = new Date(reservation_date.toString())
  const today = new Date()
  const day = reservation_date
  if(day < today){
    return next({
      status:400, message:`Must make reservations on a future date!`
    })
  }
  else if(date.getDay() === 1){
    return next({
      status:400, message:`Restaurant is closed on Tuesdays.`
    })
  }
}

async function reservationExists(req, res, next){
  const {reservationId} = req.params
  const reservation = await service.read(reservationId)
  if(reservation){
    res.locals.reservation = reservation
    return next()
  }
  return next({
    status: 404, message: 'Cannot be found'
  })
}

async function create(req, res){
  const newReservation = await service.create(req.body.data)
  res.status(201).json({
    data: newReservation
  })
}
async function destroy(req, res, next){
  await service.delete(res.locals.reservation.reservation_id)
  res.sendStatus(204)
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasData, hasProperty('first_name'), hasProperty('last_name'), hasProperty('reservation_date'),
          hasProperty('reservation_time'), hasProperty('mobile_number'), validDate, asyncErrorBoundary(create)],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
  
};
