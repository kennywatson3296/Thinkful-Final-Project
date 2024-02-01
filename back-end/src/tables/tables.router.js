const methodNotAllowed = require("../errors/methodNotAllowed")
const router = require("express").Router()
const controller = require("./tables.controller")

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed)

router.route("/:tableId").get(controller.read).delete(controller.delete).all(methodNotAllowed)

module.exports = router