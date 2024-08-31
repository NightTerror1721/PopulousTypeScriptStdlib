import { Location } from "./Location"
import { Map } from "./Map"
import "./PopModules"


/** @noSelf */
export namespace Flyby
{
    export function create(): void { FLYBY_CREATE_NEW() }

    export function stop(): void { FLYBY_STOP() }

    export function setAllowInterrupt(enabled: boolean): void
    {
        FLYBY_ALLOW_INTERRUPT(enabled ? 1 : 0)
    }

    export function setEventLocation(x: number, z: number, start: number, duration: number): void
    export function setEventLocation(location: Location, start: number, duration: number): void
    export function setEventLocation(xOrLoc: number|Location, zOrStart: number, startOrDuration: number, durationOrUndef?: number): void
    {
        if(typeof xOrLoc === "number")
            FLYBY_SET_EVENT_POS(xOrLoc, zOrStart, startOrDuration, durationOrUndef!!)
        else
        {
            const [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
            FLYBY_SET_EVENT_POS(x, z, zOrStart, startOrDuration)
        }
    }

    export function setEventAngle(angle: number, start: number, duration: number): void
    {
        FLYBY_SET_EVENT_ANGLE(angle, start, duration)
    }

    export function setEventZoom(zoom: number, start: number, duration: number): void
    {
        FLYBY_SET_EVENT_ZOOM(zoom, start, duration)
    }

    export function setEventTooltip(x: number, z: number, code: number, start: number, duration: number): void
    export function setEventTooltip(location: Location, code: number, start: number, duration: number): void
    export function setEventTooltip(xOrLoc: number|Location, zOrCode: number, codeOrStart: number, startOrDuration: number, durationOrUndef?: number): void
    {
        if(typeof xOrLoc === "number")
            FLYBY_SET_EVENT_TOOLTIP(xOrLoc, zOrCode, codeOrStart, startOrDuration, durationOrUndef!!)
        else
        {
            const [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
            FLYBY_SET_EVENT_TOOLTIP(x, z, zOrCode, codeOrStart, startOrDuration)
        }
    }

    export function setEndTarget(x: number, z: number, angle: number, duration: number): void
    export function setEndTarget(location: Location, angle: number, duration: number): void
    export function setEndTarget(xOrLoc: number|Location, zOrAngle: number, angleOrDuration: number, durationOrUndef?: number): void
    {
        if(typeof xOrLoc === "number")
            FLYBY_SET_END_TARGET(xOrLoc, zOrAngle, angleOrDuration, durationOrUndef!!)
        else
        {
            const [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
            FLYBY_SET_END_TARGET(x, z, zOrAngle, angleOrDuration)
        }
    }

    export function openDialog(dialogIdx: number, start: number): void
    {
        FLYBY_OPEN_DIALOG(dialogIdx, start)
    }



    interface TemporaryEvent extends Event
    {
        duration: number
    }
    
    export interface Event
    {
        start: number
        readonly eventType: Event.Type
    }
    export namespace Event
    {
        export const enum Type
        {
            LOCATION,
            ANGLE,
            ZOOM,
            TOOLTIP,
            DIALOG,
        }

        export function location(x: number, z: number, start: number, duration: number): EventLocation
        export function location(location: Location, start: number, duration: number): EventLocation
        export function location(xOrLoc: number|Location, zOrStart: number, startOrDuration: number, durationOrUndef?: number): EventLocation
        {
            return EventLocation(xOrLoc as any, zOrStart, startOrDuration, durationOrUndef!!)
        }

        export function angle(angle: number, start: number, duration: number): EventAngle
        {
            return EventAngle(angle, start, duration)
        }

        export function zoom(zoom: number, start: number, duration: number): EventZoom
        {
            return EventZoom(zoom, start, duration)
        }

        export function tooltip(x: number, z: number, code: number, start: number, duration: number): EventTooltip
        export function tooltip(location: Location, code: number, start: number, duration: number): EventTooltip
        export function tooltip(xOrLoc: number|Location, zOrCode: number, codeOrStart: number, startOrDuration: number, durationOrUndef?: number): EventTooltip
        {
            return EventTooltip(xOrLoc as any, zOrCode, codeOrStart, startOrDuration, durationOrUndef!!)
        }

        export function dialog(dialogIdx: number, start: number)
        {
            return EventDialog(dialogIdx, start)
        }

        export function endTarget(x: number, z: number, angle: number, duration: number): EventEndTarget
        export function endTarget(location: Location, angle: number, duration: number): EventEndTarget
        export function endTarget(xOrLoc: number|Location, zOrAngle: number, angleOrDuration: number, durationOrUndef?: number): EventEndTarget
        {
            return EventEndTarget(xOrLoc as any, zOrAngle, angleOrDuration, durationOrUndef!!)
        }
    }

    export interface EventLocation extends TemporaryEvent
    {
        x: number
        z: number
    }
    export function EventLocation(x: number, z: number, start: number, duration: number): EventLocation
    export function EventLocation(location: Location, start: number, duration: number): EventLocation
    export function EventLocation(xOrLoc: number|Location, zOrStart: number, startOrDuration: number, durationOrUndef?: number): EventLocation
    {
        if(typeof xOrLoc === "number")
            return { eventType: Event.Type.LOCATION, x: xOrLoc, z: zOrStart, start: startOrDuration, duration: durationOrUndef!! }
        else
        {
            const [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
            return { eventType: Event.Type.LOCATION, x: x, z: z, start: zOrStart, duration: startOrDuration }
        }
    }

    export interface EventAngle extends TemporaryEvent
    {
        angle: number
    }
    export function EventAngle(angle: number, start: number, duration: number): EventAngle
    {
        return { eventType: Event.Type.ANGLE, angle: angle, start: start, duration: duration }
    }

    export interface EventZoom extends TemporaryEvent
    {
        zoom: number
    }
    export function EventZoom(zoom: number, start: number, duration: number): EventZoom
    {
        return { eventType: Event.Type.ZOOM, zoom: zoom, start: start, duration: duration }
    }

    export interface EventTooltip extends EventLocation
    {
        code: number
    }
    export function EventTooltip(x: number, z: number, code: number, start: number, duration: number): EventTooltip
    export function EventTooltip(location: Location, code: number, start: number, duration: number): EventTooltip
    export function EventTooltip(xOrLoc: number|Location, zOrCode: number, codeOrStart: number, startOrDuration: number, durationOrUndef?: number): EventTooltip
    {
        if(typeof xOrLoc === "number")
            return { eventType: Event.Type.TOOLTIP, x: xOrLoc, z: zOrCode, code: codeOrStart, start: startOrDuration, duration: durationOrUndef!! }
        else
        {
            const [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
            return { eventType: Event.Type.TOOLTIP, x: x, z: z, code: zOrCode, start: codeOrStart, duration: startOrDuration }
        }
    }

    export interface EventDialog extends Event
    {
        dialogIdx: number
    }
    export function EventDialog(dialogIdx: number, start: number)
    {
        return { eventType: Event.Type.DIALOG, dialogIdx: dialogIdx, start: start }
    }

    export interface EventEndTarget
    {
        x: number
        z: number
        angle: number
        duration: number
    }
    export function EventEndTarget(x: number, z: number, angle: number, duration: number): EventEndTarget
    export function EventEndTarget(location: Location, angle: number, duration: number): EventEndTarget
    export function EventEndTarget(xOrLoc: number|Location, zOrAngle: number, angleOrDuration: number, durationOrUndef?: number): EventEndTarget
    {
        if(typeof xOrLoc === "number")
            return { x: xOrLoc, z: zOrAngle, angle: angleOrDuration, duration: durationOrUndef!! }
        else
        {
            const [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
            return { x: x, z: z, angle: zOrAngle, duration: angleOrDuration }
        }
    }



    export function start(events: Event[], endTarget?: EventEndTarget): void
    export function start(): void
    export function start(events?: Event[], endTarget?: EventEndTarget): void
    {
        if(!events)
            FLYBY_START()
        else if(events.length > 0)
        {
            create()
            for(const event of events)
            {
                switch(event.eventType)
                {
                    case Flyby.Event.Type.LOCATION: {
                        const data = event as EventLocation
                        setEventLocation(data.x, data.z, event.start, data.duration)
                    } break

                    case Flyby.Event.Type.ANGLE: {
                        const data = event as EventAngle
                        setEventAngle(data.angle, event.start, data.duration)
                    } break

                    case Flyby.Event.Type.ZOOM: {
                        const data = event as EventZoom
                        setEventZoom(data.zoom, event.start, data.duration)
                    } break

                    case Flyby.Event.Type.TOOLTIP: {
                        const data = event as EventTooltip
                        setEventTooltip(data.x, data.z, data.code, event.start, data.duration)
                    } break

                    case Flyby.Event.Type.DIALOG: {
                        const data = event as EventDialog
                        openDialog(data.dialogIdx, data.start)
                    } break

                    default: break
                }
            }
            if(endTarget)
                setEndTarget(endTarget.x, endTarget.z, endTarget.angle, endTarget.duration)
            FLYBY_START()
        }
    }
}
