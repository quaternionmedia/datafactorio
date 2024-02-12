local GUI = {}
local Export = require("export")

-- Function to add an export button to the GUI
function GUI.add_export_button(event)
    local player = game.get_player(event.player_index)
    if not player then return end  -- Safety check

    local anchor = {gui=defines.relative_gui_type.controller_gui, position=defines.relative_gui_position.top}
    
    -- Check if the frame already exists to avoid duplicates
    if player.gui.relative["export_frame"] then
        player.gui.relative["export_frame"].destroy()
    end

    local frame = player.gui.relative.add{type="frame", name="export_frame", anchor=anchor}
    frame.add{type="label", caption=player.name}

    -- Add an export button
    frame.add{type="button", name="qmdf_export_data", caption="Export"}
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
        if not flow["open_qmdf_export_data"] then
            flow.add{type="button", name="open_qmdf_export_data", caption="Open Data Export"}
        end
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

function GUI.handle_export_button_click(button_name, player)
    Export.export_all_data()
end

return GUI