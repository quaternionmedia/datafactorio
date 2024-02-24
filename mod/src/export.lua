-- Import the required modules
local Inventory = require("export_inventory")
local Recipe = require("export_recipe")
local Entity = require("export_entity")
local Technology = require("export_technology")

-- Initialize the Export module
local Export = {}

-- Function to export data to a JSON file
-- @param data: The data to be exported
-- @param filename: The base name of the file to export to
function Export.export_data(data, filename)
    -- Create a unique filename using the game tick
    local unique_id = tostring(game.tick) .. "-" .. tostring(math.random(100000, 999999))
    -- Write the data to the file in JSON format
    game.write_file(unique_id .. filename .. ".json", game.table_to_json(data))
end

-- Refactored function to export all types of data into a single JSON object
function Export.export_all_data()
    -- Create a table to hold all data
    local all_data = {
        inventory = Inventory.get_player_inventory_contents(), -- Get the player's inventory contents
        recipes = Recipe.get_recipe_data(), -- Get the game's recipe data
        entities = Entity.get_entity_data(), -- Get the game's entity data
        technologies = Technology.get_technology_data() -- Get the game's technology data
    }
    
    -- Export all collected data as a single JSON object
    Export.export_data(all_data, "game_data_export")
end

-- Return the Export module
return Export





-- -- Import the required modules
-- local Inventory = require("export_inventory")
-- local Recipe = require("export_recipe")
-- local Entity = require("export_entity")
-- local Technology = require("export_technology")

-- -- Initialize the Export module
-- local Export = {}

-- -- Function to export data to a JSON file
-- -- @param data: The data to be exported
-- -- @param filename: The base name of the file to export to
-- function Export.export_data(data, filename)
--     -- Create a unique filename using the game tick
--     local unique_id = tostring(game.tick) .. "-" .. tostring(math.random(100000, 999999))
--     -- Write the data to the file in JSON format
--     game.write_file(unique_id .. filename .. ".json", game.table_to_json(data))
-- end

-- -- Function to export all types of data
-- function Export.export_all_data()
--     -- Export the player's inventory contents
--     Export.export_data(Inventory.get_player_inventory_contents(), "inventory")
--     -- Export the game's recipe data
--     Export.export_data(Recipe.get_recipe_data(), "recipes")
--     -- Export the game's entity data
--     Export.export_data(Entity.get_entity_data(), "entities")
--     -- Export the game's technology data
--     -- Export.export_data(Technology.get_technology_data(), "technologies")
-- end

-- -- Return the Export module
-- return Export