/** @noSelfInFile */

import { IMath } from "./IMath"
import { Location } from "./Location"
import { Map } from "./Map"
import { Marker, RawMarker } from "./Markers"
import "./PopModules"
import { GeneralModel, ThingType } from "./Things"


export namespace Trigger
{
    export function fireLevelWon(): void { TRIGGER_LEVEL_WON() }
    
    export function fireLevelLost(): void { TRIGGER_LEVEL_LOST() }

    export function fireAtMarker(marker: RawMarker): void { TRIGGER_THING(Marker.asId(marker)) }

    export function fire(trigger: Thing, times?: number): void
    {
        times = times !== undefined ?  IMath.imax(1, times) : 1
        trigger.u.Trigger.TriggeredPendingCount += times
    }

    export function fireAtLocation(x: number, z: number, times?: number): void
    export function fireAtLocation(location: Location, times?: number): void
    export function fireAtLocation(xOrLoc: number|Location, zOrTimes?: number, timesOrUndef?: number): void
    {
        let trigger: Thing|undefined
        if(typeof xOrLoc === "number")
        {
            trigger = Map.findFirstThingOf(ThingType.General, GeneralModel.Trigger, xOrLoc, zOrTimes!!)
            if(trigger !== undefined)
                Trigger.fire(trigger, timesOrUndef)
        }
        else
        {
            trigger = Map.findFirstThingOf(ThingType.General, GeneralModel.Trigger, xOrLoc)
            if(trigger !== undefined)
                Trigger.fire(trigger, zOrTimes)
        }
    }

    export function getRemainingCounts(x: number, z: number): number
    export function getRemainingCounts(location: Location): number
    export function getRemainingCounts(xOrLoc: number|Location, zOrTimes?: number): number
    {
        const trigger = Map.findFirstThingOf(ThingType.General, GeneralModel.Trigger, xOrLoc as any, zOrTimes!!)
        return trigger !== undefined ? trigger.u.Trigger.TriggerCount : 0
    }

    export function getRemainingOcurrences(x: number, z: number): number
    export function getRemainingOcurrences(location: Location): number
    export function getRemainingOcurrences(xOrLoc: number|Location, zOrTimes?: number): number
    {
        const trigger = Map.findFirstThingOf(ThingType.General, GeneralModel.Trigger, xOrLoc as any, zOrTimes!!)
        return trigger !== undefined ? trigger.u.Trigger.NumOccurences : 0
    }
}
