const { Router } = require("express");

const DishesController = require("../controllers/DishesController");

const ensureAuthentication = require("../middlewares/ensureAuthentication")
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization")

const dishesRoutes = Router();

const dishesController = new DishesController();

dishesRoutes.use(ensureAuthentication)

dishesRoutes.post("/", verifyUserAuthorization(["admin"]), dishesController.create);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", verifyUserAuthorization(["admin"]), dishesController.delete);
dishesRoutes.patch("/:id", verifyUserAuthorization(["admin"]), dishesController.update);
dishesRoutes.get("/", dishesController.index);

module.exports = dishesRoutes;