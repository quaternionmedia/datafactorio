-- Handles technology data retrieval

local Technology = {}

function Technology.get_technology_data()
    local tech_data = {}
    for _, tech in pairs(game.technology_prototypes) do
        tech_data[tech.name] = { researched = tech.researched or false }
    end
    return tech_data
end

return Technology
