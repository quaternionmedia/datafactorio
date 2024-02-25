-- Handles entity data retrieval

local Entity = {}

function Entity.get_entity_data()
    local entity_data = {}
    local entities = game.surfaces[1].find_entities({{-100000, -100000}, {100000, 100000}})
    for _, entity in pairs(entities) do
        entity_data[entity.name] = {
            position = {x = entity.position.x, y = entity.position.y},
            direction = entity.direction,
            type = entity.type,
            force = entity.force.name,
        }
    end
    return entity_data
end

return Entity
