/** @noSelfInFile */
import { Location } from "./Location";
import "./PopModules";
export type RawMarker = Marker | number;
export declare namespace Marker {
    const MK0: Marker;
    const MK1: Marker;
    const MK2: Marker;
    const MK3: Marker;
    const MK4: Marker;
    const MK5: Marker;
    const MK6: Marker;
    const MK7: Marker;
    const MK8: Marker;
    const MK9: Marker;
    const MK10: Marker;
    const MK11: Marker;
    const MK12: Marker;
    const MK13: Marker;
    const MK14: Marker;
    const MK15: Marker;
    const MK16: Marker;
    const MK17: Marker;
    const MK18: Marker;
    const MK19: Marker;
    const MK20: Marker;
    const MK21: Marker;
    const MK22: Marker;
    const MK23: Marker;
    const MK24: Marker;
    const MK25: Marker;
    const MK26: Marker;
    const MK27: Marker;
    const MK28: Marker;
    const MK29: Marker;
    const MK30: Marker;
    const MK31: Marker;
    const MK32: Marker;
    const MK33: Marker;
    const MK34: Marker;
    const MK35: Marker;
    const MK36: Marker;
    const MK37: Marker;
    const MK38: Marker;
    const MK39: Marker;
    const MK40: Marker;
    const MK41: Marker;
    const MK42: Marker;
    const MK43: Marker;
    const MK44: Marker;
    const MK45: Marker;
    const MK46: Marker;
    const MK47: Marker;
    const MK48: Marker;
    const MK49: Marker;
    const MK50: Marker;
    const MK51: Marker;
    const MK52: Marker;
    const MK53: Marker;
    const MK54: Marker;
    const MK55: Marker;
    const MK56: Marker;
    const MK57: Marker;
    const MK58: Marker;
    const MK59: Marker;
    const MK60: Marker;
    const MK61: Marker;
    const MK62: Marker;
    const MK63: Marker;
    const MK64: Marker;
    const MK65: Marker;
    const MK66: Marker;
    const MK67: Marker;
    const MK68: Marker;
    const MK69: Marker;
    const MK70: Marker;
    const MK71: Marker;
    const MK72: Marker;
    const MK73: Marker;
    const MK74: Marker;
    const MK75: Marker;
    const MK76: Marker;
    const MK77: Marker;
    const MK78: Marker;
    const MK79: Marker;
    const MK80: Marker;
    const MK81: Marker;
    const MK82: Marker;
    const MK83: Marker;
    const MK84: Marker;
    const MK85: Marker;
    const MK86: Marker;
    const MK87: Marker;
    const MK88: Marker;
    const MK89: Marker;
    const MK90: Marker;
    const MK91: Marker;
    const MK92: Marker;
    const MK93: Marker;
    const MK94: Marker;
    const MK95: Marker;
    const MK96: Marker;
    const MK97: Marker;
    const MK98: Marker;
    const MK99: Marker;
    const MK100: Marker;
    const MK101: Marker;
    const MK102: Marker;
    const MK103: Marker;
    const MK104: Marker;
    const MK105: Marker;
    const MK106: Marker;
    const MK107: Marker;
    const MK108: Marker;
    const MK109: Marker;
    const MK110: Marker;
    const MK111: Marker;
    const MK112: Marker;
    const MK113: Marker;
    const MK114: Marker;
    const MK115: Marker;
    const MK116: Marker;
    const MK117: Marker;
    const MK118: Marker;
    const MK119: Marker;
    const MK120: Marker;
    const MK121: Marker;
    const MK122: Marker;
    const MK123: Marker;
    const MK124: Marker;
    const MK125: Marker;
    const MK126: Marker;
    const MK127: Marker;
    const MK128: Marker;
    const MK129: Marker;
    const MK130: Marker;
    const MK131: Marker;
    const MK132: Marker;
    const MK133: Marker;
    const MK134: Marker;
    const MK135: Marker;
    const MK136: Marker;
    const MK137: Marker;
    const MK138: Marker;
    const MK139: Marker;
    const MK140: Marker;
    const MK141: Marker;
    const MK142: Marker;
    const MK143: Marker;
    const MK144: Marker;
    const MK145: Marker;
    const MK146: Marker;
    const MK147: Marker;
    const MK148: Marker;
    const MK149: Marker;
    const MK150: Marker;
    const MK151: Marker;
    const MK152: Marker;
    const MK153: Marker;
    const MK154: Marker;
    const MK155: Marker;
    const MK156: Marker;
    const MK157: Marker;
    const MK158: Marker;
    const MK159: Marker;
    const MK160: Marker;
    const MK161: Marker;
    const MK162: Marker;
    const MK163: Marker;
    const MK164: Marker;
    const MK165: Marker;
    const MK166: Marker;
    const MK167: Marker;
    const MK168: Marker;
    const MK169: Marker;
    const MK170: Marker;
    const MK171: Marker;
    const MK172: Marker;
    const MK173: Marker;
    const MK174: Marker;
    const MK175: Marker;
    const MK176: Marker;
    const MK177: Marker;
    const MK178: Marker;
    const MK179: Marker;
    const MK180: Marker;
    const MK181: Marker;
    const MK182: Marker;
    const MK183: Marker;
    const MK184: Marker;
    const MK185: Marker;
    const MK186: Marker;
    const MK187: Marker;
    const MK188: Marker;
    const MK189: Marker;
    const MK190: Marker;
    const MK191: Marker;
    const MK192: Marker;
    const MK193: Marker;
    const MK194: Marker;
    const MK195: Marker;
    const MK196: Marker;
    const MK197: Marker;
    const MK198: Marker;
    const MK199: Marker;
    const MK200: Marker;
    const MK201: Marker;
    const MK202: Marker;
    const MK203: Marker;
    const MK204: Marker;
    const MK205: Marker;
    const MK206: Marker;
    const MK207: Marker;
    const MK208: Marker;
    const MK209: Marker;
    const MK210: Marker;
    const MK211: Marker;
    const MK212: Marker;
    const MK213: Marker;
    const MK214: Marker;
    const MK215: Marker;
    const MK216: Marker;
    const MK217: Marker;
    const MK218: Marker;
    const MK219: Marker;
    const MK220: Marker;
    const MK221: Marker;
    const MK222: Marker;
    const MK223: Marker;
    const MK224: Marker;
    const MK225: Marker;
    const MK226: Marker;
    const MK227: Marker;
    const MK228: Marker;
    const MK229: Marker;
    const MK230: Marker;
    const MK231: Marker;
    const MK232: Marker;
    const MK233: Marker;
    const MK234: Marker;
    const MK235: Marker;
    const MK236: Marker;
    const MK237: Marker;
    const MK238: Marker;
    const MK239: Marker;
    const MK240: Marker;
    const MK241: Marker;
    const MK242: Marker;
    const MK243: Marker;
    const MK244: Marker;
    const MK245: Marker;
    const MK246: Marker;
    const MK247: Marker;
    const MK248: Marker;
    const MK249: Marker;
    const MK250: Marker;
    const MK251: Marker;
    const MK252: Marker;
    const MK253: Marker;
    const MK254: Marker;
    const MK255: Marker;
}
export declare class Marker {
    static readonly NUM_MARKERS = 256;
    static readonly ALL: Marker[];
    static readonly INVALID: Marker;
    private readonly __Class_Marker__tag__;
    readonly id: number;
    private constructor();
    get isValid(): boolean;
    get isInvalid(): boolean;
    get positionIndex(): number;
    get location(): Location;
    get mapCoords(): [x: number, z: number];
    static of(id: RawMarker): Marker;
    static asId(marker: RawMarker): number;
    static validOrDefault(marker: RawMarker | undefined, defaultValue?: RawMarker): RawMarker;
    static isMarker(obj: any): obj is Marker;
    private static prepareMarkers;
}
