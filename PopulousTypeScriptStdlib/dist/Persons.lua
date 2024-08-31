local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
require("PopModules")
local ____Things = require("Things")
local createPerson = ____Things.createPerson
local ____Markers = require("Markers")
local Marker = ____Markers.Marker
local _gsi = gsi()
____exports.InternalPersonModel = {}
local InternalPersonModel = ____exports.InternalPersonModel
do
    local Mapper = {
        [0] = INT_NO_SPECIFIC_PERSON,
        [2] = INT_BRAVE,
        [3] = INT_WARRIOR,
        [4] = INT_RELIGIOUS,
        [5] = INT_SPY,
        [6] = INT_SUPER_WARRIOR,
        [7] = INT_MEDICINE_MAN
    }
    function InternalPersonModel.of(self, model)
        return model and Mapper[model] or nil
    end
end
local PersonOrders = {idle = {
    [19] = true,
    [37] = true,
    [20] = true,
    [14] = true,
    [11] = true,
    [12] = true,
    [17] = true
}, running = {[4] = true, [13] = true}, onHouse = {[21] = true}}
local ValidOrientations = {
    [1000] = 1000,
    [1250] = 1250,
    [1500] = 1500,
    [1750] = 1750,
    [0] = 0,
    [250] = 250,
    [500] = 500,
    [750] = 750
}
function ____exports.isValidPersonOrientation(self, orientation)
    return ValidOrientations[orientation] ~= nil
end
____exports.Person = __TS__Class()
local Person = ____exports.Person
Person.name = "Person"
function Person.prototype.____constructor(self, tribe, model)
    self.tribe = tribe
    self.model = model
    self._player = getPlayer(tribe)
end
function Person.prototype.forEachInWorld(self, action)
    ____exports.Person.forEachPerson(self.tribe, self.model, action)
end
function Person.prototype.createNewInWorld(self, location, orientation)
    local person = createPerson(self.model, self.tribe, location)
    if person ~= nil then
        if orientation and ____exports.isValidPersonOrientation(nil, orientation) then
            person.AngleXZ = orientation
        end
    end
    return person
end
function Person.forEachPerson(arg0, arg1, arg2)
    local tribe = type(arg0) == "number" and arg0 or nil
    local ____arg2_2
    if arg2 then
        ____arg2_2 = arg1
    else
        local ____arg1_1
        if arg1 then
            local ____tribe_0
            if tribe then
                ____tribe_0 = nil
            else
                ____tribe_0 = arg0
            end
            ____arg1_1 = ____tribe_0
        else
            ____arg1_1 = nil
        end
        ____arg2_2 = ____arg1_1
    end
    local models = ____arg2_2
    local action = arg2 and arg2 or (arg1 and arg1 or arg0)
    if type(models) == "number" then
        ProcessGlobalTypeList(
            1,
            function(person)
                if tribe and person.Owner ~= tribe or person.Model ~= models then
                    return true
                end
                local result = action(person)
                return result == nil or result ~= 0
            end
        )
    elseif models == nil or #models < 1 then
        ProcessGlobalTypeList(
            1,
            function(person)
                if tribe and person.Owner ~= tribe then
                    return true
                end
                local result = action(person)
                return result == nil or result ~= 0
            end
        )
    else
        ProcessGlobalTypeList(
            1,
            function(person)
                if tribe and person.Owner ~= tribe or not (models[person.Model] ~= nil) then
                    return true
                end
                local result = action(person)
                return result == nil or result ~= 0
            end
        )
    end
end
function Person.prototype.getListOrderedByIdleFirst(self, requiredPeople)
    local lists = {{}, {}, {}, {}}
    ProcessGlobalSpecialList(
        self.tribe,
        PEOPLELIST,
        function(person)
            if person.Model ~= self.model then
                return true
            end
            local state = person.State
            if PersonOrders.idle[state] ~= nil then
                local ____lists__1_3 = lists[1]
                ____lists__1_3[#____lists__1_3 + 1] = person
            elseif PersonOrders.running[state] ~= nil then
                local ____lists__2_4 = lists[2]
                ____lists__2_4[#____lists__2_4 + 1] = person
            elseif PersonOrders.onHouse[state] ~= nil then
                local ____lists__3_5 = lists[3]
                ____lists__3_5[#____lists__3_5 + 1] = person
            else
                local ____lists__4_6 = lists[4]
                ____lists__4_6[#____lists__4_6 + 1] = person
            end
            return #lists[1] < requiredPeople
        end
    )
    local result = lists[1]
    if #result >= requiredPeople then
        return {result, true}
    end
    do
        local i = 1
        while i < 4 do
            for ____, value in ipairs(lists[i + 1]) do
                result[#result + 1] = value
            end
            if #result >= requiredPeople then
                return {result, true}
            end
            i = i + 1
        end
    end
    return {result, false}
end
__TS__SetDescriptor(
    Person.prototype,
    "numInWorld",
    {get = function(self)
        return self._player.NumPeopleOfType[self.model]
    end},
    true
)
__TS__SetDescriptor(
    Person.prototype,
    "numInBoats",
    {get = function(self)
        return self._player.NumLocalPeopleInBoats[self.model]
    end},
    true
)
__TS__SetDescriptor(
    Person.prototype,
    "numInBalloons",
    {get = function(self)
        return self._player.NumLocalPeopleInBalloons[self.model]
    end},
    true
)
Person.Count = 8
____exports.Shaman = __TS__Class()
local Shaman = ____exports.Shaman
Shaman.name = "Shaman"
__TS__ClassExtends(Shaman, ____exports.Person)
function Shaman.prototype.____constructor(self, tribe)
    Shaman.____super.prototype.____constructor(self, tribe, 7)
end
function Shaman.prototype.clearShamanLeftClick(self)
    CLEAR_SHAMAN_LEFT_CLICK(self.tribe)
end
function Shaman.prototype.clearShamanRightClick(self)
    CLEAR_SHAMAN_RIGHT_CLICK(self.tribe)
end
function Shaman.prototype.trackToAngle(self, angle)
    TRACK_SHAMAN_TO_ANGLE(self.tribe, angle)
end
function Shaman.prototype.moveToMarker(self, marker)
    MOVE_SHAMAN_TO_MARKER(
        self.tribe,
        Marker:asId(marker)
    )
end
__TS__SetDescriptor(
    Shaman.prototype,
    "thing",
    {get = function(self)
        return getShaman(self.tribe)
    end},
    true
)
__TS__SetDescriptor(
    Shaman.prototype,
    "isAlive",
    {get = function(self)
        return self.thing ~= nil
    end},
    true
)
__TS__SetDescriptor(
    Shaman.prototype,
    "isSelected",
    {get = function(self)
        return IS_SHAMAN_SELECTED(self.tribe) ~= 0
    end},
    true
)
__TS__SetDescriptor(
    Shaman.prototype,
    "isShamanIconLeftClicked",
    {get = function(self)
        return IS_SHAMAN_ICON_LEFT_CLICKED(self.tribe) ~= 0
    end},
    true
)
__TS__SetDescriptor(
    Shaman.prototype,
    "isShamanIconRightClicked",
    {get = function(self)
        return IS_SHAMAN_ICON_RIGHT_CLICKED(self.tribe) ~= 0
    end},
    true
)
__TS__SetDescriptor(
    Shaman.prototype,
    "isAvailableForAttack",
    {get = function(self)
        return IS_SHAMAN_AVAILABLE_FOR_ATTACK(self.tribe) ~= 0
    end},
    true
)
return ____exports
