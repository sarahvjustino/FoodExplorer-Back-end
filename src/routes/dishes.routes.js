const { Router } = require("express");

const DishesController = require("../controllers/DishesController");

const ensureAuthentication = require("../middlewares/ensureAuthentication")

const dishesRoutes = Router();

const dishesController = new DishesController();

dishesRoutes.use(ensureAuthentication)

dishesRoutes.post("/", dishesController.create);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", dishesController.delete);
dishesRoutes.patch("/:id", dishesController.update);
dishesRoutes.get("/", dishesController.index);

module.exports = dishesRoutes;