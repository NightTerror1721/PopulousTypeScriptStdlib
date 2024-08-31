local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__ObjectDefineProperty = ____lualib.__TS__ObjectDefineProperty
local ____exports = {}
require("PopModules")
local ____Flags = require("Flags")
local Flags = ____Flags.Flags
local ____Things = require("Things")
local createBuilding = ____Things.createBuilding
local ____Map = require("Map")
local Map = ____Map.Map
local _gsi = gsi()
____exports.InternalBuildingModel = {}
local InternalBuildingModel = ____exports.InternalBuildingModel
do
    local Mapper = {
        [0] = INT_NO_SPECIFIC_BUILDING,
        [1] = INT_TEPEE,
        [2] = INT_HUT,
        [3] = INT_FARM,
        [4] = INT_DRUM_TOWER,
        [5] = INT_TEMPLE,
        [6] = INT_SPY_TRAIN,
        [7] = INT_WARRIOR_TRAIN,
        [8] = INT_SUPER_TRAIN,
        [9] = INT_RECONVERSION,
        [10] = INT_WALL_PIECE,
        [11] = INT_GATE,
        [13] = INT_BOAT_HUT_1,
        [14] = INT_BOAT_HUT_2,
        [15] = INT_AIRSHIP_HUT_1,
        [16] = INT_AIRSHIP_HUT_2
    }
    function InternalBuildingModel.of(self, model)
        return model and Mapper[model] or nil
    end
end
local ValidOrientations = {[1000] = 1000, [1500] = 1500, [0] = 0, [500] = 500}
function ____exports.isValidBuildingOrientation(self, orientation)
    return ValidOrientations[orientation] ~= nil
end
____exports.Building = __TS__Class()
local Building = ____exports.Building
Building.name = "Building"
function Building.prototype.____constructor(self, tribe, model)
    self.tribe = tribe
    self.model = model
    self._player = getPlayer(tribe)
    self._playerThings = _gsi.ThisLevelInfo.PlayerThings[tribe]
end
function Building.prototype.forEachInWorld(self, action)
    ____exports.Building.forEachBuilding(self.tribe, self.model, action)
end
function Building.prototype.createNewInWorld(self, location, orientation)
    local building = createBuilding(self.model, self.tribe, location)
    if building ~= nil then
        if orientation and ____exports.isValidBuildingOrientation(nil, orientation) then
            building.AngleXZ = orientation
        end
    end
    return building
end
function Building.prototype.findAtPos(self, xOrLoc, zOrRadius, radiusOrUndef)
    local x
    local z
    local radius
    if radiusOrUndef then
        x = xOrLoc
        z = zOrRadius
        radius = radiusOrUndef
    else
        x, z = Map.getCellComponentsFromLocation(xOrLoc)
        radius = zOrRadius
    end
    local building = Map.findFirstThingOf(
        2,
        self.model,
        x,
        z,
        radius,
        CIRCULAR
    )
    if building and building.Owner == self.tribe then
        return building
    end
    return nil
end
function Building.prototype.isNear(self, xOrLoc, zOrRadius, radiusOrUndef)
    if type(xOrLoc) == "number" then
        return IS_BUILDING_NEAR(
            self.tribe,
            ____exports.InternalBuildingModel:of(self.model),
            xOrLoc,
            zOrRadius,
            radiusOrUndef
        ) ~= 0
    end
    local x, z = Map.getCellComponentsFromLocation(xOrLoc)
    return IS_BUILDING_NEAR(
        self.tribe,
        ____exports.InternalBuildingModel:of(self.model),
        x,
        z,
        radiusOrUndef
    ) ~= 0
end
function Building.getTribeBuildingCount(self, tribe)
    return getPlayer(tribe).NumBuildings
end
function Building.forEachBuilding(arg0, arg1, arg2)
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
            2,
            function(building)
                if tribe and building.Owner ~= tribe or building.Model ~= models then
                    return true
                end
                local result = action(building)
                return result == nil or result ~= 0
            end
        )
    elseif models == nil or #models < 1 then
        ProcessGlobalTypeList(
            2,
            function(building)
                if tribe and building.Owner ~= tribe then
                    return true
                end
                local result = action(building)
                return result == nil or result ~= 0
            end
        )
    else
        ProcessGlobalTypeList(
            2,
            function(building)
                if tribe and building.Owner ~= tribe or not (models[building.Model] ~= nil) then
                    return true
                end
                local result = action(building)
                return result == nil or result ~= 0
            end
        )
    end
end
__TS__SetDescriptor(
    Building.prototype,
    "numInWorld",
    {get = function(self)
        return self._player.NumBuildingsOfType[self.model]
    end},
    true
)
__TS__SetDescriptor(
    Building.prototype,
    "isEnabled",
    {
        get = function(self)
            return Flags.isBitSet(self._playerThings.BuildingsAvailable, self.model)
        end,
        set = function(self, value)
            if value then
                self._playerThings.BuildingsAvailable = Flags.setBit(self._playerThings.BuildingsAvailable, self.model)
            else
                self._playerThings.BuildingsAvailable = Flags.clearBit(self._playerThings.BuildingsAvailable, self.model)
            end
        end
    },
    true
)
__TS__SetDescriptor(
    Building.prototype,
    "hasOnceShot",
    {
        get = function(self)
            return Flags.isBitSet(self._playerThings.BuildingsAvailableOnce, self.model)
        end,
        set = function(self, value)
            if value then
                self._playerThings.BuildingsAvailableOnce = Flags.setBit(self._playerThings.BuildingsAvailableOnce, self.model)
            else
                self._playerThings.BuildingsAvailableOnce = Flags.clearBit(self._playerThings.BuildingsAvailableOnce, self.model)
            end
        end
    },
    true
)
__TS__SetDescriptor(
    Building.prototype,
    "isLevelEnabled",
    {
        get = function(self)
            return Flags.isBitSet(self._playerThings.BuildingsAvailableLevel, self.model)
        end,
        set = function(self, value)
            if value then
                self._playerThings.BuildingsAvailableLevel = Flags.setBit(self._playerThings.BuildingsAvailableLevel, self.model)
            else
                self._playerThings.BuildingsAvailableLevel = Flags.clearBit(self._playerThings.BuildingsAvailableLevel, self.model)
            end
        end
    },
    true
)
Building._autoBuild = false
__TS__ObjectDefineProperty(
    Building,
    "autoBuild",
    {
        get = function(self)
            return ____exports.Building._autoBuild
        end,
        set = function(self, value)
            SET_AUTO_BUILD(value and 1 or 0)
            ____exports.Building._autoBuild = value
        end
    }
)
Building._autoHouse = false
__TS__ObjectDefineProperty(
    Building,
    "autoHouse",
    {
        get = function(self)
            return ____exports.Building._autoHouse
        end,
        set = function(self, value)
            SET_AUTO_HOUSE(value and 1 or 0)
            ____exports.Building._autoHouse = value
        end
    }
)
return ____exports
