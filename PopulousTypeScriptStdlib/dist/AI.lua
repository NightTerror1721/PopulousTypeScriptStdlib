local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__InstanceOf = ____lualib.__TS__InstanceOf
local ____exports = {}
require("PopModules")
local ____Buildings = require("Buildings")
local InternalBuildingModel = ____Buildings.InternalBuildingModel
local ____IMath = require("IMath")
local IMath = ____IMath.IMath
local ____Markers = require("Markers")
local Marker = ____Markers.Marker
local ____Persons = require("Persons")
local InternalPersonModel = ____Persons.InternalPersonModel
local ____Spells = require("Spells")
local InternalSpellModel = ____Spells.InternalSpellModel
local Spell = ____Spells.Spell
local ____Location = require("Location")
local Location = ____Location.Location
local ____Map = require("Map")
local Map = ____Map.Map
local function selectInternalPersonOrBuildingModel(self, ____type, model)
    if ____type == nil or ____type == ATTACK_BUILDING then
        local result = InternalBuildingModel:of(model)
        return result and result or INT_NO_SPECIFIC_BUILDING
    else
        local result = InternalPersonModel:of(model)
        return result and result or INT_NO_SPECIFIC_PERSON
    end
end
local function selectInternalSpellModel(self, model)
    local result = InternalSpellModel:of(model)
    return result and result or INT_NO_SPECIFIC_SPELL
end
____exports.AI = __TS__Class()
local AI = ____exports.AI
AI.name = "AI"
function AI.prototype.____constructor(self, tribe)
    self.tribe = tribe
    self.attributes = __TS__New(____exports.AI.Attributes, tribe)
    self.states = __TS__New(____exports.AI.States, tribe)
    self._player = getPlayer(tribe)
    self._cache = {}
end
function AI.prototype.resetBaseMarker(self)
    RESET_BASE_MARKER(self.tribe)
end
function AI.prototype.setBaseMarker(self, marker)
    SET_BASE_MARKER(
        self.tribe,
        Marker:asId(marker)
    )
end
function AI.prototype.isShamanInArea(self, marker, radius)
    return IS_SHAMAN_IN_AREA(
        self.tribe,
        Marker:asId(marker),
        radius
    ) ~= 0
end
function AI.prototype.deselectAllPeople(self)
    DESELECT_ALL_PEOPLE(self.tribe)
end
function AI.prototype.startReincNow(self)
    START_REINC_NOW(self.tribe)
end
function AI.prototype.attack(self, targetTribeOrParams, people, targetType, damage, targetModel, spell1, spell2, spell3, attackType, lookAfter, marker1, marker2, direction)
    if type(targetTribeOrParams) == "number" then
        return ATTACK(
            self.tribe,
            targetTribeOrParams,
            people and people or 1,
            targetType and targetType or ATTACK_BUILDING,
            selectInternalPersonOrBuildingModel(nil, targetType, targetModel),
            damage and damage or 1,
            selectInternalSpellModel(nil, spell1),
            selectInternalSpellModel(nil, spell2),
            selectInternalSpellModel(nil, spell3),
            attackType and attackType or ATTACK_NORMAL,
            lookAfter and lookAfter or 0,
            Marker:asId(Marker:validOrDefault(marker1)),
            Marker:asId(Marker:validOrDefault(marker2)),
            direction and direction or -1
        ) ~= 0
    end
    return ATTACK(
        self.tribe,
        targetTribeOrParams.targetTribe,
        targetTribeOrParams.people,
        targetTribeOrParams.targetType,
        selectInternalPersonOrBuildingModel(nil, targetTribeOrParams.targetType, targetTribeOrParams.targetModel),
        targetTribeOrParams.damage,
        selectInternalSpellModel(nil, targetTribeOrParams.spell1),
        selectInternalSpellModel(nil, targetTribeOrParams.spell2),
        selectInternalSpellModel(nil, targetTribeOrParams.spell3),
        targetTribeOrParams.attackType and targetTribeOrParams.attackType or ATTACK_NORMAL,
        targetTribeOrParams.lookAfter and targetTribeOrParams.lookAfter or 0,
        Marker:asId(targetTribeOrParams.marker1 and targetTribeOrParams.marker1 or -1),
        Marker:asId(targetTribeOrParams.marker2 and targetTribeOrParams.marker2 or -1),
        targetTribeOrParams.direction and targetTribeOrParams.direction or -1
    ) ~= 0
end
function AI.prototype.setMarkerEntry(self, entry, marker1, marker2, numBraves, numWarriors, numSuperWarriors, numPreachers)
    if type(entry) == "number" then
        SET_MARKER_ENTRY(
            self.tribe,
            IMath.imax(0, entry),
            Marker:asId(Marker:validOrDefault(marker1, Marker.MK0)),
            Marker:asId(Marker:validOrDefault(marker2)),
            numBraves and numBraves or 0,
            numWarriors and numWarriors or 0,
            numSuperWarriors and numSuperWarriors or 0,
            numPreachers and numPreachers or 0
        )
        return
    end
    SET_MARKER_ENTRY(
        self.tribe,
        IMath.imax(0, entry.entry),
        Marker:asId(Marker:validOrDefault(entry.marker1, Marker.MK0)),
        Marker:asId(Marker:validOrDefault(entry.marker2)),
        entry.braves and entry.braves or 0,
        entry.warriors and entry.warriors or 0,
        entry.superWarriors and entry.superWarriors or 0,
        entry.preachers and entry.preachers or 0
    )
end
function AI.prototype.executeMarkerEntries(self, entry, entry2, entry3, entry4)
    if type(entry) == "number" then
        MARKER_ENTRIES(
            self.tribe,
            entry,
            entry2 and entry2 or -1,
            entry3 and entry3 or -1,
            entry4 and entry4 or -1
        )
        return
    end
    if #entry < 1 then
        return
    end
    local len = #entry
    do
        local i = 0
        while i < len do
            MARKER_ENTRIES(
                self.tribe,
                entry[i + 1],
                i + 1 < len and entry[i + 1 + 1] or -1,
                i + 2 < len and entry[i + 2 + 1] or -1,
                i + 3 < len and entry[i + 3 + 1] or -1
            )
            i = i + 4
        end
    end
end
function AI.prototype.callToArms(self)
    CALL_TO_ARMS(self.tribe)
end
function AI.prototype.marvellousHouseDeath(self)
    MARVELLOUS_HOUSE_DEATH(self.tribe)
end
function AI.prototype.setExtraWoodCollectionRadii(self, min, max, xOrLoc, zOrUndef)
    local x
    local z
    if type(xOrLoc) == "number" then
        x = xOrLoc
        z = zOrUndef
    else
        x, z = Map.getCellComponentsFromLocation(xOrLoc)
    end
    SET_WOOD_COLLECTION_RADII(
        self.tribe,
        min,
        max,
        x,
        z
    )
end
function AI.prototype.setBucketCountForSpell(self, spell, multiplier)
    SET_BUCKET_COUNT_FOR_SPELL(
        self.tribe,
        selectInternalSpellModel(nil, spell),
        multiplier
    )
end
function AI.prototype.clearHouseInfoFlag(self)
    CLEAR_HOUSE_INFO_FLAG(self.tribe)
end
function AI.prototype.sendPeopleToMarker(self, marker)
    SEND_PEOPLE_TO_MARKER(
        self.tribe,
        Marker:asId(marker)
    )
end
function AI.prototype.trackShamanExtraBollocks(self, angle)
    TRACK_SHAMAN_EXTRA_BOLLOCKS(self.tribe, angle)
end
function AI.prototype.navCheck(self, tribeTarget, targetType, targetModel, remember)
    return NAV_CHECK(
        self.tribe,
        tribeTarget,
        targetType,
        selectInternalPersonOrBuildingModel(nil, targetType, targetModel),
        remember and remember or 0
    ) ~= 0
end
function AI.prototype.clearGuardingFrom(self, entry, entry2, entry3, entry4)
    if type(entry) == "number" then
        CLEAR_GUARDING_FROM(
            self.tribe,
            entry,
            entry2 and entry2 or -1,
            entry3 and entry3 or -1,
            entry4 and entry4 or -1
        )
        return
    end
    if #entry < 1 then
        return
    end
    local len = #entry
    do
        local i = 0
        while i < len do
            CLEAR_GUARDING_FROM(
                self.tribe,
                entry[i + 1],
                i + 1 < len and entry[i + 1 + 1] or -1,
                i + 2 < len and entry[i + 2 + 1] or -1,
                i + 3 < len and entry[i + 3 + 1] or -1
            )
            i = i + 4
        end
    end
end
function AI.prototype.defendShamen(self, numPeople)
    if numPeople > 0 then
        DEFEND_SHAMEN(self.tribe, numPeople)
    end
end
function AI.prototype.sendShamenDefendersHome(self)
    SEND_SHAMEN_DEFENDERS_HOME(self.tribe)
end
function AI.prototype.executeBoardPatrol(self, vehicleType, numPeople, marker1, marker2, marker3, marker4)
    BOAT_PATROL(
        self.tribe,
        numPeople,
        Marker:asId(marker1),
        Marker:asId(Marker:validOrDefault(marker2)),
        Marker:asId(Marker:validOrDefault(marker3)),
        Marker:asId(Marker:validOrDefault(marker4)),
        vehicleType
    )
end
function AI.prototype.prayAtHead(self, numPeople, marker)
    if numPeople < 0 or not Marker:of(marker).isInvalid then
        return
    end
    PRAY_AT_HEAD(
        self.tribe,
        numPeople,
        Marker:asId(marker)
    )
end
function AI.prototype.populateDrumTower(self, model, xOrLoc, zOrUndef)
    if type(xOrLoc) == "number" then
        PUT_PERSON_IN_DT(self.tribe, model, xOrLoc, zOrUndef)
    else
        local x, z = Map.getCellComponentsFromLocation(xOrLoc)
        PUT_PERSON_IN_DT(self.tribe, model, x, z)
    end
end
function AI.prototype.getNumPeopleInMarker(self, targetTribe, marker, radius)
    return COUNT_PEOPLE_IN_MARKER(
        self.tribe,
        targetTribe,
        Marker:asId(marker),
        IMath.imax(0, radius)
    )
end
function AI.prototype.convertAtMarker(self, marker)
    CONVERT_AT_MARKER(
        self.tribe,
        Marker:asId(marker)
    )
end
function AI.prototype.preachAtMarker(self, marker)
    PREACH_AT_MARKER(
        self.tribe,
        Marker:asId(marker)
    )
end
function AI.prototype.sendAllPeopleToMarker(self, marker)
    SEND_ALL_PEOPLE_TO_MARKER(
        self.tribe,
        Marker:asId(marker)
    )
end
function AI.prototype.setGuardBetweenMarkers(self, marker1, marker2, braves, warriors, superWarriors, preachers, useGhosts)
    if braves == nil then
        braves = 0
    end
    if warriors == nil then
        warriors = 0
    end
    if superWarriors == nil then
        superWarriors = 0
    end
    if preachers == nil then
        preachers = 0
    end
    if useGhosts == nil then
        useGhosts = false
    end
    local ____type = useGhosts and GUARD_WITH_GHOSTS or GUARD_NORMAL
    GUARD_BETWEEN_MARKERS(
        self.tribe,
        Marker:asId(marker1),
        Marker:asId(marker2),
        IMath.imax(0, braves),
        IMath.imax(0, warriors),
        IMath.imax(0, superWarriors),
        IMath.imax(0, preachers),
        ____type
    )
end
function AI.prototype.buildDrumTower(self, xOrLoc, zOrUndef)
    if type(xOrLoc) == "number" then
        BUILD_DRUM_TOWER(self.tribe, xOrLoc, zOrUndef)
    else
        local x, z = Map.getCellComponentsFromLocation(xOrLoc)
        BUILD_DRUM_TOWER(self.tribe, x, z)
    end
end
function AI.prototype.sendGhostPeople(self, num)
    SEND_GHOST_PEOPLE(self.tribe, num)
end
function AI.prototype.updateBuckets(self, deltaTime, evertTurns, maxPeopleWithTurbo)
    if evertTurns == nil then
        evertTurns = 256
    end
    if maxPeopleWithTurbo == nil then
        maxPeopleWithTurbo = 79
    end
    deltaTime:everyTurns(
        evertTurns,
        0,
        function()
            self.bucketUsage = true
            if self._player.NumPeople <= maxPeopleWithTurbo then
                self:setBucketCountForSpell(2, 8)
                self:setBucketCountForSpell(17, 8)
                self:setBucketCountForSpell(5, 32)
                self:setBucketCountForSpell(6, 40)
                self:setBucketCountForSpell(19, 48)
                self:setBucketCountForSpell(12, 66)
                self:setBucketCountForSpell(3, 64)
                self:setBucketCountForSpell(7, 70)
                self:setBucketCountForSpell(4, 72)
                self:setBucketCountForSpell(11, 80)
                self:setBucketCountForSpell(15, 100)
                self:setBucketCountForSpell(14, 140)
                self:setBucketCountForSpell(10, 168)
                self:setBucketCountForSpell(8, 320)
                self:setBucketCountForSpell(13, 408)
                self:setBucketCountForSpell(16, 640)
            else
                self:setBucketCountForSpell(2, 4)
                self:setBucketCountForSpell(17, 4)
                self:setBucketCountForSpell(5, 16)
                self:setBucketCountForSpell(6, 20)
                self:setBucketCountForSpell(19, 24)
                self:setBucketCountForSpell(12, 33)
                self:setBucketCountForSpell(3, 32)
                self:setBucketCountForSpell(7, 35)
                self:setBucketCountForSpell(4, 36)
                self:setBucketCountForSpell(11, 40)
                self:setBucketCountForSpell(15, 50)
                self:setBucketCountForSpell(14, 70)
                self:setBucketCountForSpell(10, 84)
                self:setBucketCountForSpell(8, 160)
                self:setBucketCountForSpell(13, 204)
                self:setBucketCountForSpell(16, 320)
            end
        end
    )
end
function AI.prototype.initComputer(self)
    computer_init_player(self._player)
end
function AI.prototype.setComputerBaseLocation(self, xOrLoc, zOrUndef)
    if type(xOrLoc) == "number" then
        computer_set_base_pos(self._player, xOrLoc, zOrUndef)
    else
        local x, z = Map.getCellComponentsFromLocation(xOrLoc)
        computer_set_base_pos(self._player, x, z)
    end
end
function AI.prototype.setInitialCommand(self)
    set_players_shaman_initial_command(self._player)
end
function AI.prototype.destroyReinc(self)
    destroy_reinc(self._player)
end
function AI.prototype.setSpellEntry(self, entry, spell, minMana, frequency, minPeople, baseSpell)
    local model = type(spell) == "number" and spell or spell.model
    if baseSpell == nil then
        local spellCost = Spell.getCost(model)
        SET_SPELL_ENTRY(
            self.tribe,
            entry,
            model,
            spellCost,
            minMana,
            frequency,
            minPeople and 1 or 0
        )
    else
        SET_SPELL_ENTRY(
            self.tribe,
            entry,
            model,
            minMana,
            frequency,
            minPeople,
            baseSpell and 1 or 0
        )
    end
end
__TS__SetDescriptor(
    AI.prototype,
    "numPeopleBeingPreached",
    {get = function(self)
        return GET_NUM_PEOPLE_BEING_PREACHED(self.tribe)
    end},
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "giveUpAndSulk",
    {
        get = function(self)
            return self._cache.giveUpAndSulk == true
        end,
        set = function(self, value)
            GIVE_UP_AND_SULK(self.tribe, value and 1 or 0)
            self._cache.giveUpAndSulk = value
        end
    },
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "delayMainDrumTower",
    {
        get = function(self)
            return self._cache.delayMainDrumTower == true
        end,
        set = function(self, value)
            DELAY_MAIN_DRUM_TOWER(value and 1 or 0, self.tribe)
            self._cache.delayMainDrumTower = value
        end
    },
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "numPeopleInHouses",
    {get = function(self)
        return COUNT_PEOPLE_IN_HOUSES(self.tribe)
    end},
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "attackVariable",
    {
        get = function(self)
            local ____self__cache_attackVariable_0 = self._cache.attackVariable
            if ____self__cache_attackVariable_0 == nil then
                ____self__cache_attackVariable_0 = 0
            end
            return ____self__cache_attackVariable_0
        end,
        set = function(self, value)
            SET_ATTACK_VARIABLE(self.tribe, value)
            self._cache.attackVariable = value
        end
    },
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "defenseRadius",
    {
        get = function(self)
            local ____self__cache_defenseRadius_1 = self._cache.defenseRadius
            if ____self__cache_defenseRadius_1 == nil then
                ____self__cache_defenseRadius_1 = 0
            end
            return ____self__cache_defenseRadius_1
        end,
        set = function(self, value)
            SET_DEFENCE_RADIUS(self.tribe, value)
            self._cache.defenseRadius = value
        end
    },
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "isReincEnabled",
    {get = function(self)
        local ____self__cache_reinc_2 = self._cache.reinc
        if ____self__cache_reinc_2 == nil then
            ____self__cache_reinc_2 = true
        end
        return ____self__cache_reinc_2
    end},
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "reinc",
    {
        get = function(self)
            local ____self__cache_reinc_3 = self._cache.reinc
            if ____self__cache_reinc_3 == nil then
                ____self__cache_reinc_3 = true
            end
            return ____self__cache_reinc_3
        end,
        set = function(self, value)
            SET_REINCARNATION(value and 1 or 0, self.tribe)
            self._cache.reinc = value
        end
    },
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "isBucketUsageEnabled",
    {get = function(self)
        return self._cache.bucketUsage == true
    end},
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "bucketUsage",
    {
        get = function(self)
            return self._cache.bucketUsage == true
        end,
        set = function(self, value)
            SET_BUCKET_USAGE(self.tribe, value and 1 or 0)
            self._cache.bucketUsage = value
        end
    },
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "isExtraGoodCollectionEnabled",
    {get = function(self)
        return self._cache.isExtraGoodCollectionEnabled == true
    end},
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "extraGoodCollection",
    {
        get = function(self)
            return self._cache.extraGoodCollection == true
        end,
        set = function(self, value)
            EXTRA_WOOD_COLLECTION(value and 1 or 0, self.tribe)
            self._cache.extraGoodCollection = value
        end
    },
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "countWithBuildCommand",
    {get = function(self)
        return COUNT_WITH_BUILD_COMMAND(self.tribe)
    end},
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "shapesCount",
    {get = function(self)
        return COUNT_SHAPES(self.tribe)
    end},
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "isOnlyStandAtMarkersEnabled",
    {get = function(self)
        return self._cache.isOnlyStandAtMarkersEnabled == true
    end},
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "onlyStandAtMarkers",
    {
        get = function(self)
            return self._cache.onlyStandAtMarkers == true
        end,
        set = function(self, value)
            if value then
                ONLY_STAND_AT_MARKERS(self.tribe)
            else
                CLEAR_STANDING_PEOPLE(self.tribe)
            end
            self._cache.onlyStandAtMarkers = value
        end
    },
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "buildingDirection",
    {
        get = function(self)
            local ____self__cache_buildingDirection_4 = self._cache.buildingDirection
            if ____self__cache_buildingDirection_4 == nil then
                ____self__cache_buildingDirection_4 = -1
            end
            return ____self__cache_buildingDirection_4
        end,
        set = function(self, value)
            if value then
                SET_BUILDING_DIRECTION(self.tribe, value)
            else
                SET_BUILDING_DIRECTION(self.tribe, -1)
            end
            self._cache.buildingDirection = value
        end
    },
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "baseRadius",
    {
        get = function(self)
            local ____self__cache_baseRadius_5 = self._cache.baseRadius
            if ____self__cache_baseRadius_5 == nil then
                ____self__cache_baseRadius_5 = 0
            end
            return ____self__cache_baseRadius_5
        end,
        set = function(self, value)
            SET_BASE_RADIUS(
                self.tribe,
                IMath.imax(0, value)
            )
            self._cache.baseRadius = IMath.imax(0, value)
        end
    },
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "mainDrumTowerLocation",
    {
        get = function(self)
            local ____opt_6 = self._cache.mainDrumTowerLocation
            if ____opt_6 ~= nil then
                ____opt_6 = ____opt_6:copy()
            end
            local ____opt_6_8 = ____opt_6
            if ____opt_6_8 == nil then
                ____opt_6_8 = Location.make2D()
            end
            return ____opt_6_8
        end,
        set = function(self, value)
            if __TS__InstanceOf(value, Location) then
                local x, z = Map.getCellComponentsFromLocation(value)
                SET_DRUM_TOWER_POS(self.tribe, x, z)
                self._cache.mainDrumTowerLocation = value:copy()
            elseif Marker:isMarker(value) then
                local x, z = table.unpack(value.mapCoords)
                SET_DRUM_TOWER_POS(self.tribe, x, z)
                self._cache.mainDrumTowerLocation = Location.make2D(x, z)
            else
                SET_DRUM_TOWER_POS(self.tribe, value[1], value[2])
                self._cache.mainDrumTowerLocation = Location.make2D(value[1], value[2])
            end
        end
    },
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "hasHouseInfoBeenShown",
    {get = function(self)
        return HAS_HOUSE_INFO_BEEN_SHOWN(self.tribe) ~= 0
    end},
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "targetDrumTowers",
    {
        get = function(self)
            return self._cache.targetDrumTowers == true
        end,
        set = function(self, value)
            if value then
                TARGET_DRUM_TOWERS(self.tribe)
            else
                DONT_TARGET_DRUM_TOWERS(self.tribe)
            end
            self._cache.targetDrumTowers = value
        end
    },
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "targetSuperWarriors",
    {
        get = function(self)
            return self._cache.targetSuperWarriors == true
        end,
        set = function(self, value)
            if value then
                TARGET_S_WARRIORS(self.tribe)
            else
                DONT_TARGET_S_WARRIORS(self.tribe)
            end
            self._cache.targetSuperWarriors = value
        end
    },
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "freeEntries",
    {get = function(self)
        return FREE_ENTRIES(self.tribe)
    end},
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "numShamenDefenders",
    {get = function(self)
        return NUM_SHAMEN_DEFENDERS(self.tribe)
    end},
    true
)
__TS__SetDescriptor(
    AI.prototype,
    "shamanDefendBaseLocation",
    {
        get = function(self)
            local ____opt_9 = self._cache.shamanDefendBaseLocation
            if ____opt_9 ~= nil then
                ____opt_9 = ____opt_9:copy()
            end
            local ____opt_9_11 = ____opt_9
            if ____opt_9_11 == nil then
                ____opt_9_11 = Location.make2D()
            end
            return ____opt_9_11
        end,
        set = function(self, value)
            if value == nil then
                SHAMAN_DEFEND(self.tribe, 0, 0, 0)
            elseif __TS__InstanceOf(value, Location) then
                local x, z = Map.getCellComponentsFromLocation(value)
                SHAMAN_DEFEND(self.tribe, x, z, 1)
                self._cache.shamanDefendBaseLocation = value:copy()
            elseif Marker:isMarker(value) then
                local x, z = table.unpack(value.mapCoords)
                SHAMAN_DEFEND(self.tribe, x, z, 1)
                self._cache.shamanDefendBaseLocation = value.location
            else
                SHAMAN_DEFEND(self.tribe, value[1], value[2], 1)
                self._cache.shamanDefendBaseLocation = Location.make2D(value[1], value[2])
            end
        end
    },
    true
)
do
    AI.Attributes = __TS__Class()
    local Attributes = AI.Attributes
    Attributes.name = "Attributes"
    function Attributes.prototype.____constructor(self, tribe)
        self._tribe = tribe
    end
    function Attributes.prototype.setAttribute(self, attribute, value)
        WRITE_CP_ATTRIB(
            self._tribe,
            attribute,
            IMath.toInteger(value)
        )
    end
    function Attributes.prototype.getAttribute(self, attribute)
        return READ_CP_ATTRIB(self._tribe, attribute)
    end
    function Attributes.prototype.exportData(self)
        local data = {}
        do
            local i = 0
            while i <= 47 do
                data[#data + 1] = self:getAttribute(i)
                i = i + 1
            end
        end
        return data
    end
    function Attributes.prototype.importData(self, data)
        local len = IMath.imin(48, #data)
        do
            local i = 0
            while i <= len do
                local value = data[i + 1]
                if type(value) == "number" then
                    self:setAttribute(i, value)
                end
                i = i + 1
            end
        end
    end
    __TS__SetDescriptor(
        Attributes.prototype,
        "expansion",
        {
            get = function(self)
                return self:getAttribute(0)
            end,
            set = function(self, value)
                self:setAttribute(0, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "prefSpyTrains",
        {
            get = function(self)
                return self:getAttribute(1)
            end,
            set = function(self, value)
                self:setAttribute(1, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "prefReligiousTrains",
        {
            get = function(self)
                return self:getAttribute(2)
            end,
            set = function(self, value)
                self:setAttribute(2, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "prefWarriorTrains",
        {
            get = function(self)
                return self:getAttribute(3)
            end,
            set = function(self, value)
                self:setAttribute(3, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "prefSuperWarriorTrains",
        {
            get = function(self)
                return self:getAttribute(4)
            end,
            set = function(self, value)
                self:setAttribute(4, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "prefSpyPeople",
        {
            get = function(self)
                return self:getAttribute(5)
            end,
            set = function(self, value)
                self:setAttribute(5, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "prefReligiousPeople",
        {
            get = function(self)
                return self:getAttribute(6)
            end,
            set = function(self, value)
                self:setAttribute(6, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "prefWarriorPeople",
        {
            get = function(self)
                return self:getAttribute(7)
            end,
            set = function(self, value)
                self:setAttribute(7, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "prefSuperWarriorPeople",
        {
            get = function(self)
                return self:getAttribute(8)
            end,
            set = function(self, value)
                self:setAttribute(8, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "maxBuildingsOnGo",
        {
            get = function(self)
                return self:getAttribute(9)
            end,
            set = function(self, value)
                self:setAttribute(9, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "housePercentage",
        {
            get = function(self)
                return self:getAttribute(10)
            end,
            set = function(self, value)
                self:setAttribute(10, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "awayBrave",
        {
            get = function(self)
                return self:getAttribute(11)
            end,
            set = function(self, value)
                self:setAttribute(11, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "awayWarrior",
        {
            get = function(self)
                return self:getAttribute(12)
            end,
            set = function(self, value)
                self:setAttribute(12, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "awayReligious",
        {
            get = function(self)
                return self:getAttribute(13)
            end,
            set = function(self, value)
                self:setAttribute(13, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "defenseRadIncr",
        {
            get = function(self)
                return self:getAttribute(14)
            end,
            set = function(self, value)
                self:setAttribute(14, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "maxDefensiveActions",
        {
            get = function(self)
                return self:getAttribute(15)
            end,
            set = function(self, value)
                self:setAttribute(15, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "awaySpy",
        {
            get = function(self)
                return self:getAttribute(16)
            end,
            set = function(self, value)
                self:setAttribute(16, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "awaySuperWarrior",
        {
            get = function(self)
                return self:getAttribute(17)
            end,
            set = function(self, value)
                self:setAttribute(17, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "attackPercentage",
        {
            get = function(self)
                return self:getAttribute(18)
            end,
            set = function(self, value)
                self:setAttribute(18, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "awayShaman",
        {
            get = function(self)
                return self:getAttribute(19)
            end,
            set = function(self, value)
                self:setAttribute(19, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "peoplePerBoat",
        {
            get = function(self)
                return self:getAttribute(20)
            end,
            set = function(self, value)
                self:setAttribute(20, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "peoplePerBalloon",
        {
            get = function(self)
                return self:getAttribute(21)
            end,
            set = function(self, value)
                self:setAttribute(21, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "dontUseBoats",
        {
            get = function(self)
                return self:getAttribute(22)
            end,
            set = function(self, value)
                self:setAttribute(22, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "maxSpyAttacks",
        {
            get = function(self)
                return self:getAttribute(23)
            end,
            set = function(self, value)
                self:setAttribute(23, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "enemySpyMaxStand",
        {
            get = function(self)
                return self:getAttribute(24)
            end,
            set = function(self, value)
                self:setAttribute(24, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "maxAttacks",
        {
            get = function(self)
                return self:getAttribute(25)
            end,
            set = function(self, value)
                self:setAttribute(25, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "emptyAtWaypoint",
        {
            get = function(self)
                return self:getAttribute(26)
            end,
            set = function(self, value)
                self:setAttribute(26, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "spyCheckFrequency",
        {
            get = function(self)
                return self:getAttribute(27)
            end,
            set = function(self, value)
                self:setAttribute(27, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "retreatValue",
        {
            get = function(self)
                return self:getAttribute(28)
            end,
            set = function(self, value)
                self:setAttribute(28, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "baseUnderAttackRetreat",
        {
            get = function(self)
                return self:getAttribute(29)
            end,
            set = function(self, value)
                self:setAttribute(29, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "randomBuildSide",
        {
            get = function(self)
                return self:getAttribute(30)
            end,
            set = function(self, value)
                self:setAttribute(30, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "usePreacherForDefense",
        {
            get = function(self)
                return self:getAttribute(31)
            end,
            set = function(self, value)
                self:setAttribute(31, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "shamenBlast",
        {
            get = function(self)
                return self:getAttribute(32)
            end,
            set = function(self, value)
                self:setAttribute(32, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "maxTrainAtOnce",
        {
            get = function(self)
                return self:getAttribute(33)
            end,
            set = function(self, value)
                self:setAttribute(33, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "groupOption",
        {
            get = function(self)
                return self:getAttribute(34)
            end,
            set = function(self, value)
                self:setAttribute(34, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "prefBoatHuts",
        {
            get = function(self)
                return self:getAttribute(35)
            end,
            set = function(self, value)
                self:setAttribute(35, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "prefBalloonHuts",
        {
            get = function(self)
                return self:getAttribute(36)
            end,
            set = function(self, value)
                self:setAttribute(36, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "prefBoatDrivers",
        {
            get = function(self)
                return self:getAttribute(37)
            end,
            set = function(self, value)
                self:setAttribute(37, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "prefBalloonDrivers",
        {
            get = function(self)
                return self:getAttribute(38)
            end,
            set = function(self, value)
                self:setAttribute(38, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "fightStopDistance",
        {
            get = function(self)
                return self:getAttribute(39)
            end,
            set = function(self, value)
                self:setAttribute(39, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "spyDiscoverChance",
        {
            get = function(self)
                return self:getAttribute(40)
            end,
            set = function(self, value)
                self:setAttribute(40, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "countPreachDamage",
        {
            get = function(self)
                return self:getAttribute(41)
            end,
            set = function(self, value)
                self:setAttribute(41, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "dontGroupAtDT",
        {
            get = function(self)
                return self:getAttribute(42)
            end,
            set = function(self, value)
                self:setAttribute(42, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "spellDelay",
        {
            get = function(self)
                return self:getAttribute(43)
            end,
            set = function(self, value)
                self:setAttribute(43, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "dontDeleteUselessBoatHouse",
        {
            get = function(self)
                return self:getAttribute(44)
            end,
            set = function(self, value)
                self:setAttribute(44, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "boatHouseBroken",
        {
            get = function(self)
                return self:getAttribute(45)
            end,
            set = function(self, value)
                self:setAttribute(45, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "dontAutoTrainPreachers",
        {
            get = function(self)
                return self:getAttribute(46)
            end,
            set = function(self, value)
                self:setAttribute(46, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        Attributes.prototype,
        "spare6",
        {
            get = function(self)
                return self:getAttribute(47)
            end,
            set = function(self, value)
                self:setAttribute(47, value)
            end
        },
        true
    )
    AI.States = __TS__Class()
    local States = AI.States
    States.name = "States"
    function States.prototype.____constructor(self, tribe)
        self._tribe = tribe
        self._cache = {}
    end
    function States.prototype.setState(self, state, value)
        STATE_SET(self._tribe, value and 1 or 0, state)
        self._cache[state] = value
    end
    function States.prototype.getState(self, state)
        return self._cache[state] == true
    end
    function States.prototype.exportData(self)
        local data = {}
        do
            local i = 0
            while i < 29 do
                data[#data + 1] = self:getState(i)
                i = i + 1
            end
        end
        return data
    end
    function States.prototype.importData(self, data)
        local len = IMath.imin(29, #data)
        do
            local i = 0
            while i <= len do
                local value = data[i + 1]
                if type(value) == "boolean" then
                    self:setState(i, value)
                end
                i = i + 1
            end
        end
    end
    __TS__SetDescriptor(
        States.prototype,
        "constructBuilding",
        {
            get = function(self)
                return self:getState(0)
            end,
            set = function(self, value)
                self:setState(0, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "fetchWood",
        {
            get = function(self)
                return self:getState(1)
            end,
            set = function(self, value)
                self:setState(1, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "shamanGetWildPreeps",
        {
            get = function(self)
                return self:getState(2)
            end,
            set = function(self, value)
                self:setState(2, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "houseAPerson",
        {
            get = function(self)
                return self:getState(3)
            end,
            set = function(self, value)
                self:setState(3, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "sendGhosts",
        {
            get = function(self)
                return self:getState(4)
            end,
            set = function(self, value)
                self:setState(4, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "bringNewPeopleBack",
        {
            get = function(self)
                return self:getState(5)
            end,
            set = function(self, value)
                self:setState(5, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "trainPeople",
        {
            get = function(self)
                return self:getState(6)
            end,
            set = function(self, value)
                self:setState(6, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "populateDrumTower",
        {
            get = function(self)
                return self:getState(7)
            end,
            set = function(self, value)
                self:setState(7, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "defend",
        {
            get = function(self)
                return self:getState(8)
            end,
            set = function(self, value)
                self:setState(8, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "defendBase",
        {
            get = function(self)
                return self:getState(9)
            end,
            set = function(self, value)
                self:setState(9, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "spellDefence",
        {
            get = function(self)
                return self:getState(10)
            end,
            set = function(self, value)
                self:setState(10, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "preach",
        {
            get = function(self)
                return self:getState(11)
            end,
            set = function(self, value)
                self:setState(11, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "buildWalls",
        {
            get = function(self)
                return self:getState(12)
            end,
            set = function(self, value)
                self:setState(12, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "sabotage",
        {
            get = function(self)
                return self:getState(13)
            end,
            set = function(self, value)
                self:setState(13, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "spellOffensive",
        {
            get = function(self)
                return self:getState(14)
            end,
            set = function(self, value)
                self:setState(14, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "superDefend",
        {
            get = function(self)
                return self:getState(15)
            end,
            set = function(self, value)
                self:setState(15, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "buildVehicle",
        {
            get = function(self)
                return self:getState(16)
            end,
            set = function(self, value)
                self:setState(16, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "fetchLostPeople",
        {
            get = function(self)
                return self:getState(17)
            end,
            set = function(self, value)
                self:setState(17, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "fetchLostVehicle",
        {
            get = function(self)
                return self:getState(18)
            end,
            set = function(self, value)
                self:setState(18, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "fetchFarVehicle",
        {
            get = function(self)
                return self:getState(19)
            end,
            set = function(self, value)
                self:setState(19, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "autoAttack",
        {
            get = function(self)
                return self:getState(20)
            end,
            set = function(self, value)
                self:setState(20, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "shamanDefend",
        {
            get = function(self)
                return self:getState(21)
            end,
            set = function(self, value)
                self:setState(21, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "flattenBase",
        {
            get = function(self)
                return self:getState(22)
            end,
            set = function(self, value)
                self:setState(22, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "buildOuterDefences",
        {
            get = function(self)
                return self:getState(23)
            end,
            set = function(self, value)
                self:setState(23, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "guardAtMarker",
        {
            get = function(self)
                return self:getState(24)
            end,
            set = function(self, value)
                self:setState(24, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "sendAllToMarker",
        {
            get = function(self)
                return self:getState(25)
            end,
            set = function(self, value)
                self:setState(25, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "prayAtHead",
        {
            get = function(self)
                return self:getState(26)
            end,
            set = function(self, value)
                self:setState(26, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "boatPatrol",
        {
            get = function(self)
                return self:getState(27)
            end,
            set = function(self, value)
                self:setState(27, value)
            end
        },
        true
    )
    __TS__SetDescriptor(
        States.prototype,
        "defendShamen",
        {
            get = function(self)
                return self:getState(28)
            end,
            set = function(self, value)
                self:setState(28, value)
            end
        },
        true
    )
end
return ____exports
