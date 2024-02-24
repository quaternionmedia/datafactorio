-- Import the required modules
local Inventory = require("export_inventory")
local Recipe = require("export_recipe")
local Entity = require("export_entity")
local Technology = require("export_technology")

-- Initialize the Export module
local Export = {}

function Export.export_selected_data(includeInventory, includeRecipes, includeEntities, includeTechnologies)
    local selected_data = {}
    str_name = "game_data_export"
    
    if includeInventory then
        selected_data.inventory = Inventory.get_player_inventory_contents()
        str_name = 'inventory_' .. str_name
    end
    if includeRecipes then
        selected_data.recipes = Recipe.get_recipe_data()
        str_name = 'recipes_' .. str_name
    end
    if includeEntities then
        selected_data.entities = Entity.get_entity_data()
        str_name = 'entities_' .. str_name
    end
    if includeTechnologies then
        selected_data.technologies = Technology.get_technology_data()
        str_name = 'technologies_' .. str_name
    end
    
    -- Export only the selected data as a single JSON object
    if next(selected_data) ~= nil then -- Check if selected_data is not empty
        Export.write_to_file(selected_data, str_name)
    end
end

function Export.write_to_file(data, filename)
    local unique_id = tostring(game.tick) .. "-" .. tostring(math.random(100000, 999999))
    game.write_file(unique_id .. filename .. ".json", game.table_to_json(data))
end

function Export.export_all_data()
    if game.players[1] and game.players[1].gui.screen.qmdf_main_frame then
        local gui = game.players[1].gui.screen.qmdf_main_frame.qmdf_checkbox_flow
        local includeInventory = gui.qmdf_inventory_checkbox.state
        local includeRecipes = gui.qmdf_recipes_checkbox.state
        local includeEntities = gui.qmdf_entities_checkbox.state
        local includeTechnologies = gui.qmdf_technologies_checkbox.state

        Export.export_selected_data(includeInventory, includeRecipes, includeEntities, includeTechnologies)
    end
end

return Export