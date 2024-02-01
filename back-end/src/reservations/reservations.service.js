const knex = require('../db/connection')


//list all reservations
function list(date){
    return knex('reservations')
    .select('first_name','last_name', 'mobile_number', 'people', 'reservation_date', 'reservation_time', 'reservation_id')
    .where({ 'reservation_date' : date })
    .distinct()
    
}

function search(mobile_number) {
        return knex("reservations")
        .whereRaw(
          "translate(mobile_number, '() -', '') like ?",
           `%${mobile_number.replace(/\D/g, "")}%`
         )
         .orderBy("reservation_date");
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
return knex('reservations')
.returning(['first_name', 'last_name', 'mobile_number', 'people'])
.insert(newReservation)

}

function update(updatedReservation){
    return knex("reservations")
    .select('*')
    .where({"reservation_id": updatedReservation.reservation_id})
    .update(updatedReservation, "*")
}

function read(reservationId){
    return knex('reservations')
    .select('*')
    .where({'reservation_id': reservationId})
    .first()
}

module.exports = {
    list,
    search,
    create,
    listAll,
    delete: destroy,
    read,
    update,
}