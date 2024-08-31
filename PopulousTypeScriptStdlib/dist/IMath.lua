local ____lualib = require("lualib_bundle")
local __TS__NumberIsInteger = ____lualib.__TS__NumberIsInteger
local ____exports = {}
require("PopModules")
____exports.IMath = {}
local IMath = ____exports.IMath
do
    function IMath.isInteger(n)
        return __TS__NumberIsInteger(n)
    end
    function IMath.toInteger(n)
        return math.floor(n)
    end
    function IMath.imax(a, b)
        return IMath.toInteger(math.max(a, b))
    end
    function IMath.imin(a, b)
        return IMath.toInteger(math.min(a, b))
    end
    function IMath.iclamp(n, min, max)
        return IMath.toInteger(math.max(
            min,
            math.min(max, n)
        ))
    end
end
return ____exports
