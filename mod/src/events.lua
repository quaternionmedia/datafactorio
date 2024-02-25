local GUI = require("gui")
local Export = require("export")

local function initialize_global(player)
    global.players[player.index] = { controls_active = true, elements = {} }
end

script.on_init(function()

    local freeplay = remote.interfaces["freeplay"]
    if freeplay then  -- Disable freeplay popup-message
        if freeplay["set_skip_intro"] then remote.call("freeplay", "set_skip_intro", true) end
        if freeplay["set_disable_crashsite"] then remote.call("freeplay", "set_disable_crashsite", true) end
    end

    global.players = {}

    for _, player in pairs(game.players) do
        initialize_global(player)
        GUI.build_interface(player)
    end
end)



-- When a player is created/joins
script.on_event(defines.events.on_player_created, function(event)
    local player = game.get_player(event.player_index)
    global.players[player.index] = { controls_active = true }
end)

script.on_event("qmdf_toggle_interface", function(event)
    local player = game.get_player(event.player_index)
    GUI.toggle_interface(player)
end)

script.on_event("qmdf_export_data", function(event)
    local player = game.get_player(event.player_index)
    Export.export_all_data()
end)

script.on_event(defines.events.on_gui_click, function(event)
    local player = game.get_player(event.player_index)
    local element = event.element

    if element.name == "qmdf_export_data" then
        Export.export_all_data()
    elseif element.name == "qmdf_close_window" then
        GUI.toggle_interface(player)
    end
end)


script.on_event(defines.events.on_gui_closed, function(event)
    if event.element and event.element.name == "qmdf_main_frame" then
        local player = game.get_player(event.player_index)
        GUI.toggle_interface(player)
    end
end)

script.on_configuration_changed(function(config_changed_data)
    if config_changed_data.mod_changes["qm-datafactorio"] then
        for _, player in pairs(game.players) do
            local main_frame = player.gui.screen.main_frame
            if main_frame ~= nil then GUI.toggle_interface(player) end
        end
    end
end)