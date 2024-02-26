const knex = require("../db/connection")

function list(){
    return knex('tables')
    .select('table_id','table_name', 'capacity', 'reservation_id' )
    //the whereNot and distinction is only here because I tried troubleshooting
    //the migrations in the tests because it wasn't properly dropping the D.B. every test so it seeded it 10 times in the us-04 test
    .whereNot({'table_name': 'table-name'})
    .orderBy('table_name')
    .distinctOn('table_name')
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
    .select("*")
    .where({'table_id': updatedTable.table_id})
    .update(updatedTable, "*")
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