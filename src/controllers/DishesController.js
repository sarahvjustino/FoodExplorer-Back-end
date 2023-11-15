const knex = require('../database/knex');
const AppError = require('../utils/AppError');

class DishesController {
    async create(request, response) {
        const { name, description, category, price, ingredients } = request.body;
        const user_id = request.user.id;

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

    async update(request, response) {
        const { name, ingredients, description, price, category } = request.body;
        const { id } = request.params;

        const dish = await knex("dishes").where({ id }).first();

        if (!dish) {
            throw new AppError("Não foi possível encontrar este prato");
        }

        const updateDish = {
            name: name ?? dish.name,
            description: description ?? dish.description,
            category: category ?? dish.category,
            price: price ?? dish.price,
            updated_at: knex.fn.now()
        };

        if (ingredients) {
            await knex("ingredients").where({ dish_id: id })

            const ingredientsInsert = ingredients.map(name => {
                return {
                    dish_id: id,
                    name,
                    user_id: dish.user_id
                }
            })
            await knex("ingredients").insert(ingredientsInsert);
        }

        await knex("dishes").where({ id }).update(updateDish);

        return response.json();
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("dishes").where({ id }).delete();

        return response.json();
    }

    async index(request, response) {
        const { name, ingredients } = request.query;

        const user_id = request.user.id

        let dishes;

        if (ingredients) {
            const filteredIngredients = ingredients.split(",").map(ingredient => ingredient.trim());

            dishes = await knex("dishes")
                .select([
                    "dishes.id",
                    "dishes.name",
                    "dishes.user_id"
                ])
                .where("dishes.user_id", user_id)
                .whereLike("dishes.name", `%${name}%`)
                .whereIn("name", filteredIngredients)
                .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
                .groupBy("dishes.id")
                .orderBy("dishes.name");
        } else {
            dishes = await knex("dishes").where({ user_id }).whereLike("name", `%${name}%`).orderBy("name");
        }

        const userIngredients = await knex("ingredients").where({ user_id })
        const dishWithIngredients = dishes.map(dish => {
            const dishIngredients = userIngredients.filter(ingredient => ingredient.dish_id === dish.id);

            return {
                ...dish,
                ingredients: dishIngredients,
            }
        })

        return response.json(dishWithIngredients);
    }
}

module.exports = DishesController;