const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const service = require("./tables.service")

async function list(req, res){
    res.json({data: await service.list()})
}

function hasData(req, res, next){
    if(req.body.data){
        return next()
    }
    next({ status: 400, message: "Body must have a data property."})
}

function hasName(req, res, next){
    const {data: {table_name} = {}} = req.body
    if(table_name){
        return next()
    }
    next({status: 400, message: `Table must have a name!`})
}

function hasCapacity(req, res, next){
    const {data: {capacity}} = req.body
    if(capacity && capacity >= 1){
        return next()
    }
    next({status: 400, message: `Capacity must be more than 0!`})
}

async function create(req, res){
    const newTable = await service.create(req.body.data)
    res.status(201).json({
        data: newTable
    })}

async function tableExists(req, res, next){
    const {tableId} = req.params
    const table = await service.read(tableId)
    if(table){
        res.locals.table = table
        return next()
    }
    return next({
        status: 404, message: `Nonexistent table: table id ${tableId}.`
    })
}


async function destroy(req, res, next){
    await service.delete(res.locals.table.table_id)
    res.sendStatus(204)
}

function read(req, res, next){
    const {table} = res.locals
    res.json({data: table})
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [hasData, hasName, hasCapacity, asyncErrorBoundary(create)],
    delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
    read: [asyncErrorBoundary(tableExists), read],
}