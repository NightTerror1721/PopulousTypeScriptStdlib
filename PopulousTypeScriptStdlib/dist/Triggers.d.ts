/** @noSelfInFile */
import { Location } from "./Location";
import { RawMarker } from "./Markers";
import "./PopModules";
export declare namespace Trigger {
    function fireLevelWon(): void;
    function fireLevelLost(): void;
    function fireAtMarker(marker: RawMarker): void;
    function fire(trigger: Thing, times?: number): void;
    function fireAtLocation(x: number, z: number, times?: number): void;
    function fireAtLocation(location: Location, times?: number): void;
    function getRemainingCounts(x: number, z: number): number;
    function getRemainingCounts(location: Location): number;
    function getRemainingOcurrences(x: number, z: number): number;
    function getRemainingOcurrences(location: Location): number;
}
