/** @noSelfInFile */

import { Coord, Location } from "./Location"
import "./PopModules"

export type RawMarker = Marker | number

export declare namespace Marker
{
    export const MK0: Marker
    export const MK1: Marker
    export const MK2: Marker
    export const MK3: Marker
    export const MK4: Marker
    export const MK5: Marker
    export const MK6: Marker
    export const MK7: Marker
    export const MK8: Marker
    export const MK9: Marker
    export const MK10: Marker
    export const MK11: Marker
    export const MK12: Marker
    export const MK13: Marker
    export const MK14: Marker
    export const MK15: Marker
    export const MK16: Marker
    export const MK17: Marker
    export const MK18: Marker
    export const MK19: Marker
    export const MK20: Marker
    export const MK21: Marker
    export const MK22: Marker
    export const MK23: Marker
    export const MK24: Marker
    export const MK25: Marker
    export const MK26: Marker
    export const MK27: Marker
    export const MK28: Marker
    export const MK29: Marker
    export const MK30: Marker
    export const MK31: Marker
    export const MK32: Marker
    export const MK33: Marker
    export const MK34: Marker
    export const MK35: Marker
    export const MK36: Marker
    export const MK37: Marker
    export const MK38: Marker
    export const MK39: Marker
    export const MK40: Marker
    export const MK41: Marker
    export const MK42: Marker
    export const MK43: Marker
    export const MK44: Marker
    export const MK45: Marker
    export const MK46: Marker
    export const MK47: Marker
    export const MK48: Marker
    export const MK49: Marker
    export const MK50: Marker
    export const MK51: Marker
    export const MK52: Marker
    export const MK53: Marker
    export const MK54: Marker
    export const MK55: Marker
    export const MK56: Marker
    export const MK57: Marker
    export const MK58: Marker
    export const MK59: Marker
    export const MK60: Marker
    export const MK61: Marker
    export const MK62: Marker
    export const MK63: Marker
    export const MK64: Marker
    export const MK65: Marker
    export const MK66: Marker
    export const MK67: Marker
    export const MK68: Marker
    export const MK69: Marker
    export const MK70: Marker
    export const MK71: Marker
    export const MK72: Marker
    export const MK73: Marker
    export const MK74: Marker
    export const MK75: Marker
    export const MK76: Marker
    export const MK77: Marker
    export const MK78: Marker
    export const MK79: Marker
    export const MK80: Marker
    export const MK81: Marker
    export const MK82: Marker
    export const MK83: Marker
    export const MK84: Marker
    export const MK85: Marker
    export const MK86: Marker
    export const MK87: Marker
    export const MK88: Marker
    export const MK89: Marker
    export const MK90: Marker
    export const MK91: Marker
    export const MK92: Marker
    export const MK93: Marker
    export const MK94: Marker
    export const MK95: Marker
    export const MK96: Marker
    export const MK97: Marker
    export const MK98: Marker
    export const MK99: Marker
    export const MK100: Marker
    export const MK101: Marker
    export const MK102: Marker
    export const MK103: Marker
    export const MK104: Marker
    export const MK105: Marker
    export const MK106: Marker
    export const MK107: Marker
    export const MK108: Marker
    export const MK109: Marker
    export const MK110: Marker
    export const MK111: Marker
    export const MK112: Marker
    export const MK113: Marker
    export const MK114: Marker
    export const MK115: Marker
    export const MK116: Marker
    export const MK117: Marker
    export const MK118: Marker
    export const MK119: Marker
    export const MK120: Marker
    export const MK121: Marker
    export const MK122: Marker
    export const MK123: Marker
    export const MK124: Marker
    export const MK125: Marker
    export const MK126: Marker
    export const MK127: Marker
    export const MK128: Marker
    export const MK129: Marker
    export const MK130: Marker
    export const MK131: Marker
    export const MK132: Marker
    export const MK133: Marker
    export const MK134: Marker
    export const MK135: Marker
    export const MK136: Marker
    export const MK137: Marker
    export const MK138: Marker
    export const MK139: Marker
    export const MK140: Marker
    export const MK141: Marker
    export const MK142: Marker
    export const MK143: Marker
    export const MK144: Marker
    export const MK145: Marker
    export const MK146: Marker
    export const MK147: Marker
    export const MK148: Marker
    export const MK149: Marker
    export const MK150: Marker
    export const MK151: Marker
    export const MK152: Marker
    export const MK153: Marker
    export const MK154: Marker
    export const MK155: Marker
    export const MK156: Marker
    export const MK157: Marker
    export const MK158: Marker
    export const MK159: Marker
    export const MK160: Marker
    export const MK161: Marker
    export const MK162: Marker
    export const MK163: Marker
    export const MK164: Marker
    export const MK165: Marker
    export const MK166: Marker
    export const MK167: Marker
    export const MK168: Marker
    export const MK169: Marker
    export const MK170: Marker
    export const MK171: Marker
    export const MK172: Marker
    export const MK173: Marker
    export const MK174: Marker
    export const MK175: Marker
    export const MK176: Marker
    export const MK177: Marker
    export const MK178: Marker
    export const MK179: Marker
    export const MK180: Marker
    export const MK181: Marker
    export const MK182: Marker
    export const MK183: Marker
    export const MK184: Marker
    export const MK185: Marker
    export const MK186: Marker
    export const MK187: Marker
    export const MK188: Marker
    export const MK189: Marker
    export const MK190: Marker
    export const MK191: Marker
    export const MK192: Marker
    export const MK193: Marker
    export const MK194: Marker
    export const MK195: Marker
    export const MK196: Marker
    export const MK197: Marker
    export const MK198: Marker
    export const MK199: Marker
    export const MK200: Marker
    export const MK201: Marker
    export const MK202: Marker
    export const MK203: Marker
    export const MK204: Marker
    export const MK205: Marker
    export const MK206: Marker
    export const MK207: Marker
    export const MK208: Marker
    export const MK209: Marker
    export const MK210: Marker
    export const MK211: Marker
    export const MK212: Marker
    export const MK213: Marker
    export const MK214: Marker
    export const MK215: Marker
    export const MK216: Marker
    export const MK217: Marker
    export const MK218: Marker
    export const MK219: Marker
    export const MK220: Marker
    export const MK221: Marker
    export const MK222: Marker
    export const MK223: Marker
    export const MK224: Marker
    export const MK225: Marker
    export const MK226: Marker
    export const MK227: Marker
    export const MK228: Marker
    export const MK229: Marker
    export const MK230: Marker
    export const MK231: Marker
    export const MK232: Marker
    export const MK233: Marker
    export const MK234: Marker
    export const MK235: Marker
    export const MK236: Marker
    export const MK237: Marker
    export const MK238: Marker
    export const MK239: Marker
    export const MK240: Marker
    export const MK241: Marker
    export const MK242: Marker
    export const MK243: Marker
    export const MK244: Marker
    export const MK245: Marker
    export const MK246: Marker
    export const MK247: Marker
    export const MK248: Marker
    export const MK249: Marker
    export const MK250: Marker
    export const MK251: Marker
    export const MK252: Marker
    export const MK253: Marker
    export const MK254: Marker
    export const MK255: Marker
}

/*export namespace Marker
{
    export const NUM_MARKERS = 256
    export const INVALID: Marker = (-1 as Marker)

    export function ensure(marker: Marker): Marker
    {
        if(marker < 0) return 0
        if(marker > 255) return 255
        return marker
    }

    export function validOrDefault(marker: Marker|undefined, defaultValue: Marker = Marker.INVALID): Marker
    {
        if(!marker || marker < 0 || marker > 255) return defaultValue
        return marker
    }

    export function isValid(marker: Marker) { return marker >= 0 && marker <= 255 }
}

for(let i = 0; i < 255; i++)
    (Marker as any)[`MK${i}`] = i*/


const _gnsi = gnsi()

export class Marker
{
    public static readonly NUM_MARKERS = 256
    public static readonly ALL: Marker[] = Marker.prepareMarkers()
    public static readonly INVALID = new Marker(-1)

    private readonly __Class_Marker__tag__ = "__Class_Marker__tag__"
    public readonly id: number

    private constructor(id: number)
    {
        this.id = id
    }

    get isValid() { return this.id >= 0 && this.id <= 255 }
    get isInvalid() { return this.id < 0 || this.id > 255 }

    get positionIndex()
    {
        if(this.isInvalid)
            return 0

        return _gnsi.ThisLevelHeader.Markers[this.id]
    }

    get location()
    {
        if(this.isInvalid)
            return Location.make2D(0, 0)

        return Location.makeXZ(_gnsi.ThisLevelHeader.Markers[this.id])
    }

    get mapCoords(): [x: number, z: number]
    {
        if(this.isInvalid)
            return [0, 0]

        const coords = Coord.makeXZFromPos(_gnsi.ThisLevelHeader.Markers[this.id])
        return [coords.XZ.X, coords.XZ.Z]
    }

    public static of(id: RawMarker)
    {
        if(typeof(id) === "number")
        {
            if(id < 0 || id > 255)
                return Marker.INVALID
            return Marker.ALL[id]
        }
        return id
    }

    public static asId(marker: RawMarker)
    {
        let id: number
        if(typeof(marker) === "number")
            id = marker
        else
            id = marker.id

        return id < -1 || id > 255 ? -1 : id
    }

    public static validOrDefault(marker: RawMarker|undefined, defaultValue: RawMarker = Marker.INVALID): RawMarker
    {
        if(!marker)
            return defaultValue

        if(typeof(marker) === "number")
            return marker < 0 || marker > 255 ? defaultValue : marker

        return marker.id < 0 || marker.id > 255 ? defaultValue : marker
    }

    public static isMarker(obj: any): obj is Marker
    {
        return obj && "__Class_Marker__tag__" in obj
    }

    private static prepareMarkers()
    {
        const markers: Marker[] = []
        for(let i = 0; i < 255; i++)
            markers.push(new Marker(i))
        return markers
    }
}

for(let i = 0; i < 255; i++)
    (Marker as any)[`MK${i}`] = Marker.ALL[i]
