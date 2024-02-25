-- Handles inventory data retrieval

local Inventory = {}

function Inventory.get_player_inventory_contents()
    local inventory_contents = {} 
    local inventory = game.players[1].get_main_inventory()
    if inventory then
        for name, count in pairs(inventory.get_contents()) do
            inventory_contents[name] = count
        end
    end 
    return inventory_contents
end

return Inventory
