const knex = require('../db/connection')


//list all reservations
function list(date){
    return knex('reservations')
    .select('*')
    .where({'reservation_date': date})
    
}

function listAll(){
    return knex('reservations as r')
    .select('r.*')
    
}

function destroy(reservationId){
    return knex('reservations')
    .where({"reservation_id" : reservationId })
    .del()
}

//create a reservation
function create(newReservation){
return knex('reservations').insert(newReservation).returning('*')
}

function read(reservationId){
    return knex('reservations')
    .select('*')
    .where({'reservation_id': reservationId})
    .first()
}

module.exports = {
    list,
    create,
    listAll,
    delete: destroy,
    read,
}