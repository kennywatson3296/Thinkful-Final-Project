const knex = require("../db/connection")

function list(){
    return knex('tables')
    .select('*')
}

function destroy(tableId){
    return knex('tables')
    .where({"table_id" : tableId})
    .del()
}

function create(newTable){
    return knex('tables')
    .returning('table_name', 'capacity')
    .insert(newTable)
}

function read(tableId){
    return knex('tables')
    .select('*')
    .where({'table_id': tableId})
    .first()
}

module.exports = {
    list,
    create,
    delete: destroy,
    read,
}