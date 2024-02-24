-- Handles technology data retrieval

local Technology = {}

function Technology.get_technology_data()
    local tech_data = {}
    for name, technology in pairs(game.forces.player.technologies) do
        tech_data[name] = {
            name = technology.name,
            researched = technology.researched,
            level = technology.level,
            research_unit_count = technology.research_unit_count,
            research_unit_energy = technology.research_unit_energy,
            effects = technology.effects,
            prerequisites = technology.prerequisites,
            nodetype = "technology"
        }
    end
    return tech_data
end


return Technology
