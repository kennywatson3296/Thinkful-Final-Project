const knex = require("../db/connection")

function list(){
    return knex('tables')
    .select('table_id','table_name', 'capacity', 'reservation_id' )
    .orderBy('table_name')
    .distinct()
}

function destroy(tableId){
    return knex('tables')
    .where({"table_id" : tableId})
    .del()
}

function create(newTable){
    return knex('tables')
    .returning(['table_name', 'capacity'])
    .insert(newTable)
}

function read(tableId){
    return knex('tables')
    .select('*')
    .where({'table_id': tableId})
    .first()
}

function update(updatedTable){
    return knex('tables')
    .select('*')
    .where({'table_id': updatedTable.table_id})
    .update(updatedTable, '*')
}

function readReservation(reservationId){
    return knex('reservations')
    .select('*')
    .where({'reservation_id': reservationId})
    .first()
}

function finishTable(updatedTable){
    return knex('tables')
    .where({'table_id': updatedTable.table_id})
    .update(updatedTable)
}

module.exports = {
    list,
    create,
    delete: destroy,
    read,
    update,
    readReservation,
    finishTable
}