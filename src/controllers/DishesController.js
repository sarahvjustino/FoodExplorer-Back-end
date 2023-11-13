const knex = require('../database/knex');

class DishesController {
    async create(request, response) {
        const { name, description, category, price, ingredients } = request.body;
        const { user_id } = request.params;

        const [dish_id] = await knex("dishes").insert({
            name,
            description,
            category,
            price,
            user_id
        });

        const ingredientsInsert = ingredients.map(ingredient => {
            return {
                dish_id,
                user_id,
                name: ingredient
            }
        });

        await knex("ingredients").insert(ingredientsInsert);

        return response.json();
    }

    async show(request, response) {
        const { id } = request.params;

        const dish = await knex("dishes").where({ id }).first();
        const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

        return response.json({ ...dish, ingredients });

    }

    // async update(request, response) { }
    async delete(request, response) {
        const { id } = request.params;

        await knex("dishes").where({ id }).delete();

        return response.json();
    }
    // async index(request, response) { }
}

module.exports = DishesController;