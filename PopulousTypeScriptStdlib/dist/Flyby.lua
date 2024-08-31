--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____Map = require("Map")
local Map = ____Map.Map
require("PopModules")
____exports.Flyby = {}
local Flyby = ____exports.Flyby
do
    function Flyby.EventLocation(xOrLoc, zOrStart, startOrDuration, durationOrUndef)
        if type(xOrLoc) == "number" then
            return {
                eventType = 0,
                x = xOrLoc,
                z = zOrStart,
                start = startOrDuration,
                duration = durationOrUndef
            }
        else
            local x, z = Map.getCellComponentsFromLocation(xOrLoc)
            return {
                eventType = 0,
                x = x,
                z = z,
                start = zOrStart,
                duration = startOrDuration
            }
        end
    end
    function Flyby.EventAngle(angle, start, duration)
        return {eventType = 1, angle = angle, start = start, duration = duration}
    end
    function Flyby.EventZoom(zoom, start, duration)
        return {eventType = 2, zoom = zoom, start = start, duration = duration}
    end
    function Flyby.EventTooltip(xOrLoc, zOrCode, codeOrStart, startOrDuration, durationOrUndef)
        if type(xOrLoc) == "number" then
            return {
                eventType = 3,
                x = xOrLoc,
                z = zOrCode,
                code = codeOrStart,
                start = startOrDuration,
                duration = durationOrUndef
            }
        else
            local x, z = Map.getCellComponentsFromLocation(xOrLoc)
            return {
                eventType = 3,
                x = x,
                z = z,
                code = zOrCode,
                start = codeOrStart,
                duration = startOrDuration
            }
        end
    end
    function Flyby.EventDialog(dialogIdx, start)
        return {eventType = 4, dialogIdx = dialogIdx, start = start}
    end
    function Flyby.EventEndTarget(xOrLoc, zOrAngle, angleOrDuration, durationOrUndef)
        if type(xOrLoc) == "number" then
            return {x = xOrLoc, z = zOrAngle, angle = angleOrDuration, duration = durationOrUndef}
        else
            local x, z = Map.getCellComponentsFromLocation(xOrLoc)
            return {x = x, z = z, angle = zOrAngle, duration = angleOrDuration}
        end
    end
    function Flyby.create()
        FLYBY_CREATE_NEW()
    end
    function Flyby.stop()
        FLYBY_STOP()
    end
    function Flyby.setAllowInterrupt(enabled)
        FLYBY_ALLOW_INTERRUPT(enabled and 1 or 0)
    end
    function Flyby.setEventLocation(xOrLoc, zOrStart, startOrDuration, durationOrUndef)
        if type(xOrLoc) == "number" then
            FLYBY_SET_EVENT_POS(xOrLoc, zOrStart, startOrDuration, durationOrUndef)
        else
            local x, z = Map.getCellComponentsFromLocation(xOrLoc)
            FLYBY_SET_EVENT_POS(x, z, zOrStart, startOrDuration)
        end
    end
    function Flyby.setEventAngle(angle, start, duration)
        FLYBY_SET_EVENT_ANGLE(angle, start, duration)
    end
    function Flyby.setEventZoom(zoom, start, duration)
        FLYBY_SET_EVENT_ZOOM(zoom, start, duration)
    end
    function Flyby.setEventTooltip(xOrLoc, zOrCode, codeOrStart, startOrDuration, durationOrUndef)
        if type(xOrLoc) == "number" then
            FLYBY_SET_EVENT_TOOLTIP(
                xOrLoc,
                zOrCode,
                codeOrStart,
                startOrDuration,
                durationOrUndef
            )
        else
            local x, z = Map.getCellComponentsFromLocation(xOrLoc)
            FLYBY_SET_EVENT_TOOLTIP(
                x,
                z,
                zOrCode,
                codeOrStart,
                startOrDuration
            )
        end
    end
    function Flyby.setEndTarget(xOrLoc, zOrAngle, angleOrDuration, durationOrUndef)
        if type(xOrLoc) == "number" then
            FLYBY_SET_END_TARGET(xOrLoc, zOrAngle, angleOrDuration, durationOrUndef)
        else
            local x, z = Map.getCellComponentsFromLocation(xOrLoc)
            FLYBY_SET_END_TARGET(x, z, zOrAngle, angleOrDuration)
        end
    end
    function Flyby.openDialog(dialogIdx, start)
        FLYBY_OPEN_DIALOG(dialogIdx, start)
    end
    Flyby.Event = {}
    local Event = Flyby.Event
    do
        function Event.location(xOrLoc, zOrStart, startOrDuration, durationOrUndef)
            return Flyby.EventLocation(xOrLoc, zOrStart, startOrDuration, durationOrUndef)
        end
        function Event.angle(angle, start, duration)
            return Flyby.EventAngle(angle, start, duration)
        end
        function Event.zoom(zoom, start, duration)
            return Flyby.EventZoom(zoom, start, duration)
        end
        function Event.tooltip(xOrLoc, zOrCode, codeOrStart, startOrDuration, durationOrUndef)
            return Flyby.EventTooltip(
                xOrLoc,
                zOrCode,
                codeOrStart,
                startOrDuration,
                durationOrUndef
            )
        end
        function Event.dialog(dialogIdx, start)
            return Flyby.EventDialog(dialogIdx, start)
        end
        function Event.endTarget(xOrLoc, zOrAngle, angleOrDuration, durationOrUndef)
            return Flyby.EventEndTarget(xOrLoc, zOrAngle, angleOrDuration, durationOrUndef)
        end
    end
    function Flyby.start(events, endTarget)
        if not events then
            FLYBY_START()
        elseif #events > 0 then
            Flyby.create()
            for ____, event in ipairs(events) do
                repeat
                    local ____switch41 = event.eventType
                    local ____cond41 = ____switch41 == 0
                    if ____cond41 then
                        do
                            local data = event
                            Flyby.setEventLocation(data.x, data.z, event.start, data.duration)
                        end
                        break
                    end
                    ____cond41 = ____cond41 or ____switch41 == 1
                    if ____cond41 then
                        do
                            local data = event
                            Flyby.setEventAngle(data.angle, event.start, data.duration)
                        end
                        break
                    end
                    ____cond41 = ____cond41 or ____switch41 == 2
                    if ____cond41 then
                        do
                            local data = event
                            Flyby.setEventZoom(data.zoom, event.start, data.duration)
                        end
                        break
                    end
                    ____cond41 = ____cond41 or ____switch41 == 3
                    if ____cond41 then
                        do
                            local data = event
                            Flyby.setEventTooltip(
                                data.x,
                                data.z,
                                data.code,
                                event.start,
                                data.duration
                            )
                        end
                        break
                    end
                    ____cond41 = ____cond41 or ____switch41 == 4
                    if ____cond41 then
                        do
                            local data = event
                            Flyby.openDialog(data.dialogIdx, data.start)
                        end
                        break
                    end
                    do
                        break
                    end
                until true
            end
            if endTarget then
                Flyby.setEndTarget(endTarget.x, endTarget.z, endTarget.angle, endTarget.duration)
            end
            FLYBY_START()
        end
    end
end
return ____exports
