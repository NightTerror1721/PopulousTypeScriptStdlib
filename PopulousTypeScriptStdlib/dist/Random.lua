--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
require("PopModules")
local Random = {}
do
    function Random.integer(minOrMax, max)
        if max then
            if minOrMax >= max - 1 then
                return 0
            end
            return math.random(minOrMax, max - 1)
        end
        if minOrMax < 2 then
            return 0
        end
        return math.random(0, minOrMax - 1)
    end
    function Random.float()
        return math.random()
    end
    function Random.element(array)
        local len = #array
        if len < 1 then
            error(nil, "Empty array on Random.element")
        end
        if len == 1 then
            return array[1]
        end
        return array[Random.integer(len) + 1]
    end
end
____exports.default = Random
return ____exports
