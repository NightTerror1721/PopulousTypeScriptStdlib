--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.Flags = {}
local Flags = ____exports.Flags
do
    function Flags.set(base, values)
        return base | values
    end
    function Flags.setBit(base, bitIdx)
        return base | 1 << bitIdx
    end
    function Flags.clear(base, values)
        return base & ~values
    end
    function Flags.clearBit(base, bitIdx)
        return base & ~(1 << bitIdx)
    end
    function Flags.isSet(base, flags)
        return base & flags == flags
    end
    function Flags.isBitSet(base, bitIdx)
        return base & 1 << bitIdx ~= 0
    end
end
return ____exports
