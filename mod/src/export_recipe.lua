-- Handles recipe data retrieval

local Recipe = {}

function Recipe.get_recipe_data()
    local recipe_data = {}
    for _, recipe in pairs(game.recipe_prototypes) do
        recipe_data[recipe.name] = {
            ingredients = recipe.ingredients,
            products = recipe.products,
            energy = recipe.energy,
            nodetype = "recipe"
        }
    end
    return recipe_data
end

return Recipe
