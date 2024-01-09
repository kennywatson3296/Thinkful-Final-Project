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
  if(people > 0){
    return next()
  }
  next({status:400, message: `Number of people in the party must be more than 0!`})
}
const errorResponses = {
  day: "The store is closed on Tuesdays.",
  past: "Reservations must be made in the future!",
  both: "Reservations must be made on a future working date.",
  time: "Reservations need to be within business hours."
}

function validTimeframe(req, res, next){
  const {data: {reservation_date, reservation_time}} = req.body
  const day = new Date(reservation_date.toString())
  const today = new Date()
  const date = reservation_date
  const time = reservation_time.split(":").join("")
  let result = null


  day.getDay() === 1 && day < today  ? result = "both" 
  : day.getDay() === 1 ? result = "day"
  : day < today ? result = "past"
  : time > 2130 || time < 1030 ? result = "time"
  : result = null
  
  if(result !== null){
    return next({
      status: 400, message: errorResponses[result]
    })}
    else{
      return next()
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
    status: 404, message: 'Cannot be found: 99'
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
          hasProperty('reservation_time'), hasProperty('mobile_number'), hasPeople, validTimeframe, asyncErrorBoundary(create)],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
  
};
