local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
require("PopModules")
local ____Flags = require("Flags")
local Flags = ____Flags.Flags
local _gsi = gsi()
local _sti = spells_type_info()
____exports.InternalSpellModel = {}
local InternalSpellModel = ____exports.InternalSpellModel
do
    local Mapper = {
        [0] = INT_NO_SPECIFIC_SPELL,
        [1] = INT_BURN,
        [2] = INT_BLAST,
        [3] = INT_LIGHTNING_BOLT,
        [4] = INT_WHIRLWIND,
        [5] = INT_INSECT_PLAGUE,
        [6] = INT_INVISIBILITY,
        [7] = INT_HYPNOTISM,
        [8] = INT_FIRESTORM,
        [9] = INT_GHOST_ARMY,
        [10] = INT_EROSION,
        [11] = INT_SWAMP,
        [12] = INT_LAND_BRIDGE,
        [13] = INT_ANGEL_OF_DEATH,
        [14] = INT_EARTHQUAKE,
        [15] = INT_FLATTEN,
        [16] = INT_VOLCANO,
        [17] = INT_CONVERT,
        [18] = INT_WRATH_OF_GOD,
        [19] = INT_SHIELD,
        [20] = INT_BLOODLUST,
        [21] = INT_TELEPORT
    }
    function InternalSpellModel.of(self, model)
        return model and Mapper[model] or nil
    end
end
____exports.Spell = __TS__Class()
local Spell = ____exports.Spell
Spell.name = "Spell"
function Spell.prototype.____constructor(self, tribe, model)
    self.tribe = tribe
    self.model = model
    self._playerThings = _gsi.ThisLevelInfo.PlayerThings[tribe]
    self._player = getPlayer(tribe)
end
function Spell.prototype.giveShots(self, shots)
    self.shots = self.shots + (self.shots + math.max(
        0,
        math.floor(shots)
    ))
end
function Spell.getCost(model)
    return _sti[model].Cost
end
function Spell.getInternalModelValue(model)
    return ____exports.InternalSpellModel:of(model) or INT_NO_SPECIFIC_SPELL
end
__TS__SetDescriptor(
    Spell.prototype,
    "isEnabled",
    {
        get = function(self)
            return Flags.isBitSet(self._playerThings.SpellsAvailable, self.model)
        end,
        set = function(self, value)
            self._playerThings.SpellsAvailable = value and Flags.setBit(self._playerThings.SpellsAvailable, self.model) or Flags.clearBit(self._playerThings.SpellsAvailable, self.model)
        end
    },
    true
)
__TS__SetDescriptor(
    Spell.prototype,
    "isChargeEnabled",
    {
        get = function(self)
            return not Flags.isBitSet(self._playerThings.SpellsNotCharging, self.model)
        end,
        set = function(self, value)
            self._playerThings.SpellsNotCharging = not value and Flags.setBit(self._playerThings.SpellsNotCharging, self.model) or Flags.clearBit(self._playerThings.SpellsNotCharging, self.model)
        end
    },
    true
)
__TS__SetDescriptor(
    Spell.prototype,
    "shots",
    {
        get = function(self)
            return self._playerThings.SpellsAvailableOnce[self.model]
        end,
        set = function(self, value)
            self._playerThings.SpellsAvailableOnce[self.model] = math.max(
                0,
                math.floor(value)
            )
        end
    },
    true
)
__TS__SetDescriptor(
    Spell.prototype,
    "isLevelEnabled",
    {
        get = function(self)
            return not Flags.isBitSet(self._playerThings.SpellsAvailableLevel, self.model - 1)
        end,
        set = function(self, value)
            self._playerThings.SpellsNotCharging = value and Flags.setBit(self._playerThings.SpellsAvailableLevel, self.model - 1) or Flags.clearBit(self._playerThings.SpellsAvailableLevel, self.model - 1)
        end
    },
    true
)
__TS__SetDescriptor(
    Spell.prototype,
    "mana",
    {get = function(self)
        return self._player.SpellsMana[self.model]
    end},
    true
)
__TS__SetDescriptor(
    Spell.prototype,
    "castCount",
    {get = function(self)
        return self.model > 22 and 0 or self._player.SpellsCast[self.model]
    end},
    true
)
__TS__SetDescriptor(
    Spell.prototype,
    "cost",
    {get = function(self)
        return ____exports.Spell.getCost(self.model)
    end},
    true
)
__TS__SetDescriptor(
    Spell.prototype,
    "internalModelValue",
    {get = function(self)
        return ____exports.Spell.getInternalModelValue(self.model)
    end},
    true
)
Spell.Count = 32
return ____exports
