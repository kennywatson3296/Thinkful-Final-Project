/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const service = require("./reservations.service")

async function list(req, res) {
if(req.query.date){
  const date = req.query.date
  res.json({ data: await service.list(date)})
}else if(req.query.mobile_number){
  const number = req.query.mobile_number
  res.json({data: await service.search(number)})
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
  const {data: {people}} = req.body
  
  if(typeof people === 'number' && people > 0){
    return next()
  }
  next({status:400, message: `Number of people in the party must be more than 0`})
}


const errorResponses = {
  day: "The store is closed on Tuesdays.",
  past: "Reservations must be made in the future!",
  both: "Reservations must be made on a future working date.",
  time: "Reservations need to be within business hours."
}

function validTimeframe(req, res, next){
  const {data: {reservation_date, reservation_time}} = req.body
  const day = new Date(`${reservation_date}`)
  const today = new Date().toISOString().slice(0,10)
 const daySub = day.toISOString().slice(0,10)

  const time = reservation_time.split(":").join("")
  let result = null
  day.getDay() === 1 && daySub < today  ? result = "both" 
  : day.getDay() === 1 ? result = "day"
  : daySub < today ? result = "past"
  : time > 2130 ? result = "time"
  : time < 1030 ? result = "time"
  : result = null
  
  if(result !== null){
    const response = errorResponses[result]
    return next({
      status: 400, message: response
    })}
    else{
      return next()
    }
}

function validDate(req, res, next){
  const {data: {reservation_date}} = req.body
  if(reservation_date && new Date(reservation_date)>0 ){
    return next()
  }else{
    next({
      status: 400, message: `Property reservation_date invalid!`
    })
  }
}

function validTime(req, res, next){
  const {data: {reservation_time}} = req.body
  const time = reservation_time.split(":").join("")
 
  if(Number(time) && time>=0 && time <2400 ){
    return next()
  }
  return next({
    status:400, message: `reservation_time invalid!`
  })
}


async function reservationExists(req, res, next){
  const {reservationId} = req.params
  const reservation = await service.read(reservationId)
  if(reservation){
    res.locals.reservation = reservation
    return next()
  }
  return next({
    status: 404, message: `Nonexistent reservation: reservation id ${reservationId}`
  })
}

async function create(req, res){
  const newReservation = await service.create(req.body.data)
  
  res.status(201).json({
    data: newReservation[0]
  })
}

async function destroy(req, res, next){
  await service.delete(res.locals.reservation.reservation_id)
  res.sendStatus(204)
}

async function read(req, res, next){
  const {reservation} = res.locals
  res.json({data: reservation})
}

async function update(req, res, next){
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  }
  await service.update(updatedReservation)
  res.json({data: await service.read(updatedReservation.reservation_id)})
}

async function updateStatus(req, res, next){
  const {reservation} = res.locals
  const {status} = req.body.data
  const updatedReservation = {
    ...reservation,
    status: status}
  await service.updateStatus(updatedReservation)
  res.json({data: await service.read(updatedReservation.reservation_id)})
}

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
  }else if(reservation.status === 'finished'){
    return next({status:400, message: 'finished'})
  }
  return next({
    status:400, message: 'unknown'
  })
}

function createStatusCheck(req, res, next){
  const reserv = req.body.data
  const status = reserv.status
  const reservation = res.locals.reservation
  const options = ['seated', 'cancelled', 'finished']
 if(!status){
  return next()}
if(reservation.status === 'seated' && status === 'seated'){
  return next({status: 400, message: 'seated'})
}
if(reservation.status === 'finished'){
  return next({status: 400, message: 'finished'})
}
if(status === 'booked'){
  return next()
}
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasData, hasProperty('first_name'), hasProperty('last_name'), validDate, createStatusCheck,
          hasProperty('reservation_time'), hasProperty('mobile_number'), hasProperty('people'), hasPeople, validTime, validTimeframe, asyncErrorBoundary(create)],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [asyncErrorBoundary(reservationExists), hasData, hasProperty('first_name'), hasProperty('last_name'), validDate,
  hasProperty('reservation_time'), hasProperty('mobile_number'), hasProperty('people'), hasPeople, validTime, validTimeframe, asyncErrorBoundary(update)],
  updateStatus: [hasData, asyncErrorBoundary(reservationExists), hasValidStatus, asyncErrorBoundary(updateStatus)],
  
};
