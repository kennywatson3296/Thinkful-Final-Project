const knex = require('../db/connection')


//list all reservations
function list(date){
    return knex('reservations')
    .select('first_name','last_name', 'mobile_number', 'people', 'reservation_date', 'reservation_time', 'reservation_id', 'status')
    .where({ 'reservation_date' : date })
    .whereNot({'status': 'finished'})
    .orWhereNot({'status': 'cancelled'})
    //added because of non-understanding why my migrations failed to rollback and delete D.B. data
    .distinctOn('first_name')
    
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
.returning(['first_name', 'last_name', 'mobile_number', 'people', 'reservation_id'])
.insert(newReservation)

}

function update(updatedReservation){
    return knex("reservations")
    .select('*')
    .where({"reservation_id": updatedReservation.reservation_id})
    .update(updatedReservation, "*")
}

function updateStatus(updatedReservation){
    return knex("reservations")
    .select("*")
    .where({"reservation_id": updatedReservation.reservation_id})
    .update(updatedReservation, "status")
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
    updateStatus,
}