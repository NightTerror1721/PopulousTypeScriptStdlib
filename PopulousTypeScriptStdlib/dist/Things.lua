--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
require("PopModules")
function ____exports.createBuilding(model, owner, location)
    return createThing(
        2,
        model,
        owner,
        location.coord3D,
        false,
        false
    )
end
function ____exports.createCreature(model, owner, location)
    return createThing(
        3,
        model,
        owner,
        location.coord3D,
        false,
        false
    )
end
function ____exports.createEffect(model, owner, location)
    return createThing(
        7,
        model,
        owner,
        location.coord3D,
        false,
        false
    )
end
function ____exports.createPerson(model, owner, location)
    return createThing(
        1,
        model,
        owner,
        location.coord3D,
        false,
        false
    )
end
function ____exports.createScenery(model, owner, location)
    return createThing(
        5,
        model,
        owner,
        location.coord3D,
        false,
        false
    )
end
function ____exports.createSpell(model, owner, location)
    return createThing(
        11,
        model,
        owner,
        location.coord3D,
        false,
        false
    )
end
function ____exports.createGeneral(model, owner, location)
    return createThing(
        6,
        model,
        owner,
        location.coord3D,
        false,
        false
    )
end
function ____exports.createShot(model, owner, location)
    return createThing(
        8,
        model,
        owner,
        location.coord3D,
        false,
        false
    )
end
function ____exports.createShape(model, owner, location)
    return createThing(
        9,
        model,
        owner,
        location.coord3D,
        false,
        false
    )
end
function ____exports.createInternal(model, owner, location)
    return createThing(
        10,
        model,
        owner,
        location.coord3D,
        false,
        false
    )
end
function ____exports.createVehicle(model, owner, location)
    return createThing(
        4,
        model,
        owner,
        location.coord3D,
        false,
        false
    )
end
return ____exports
