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

    // async show(request, response) { }
    // async update(request, response) { }
    // async delete(request, response) { }
    // async index(request, response) { }
}

module.exports = DishesController;