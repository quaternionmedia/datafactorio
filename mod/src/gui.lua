local GUI = {}
local Export = require("export")

function GUI.add_export_button(event)
    local player = game.get_player(event.player_index)
    GUI.create_open_window_button(player)
end

function GUI.build_interface(player)
    player_global = global.players[player.index]
    local screen_element = player.gui.screen

    local main_frame = screen_element.add{type="frame", name="qmdf_main_frame", caption="qm Data Factory", direction="vertical"}
    player.opened = main_frame

    local controls_flow = main_frame.add{type="flow", name="qmdf_controls_flow", direction="horizontal"}

    controls_flow.add{type="button", name="qmdf_export_data", caption="Export Data"}
    controls_flow.add{type="button", name="qmdf_close_window", caption="Close"}

    player_global.controls_active = true
    player_global.elements = {main_frame = main_frame, controls_flow = controls_flow}

    -- Add checkboxes for each data type
    local checkbox_flow = main_frame.add{type="flow", name="qmdf_checkbox_flow", direction="vertical"}
    checkbox_flow.add{type="checkbox", name="qmdf_inventory_checkbox", caption="Export Inventory", state=true}
    checkbox_flow.add{type="checkbox", name="qmdf_recipes_checkbox", caption="Export Recipes", state=false}
    checkbox_flow.add{type="checkbox", name="qmdf_entities_checkbox", caption="Export Entities", state=true}
    checkbox_flow.add{type="checkbox", name="qmdf_technologies_checkbox", caption="Export Technologies", state=false}

end


function GUI.toggle_interface(player)
    local main_frame = player.gui.screen.qmdf_main_frame

    if main_frame == nil then
        GUI.build_interface(player)
    else
        main_frame.destroy()
        player_global.elements = {}
    end
end


function GUI.create_open_window_button(player)
    if player and player.valid then
        local flow
        if player.gui.top["qmdf_export_data"] then
            flow = player.gui.top["qmdf_export_data"]
        else
            flow = player.gui.top.add{type="flow", name="qmdf_export_data", direction="horizontal"}
        end

        -- Check if our button already exists to avoid duplicates
        -- if not flow["open_qmdf_export_data"] then
        --     flow.add{type="button", name="open_qmdf_export_data", caption="Open Data Export"}
        -- end
    end
end

function GUI.close_window(player, window_name)
    if player and player.valid then
        local screen_element = player.gui.screen
        if screen_element[window_name] then
            screen_element[window_name].destroy()
        end
    end
end

function GUI.handle_export_button_click(player)
    local screen_element = player.gui.screen.qmdf_main_frame
    if screen_element then
        local includeInventory = screen_element.qmdf_checkbox_flow.qmdf_inventory_checkbox.state
        local includeRecipes = screen_element.qmdf_checkbox_flow.qmdf_recipes_checkbox.state
        local includeEntities = screen_element.qmdf_checkbox_flow.qmdf_entities_checkbox.state
        local includeTechnologies = screen_element.qmdf_checkbox_flow.qmdf_technologies_checkbox.state
        
        Export.export_selected_data(includeInventory, includeRecipes, includeEntities, includeTechnologies)
    end
end


return GUI