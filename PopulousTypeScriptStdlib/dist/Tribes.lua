local ____lualib = require("lualib_bundle")
local __TS__ObjectValues = ____lualib.__TS__ObjectValues
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local TribePool, TribeName
local ____AI = require("AI")
local AI = ____AI.AI
local ____Buildings = require("Buildings")
local Building = ____Buildings.Building
local ____GameTime = require("GameTime")
local Time = ____GameTime.Time
local ____Location = require("Location")
local Location = ____Location.Location
local ____Persons = require("Persons")
local Person = ____Persons.Person
local Shaman = ____Persons.Shaman
require("PopModules")
local ____Spells = require("Spells")
local Spell = ____Spells.Spell
local TribeInternal = {}
do
    local function preparePool(data)
        local pool = {}
        for ____, value in ipairs(__TS__ObjectValues(data)) do
            pool[value.model] = value
        end
        return pool
    end
    local function _makeElementPool(data, pool)
        local obj = data
        for ____, value in ipairs(__TS__ObjectValues(data)) do
            pool[value.model] = value
        end
        obj.get = function(self, model)
            return pool[model]
        end
        obj.forEach = function(self, action)
            for ____, elem in ipairs(__TS__ObjectValues(pool)) do
                action(elem)
            end
        end
        obj.forSome = function(self, models, action)
            for ____, model in ipairs(models) do
                if type(model) == "number" then
                    local elem = pool[model]
                    if elem ~= nil then
                        action(elem)
                    end
                else
                    action(model)
                end
            end
        end
        return obj
    end
    function TribeInternal.makeElementPool(data)
        local pool = preparePool(data)
        return _makeElementPool(data, pool)
    end
    function TribeInternal.makeSpellOrBuildingPool(data, imposed)
        local pool = preparePool(data)
        local obj = _makeElementPool(data, pool)
        obj.enableAll = function(self)
            self:forEach(function(elem)
                elem.isEnabled = true
                return true
            end)
        end
        obj.enableSome = function(self, models)
            self:forSome(
                models,
                function(elem)
                    elem.isEnabled = true
                    return true
                end
            )
        end
        obj.disableAll = function(self)
            self:forEach(function(elem)
                elem.isEnabled = false
                return false
            end)
        end
        obj.disableSome = function(self, models)
            self:forSome(
                models,
                function(elem)
                    elem.isEnabled = false
                    return false
                end
            )
        end
        local imposedSet = {}
        obj.markAsImposed = function(self, modelOrElem)
            local elem = type(modelOrElem) == "number" and pool[modelOrElem] or modelOrElem
            if imposedSet[elem.model] ~= nil then
                return
            end
            imposedSet[elem.model] = elem
            imposed[#imposed + 1] = elem
        end
        return obj
    end
end
____exports.Tribe = __TS__Class()
local Tribe = ____exports.Tribe
Tribe.name = "Tribe"
function Tribe.prototype.____constructor(self, id)
    self.id = id
    self.player = getPlayer(id)
    self.ai = __TS__New(AI, id)
    self._imposedSpells = {}
    self._imposedBuildings = {}
    self.spells = TribeInternal.makeSpellOrBuildingPool(
        {
            burn = __TS__New(Spell, id, 1),
            blast = __TS__New(Spell, id, 2),
            lightningBolt = __TS__New(Spell, id, 3),
            tornado = __TS__New(Spell, id, 4),
            swarm = __TS__New(Spell, id, 5),
            invisibility = __TS__New(Spell, id, 6),
            hypnotism = __TS__New(Spell, id, 7),
            firestorm = __TS__New(Spell, id, 8),
            ghostArmy = __TS__New(Spell, id, 9),
            erosion = __TS__New(Spell, id, 10),
            swamp = __TS__New(Spell, id, 11),
            landBridge = __TS__New(Spell, id, 12),
            angelOfDeath = __TS__New(Spell, id, 13),
            earthquake = __TS__New(Spell, id, 14),
            flatten = __TS__New(Spell, id, 15),
            volcano = __TS__New(Spell, id, 16),
            conversion = __TS__New(Spell, id, 17),
            armageddon = __TS__New(Spell, id, 18),
            shield = __TS__New(Spell, id, 19),
            bloodlust = __TS__New(Spell, id, 20),
            teleport = __TS__New(Spell, id, 21),
            hill = __TS__New(Spell, id, 23),
            rise = __TS__New(Spell, id, 24),
            valley = __TS__New(Spell, id, 25),
            dip = __TS__New(Spell, id, 26),
            placeTree = __TS__New(Spell, id, 27),
            clearMapWho = __TS__New(Spell, id, 28),
            placeShaman = __TS__New(Spell, id, 29),
            placeWild = __TS__New(Spell, id, 30)
        },
        self._imposedSpells
    )
    self.buildings = TribeInternal.makeSpellOrBuildingPool(
        {
            smallHut = __TS__New(Building, id, 1),
            hut = __TS__New(Building, id, 2),
            largeHut = __TS__New(Building, id, 3),
            drumTower = __TS__New(Building, id, 4),
            temple = __TS__New(Building, id, 5),
            spyTrain = __TS__New(Building, id, 6),
            warriorTrain = __TS__New(Building, id, 7),
            superWarriorTrain = __TS__New(Building, id, 8),
            reconversion = __TS__New(Building, id, 9),
            wallPiece = __TS__New(Building, id, 10),
            gate = __TS__New(Building, id, 11),
            currOeSlot = __TS__New(Building, id, 12),
            boatHut = __TS__New(Building, id, 13),
            alternativeBoatHut = __TS__New(Building, id, 14),
            airshipHut = __TS__New(Building, id, 15),
            alternativeAirshipHut = __TS__New(Building, id, 16),
            guardPost = __TS__New(Building, id, 17),
            library = __TS__New(Building, id, 18),
            prision = __TS__New(Building, id, 19)
        },
        self._imposedBuildings
    )
    self.persons = TribeInternal.makeElementPool({
        wild = __TS__New(Person, id, 1),
        brave = __TS__New(Person, id, 2),
        warrior = __TS__New(Person, id, 3),
        preacher = __TS__New(Person, id, 4),
        spy = __TS__New(Person, id, 5),
        superWarrior = __TS__New(Person, id, 6),
        shaman = __TS__New(Shaman, id),
        angelOfDeath = __TS__New(Person, id, 8)
    })
    self.shaman = self.persons.shaman
end
function Tribe.of(tribe)
    return type(tribe) == "number" and (TribePool[tribe] or ____exports.Tribe.Neutral) or tribe
end
function Tribe.asID(tribe)
    return type(tribe) == "number" and tribe or tribe.id
end
function Tribe.prototype.giveMana(self, amount)
    local ____self_player_0, ____Mana_1 = self.player, "Mana"
    ____self_player_0[____Mana_1] = ____self_player_0[____Mana_1] + math.max(0, amount)
end
function Tribe.prototype.takeMana(self, amount)
    local ____self_player_2, ____Mana_3 = self.player, "Mana"
    ____self_player_2[____Mana_3] = ____self_player_2[____Mana_3] - math.max(0, amount)
end
function Tribe.prototype.cameraRotation(self, angle)
    CAMERA_ROTATION(self.id, angle)
end
function Tribe.prototype.getKilledPeople(self, targetTribe)
    return self.player.PeopleKilled[____exports.Tribe.asID(targetTribe)]
end
function Tribe.prototype.transferTribeToAnotherPlayer(self, targetTribe)
    transfer_tribe_to_another_player(
        self.id,
        ____exports.Tribe.asID(targetTribe)
    )
end
function Tribe.prototype.isAlly(self, otherTribe)
    return are_players_allied(
        self.id,
        ____exports.Tribe.asID(otherTribe)
    )
end
function Tribe.prototype.isEnemy(self, otherTribe)
    return not are_players_allied(
        self.id,
        ____exports.Tribe.asID(otherTribe)
    )
end
function Tribe.prototype.setAlly(self, otherTribe, bidirectional)
    if bidirectional == nil then
        bidirectional = true
    end
    local tb = ____exports.Tribe.asID(otherTribe)
    set_players_allied(self.id, tb)
    if bidirectional then
        set_players_allied(tb, self.id)
    end
end
function Tribe.prototype.setEnemy(self, otherTribe, bidirectional)
    if bidirectional == nil then
        bidirectional = true
    end
    local tb = ____exports.Tribe.asID(otherTribe)
    set_players_enemies(self.id, tb)
    if bidirectional then
        set_players_enemies(tb, self.id)
    end
end
function Tribe.prototype.updateRemoveImposed(self)
    if Time.currentSeconds <= 32 then
        for ____, elem in ipairs(self._imposedSpells) do
            if elem.isEnabled then
                elem.isEnabled = false
            end
        end
        for ____, elem in ipairs(self._imposedBuildings) do
            if elem.isEnabled then
                elem.isEnabled = false
            end
        end
    end
end
Tribe.Neutral = __TS__New(____exports.Tribe, TRIBE_NEUTRAL)
Tribe.Blue = __TS__New(____exports.Tribe, TRIBE_BLUE)
Tribe.Red = __TS__New(____exports.Tribe, TRIBE_RED)
Tribe.Yellow = __TS__New(____exports.Tribe, TRIBE_YELLOW)
Tribe.Green = __TS__New(____exports.Tribe, TRIBE_GREEN)
Tribe.Cyan = __TS__New(____exports.Tribe, TRIBE_CYAN)
Tribe.Pink = __TS__New(____exports.Tribe, TRIBE_PINK)
Tribe.Black = __TS__New(____exports.Tribe, TRIBE_BLACK)
Tribe.Orange = __TS__New(____exports.Tribe, TRIBE_ORANGE)
Tribe.Hostbot = __TS__New(____exports.Tribe, TRIBE_HOSTBOT)
Tribe.ALL = {
    ____exports.Tribe.Neutral,
    ____exports.Tribe.Blue,
    ____exports.Tribe.Red,
    ____exports.Tribe.Yellow,
    ____exports.Tribe.Green,
    ____exports.Tribe.Cyan,
    ____exports.Tribe.Pink,
    ____exports.Tribe.Black,
    ____exports.Tribe.Orange,
    ____exports.Tribe.Hostbot
}
Tribe.COUNT = 10
__TS__SetDescriptor(
    Tribe.prototype,
    "name",
    {get = function(self)
        return TribeName[self.id]
    end},
    true
)
__TS__SetDescriptor(
    Tribe.prototype,
    "mana",
    {
        get = function(self)
            return self.player.Mana
        end,
        set = function(self, value)
            self.player.Mana = math.max(0, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Tribe.prototype,
    "numPeople",
    {get = function(self)
        return self.player.NumPeople
    end},
    true
)
__TS__SetDescriptor(
    Tribe.prototype,
    "numConvertedPeople",
    {get = function(self)
        return self.player.NumPeopleConverted
    end},
    true
)
__TS__SetDescriptor(
    Tribe.prototype,
    "numGhostPeople",
    {get = function(self)
        return self.player.NumGhostPeople
    end},
    true
)
__TS__SetDescriptor(
    Tribe.prototype,
    "numBuildings",
    {get = function(self)
        return self.player.NumBuildings
    end},
    true
)
__TS__SetDescriptor(
    Tribe.prototype,
    "numPartialBuilding",
    {get = function(self)
        return PARTIAL_BUILDING_COUNT(self.id)
    end},
    true
)
__TS__SetDescriptor(
    Tribe.prototype,
    "numBoats",
    {get = function(self)
        return self.player.NumVehiclesOfType[1]
    end},
    true
)
__TS__SetDescriptor(
    Tribe.prototype,
    "numBalloons",
    {get = function(self)
        return self.player.NumVehiclesOfType[3]
    end},
    true
)
__TS__SetDescriptor(
    Tribe.prototype,
    "numTepeesInAnyLevel",
    {get = function(self)
        local buildings = self.buildings
        return buildings.smallHut.numInWorld + buildings.hut.numInWorld + buildings.largeHut.numInWorld
    end},
    true
)
__TS__SetDescriptor(
    Tribe.prototype,
    "reincSiteLocation",
    {get = function(self)
        return Location.make3D(self.player.ReincarnSiteCoord)
    end},
    true
)
__TS__SetDescriptor(
    Tribe.prototype,
    "isReincEnabled",
    {get = function(self)
        return self.ai.isReincEnabled
    end},
    true
)
__TS__SetDescriptor(
    Tribe.prototype,
    "reinc",
    {
        get = function(self)
            return self.ai.reinc
        end,
        set = function(self, value)
            self.ai.reinc = value
        end
    },
    true
)
__TS__SetDescriptor(
    Tribe.prototype,
    "isInEncyc",
    {get = function(self)
        return HAS_PLAYER_BEEN_IN_ENCYC(self.id) ~= 0
    end},
    true
)
__TS__SetDescriptor(
    Tribe.prototype,
    "deadCount",
    {get = function(self)
        return self.player.DeadCount
    end},
    true
)
TribePool = {
    [TRIBE_NEUTRAL] = ____exports.Tribe.Neutral,
    [TRIBE_BLUE] = ____exports.Tribe.Blue,
    [TRIBE_RED] = ____exports.Tribe.Red,
    [TRIBE_YELLOW] = ____exports.Tribe.Yellow,
    [TRIBE_GREEN] = ____exports.Tribe.Green,
    [TRIBE_CYAN] = ____exports.Tribe.Cyan,
    [TRIBE_PINK] = ____exports.Tribe.Pink,
    [TRIBE_BLACK] = ____exports.Tribe.Black,
    [TRIBE_ORANGE] = ____exports.Tribe.Orange,
    [TRIBE_HOSTBOT] = ____exports.Tribe.Hostbot
}
TribeName = {
    [TRIBE_NEUTRAL] = "Neutral",
    [TRIBE_BLUE] = "Blue",
    [TRIBE_RED] = "Red",
    [TRIBE_YELLOW] = "Yellow",
    [TRIBE_GREEN] = "Green",
    [TRIBE_CYAN] = "Cyan",
    [TRIBE_PINK] = "Pink",
    [TRIBE_BLACK] = "Black",
    [TRIBE_ORANGE] = "Orange",
    [TRIBE_HOSTBOT] = "Hostbot"
}
return ____exports
