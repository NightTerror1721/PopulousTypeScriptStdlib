import "./PopModules";
/** @noSelf */
export declare namespace Coord {
    type PopAbstractCoord = Coord2D | Coord3D | MapPosXZ;
    enum PopCoordType {
        COORD_2D = 0,
        COORD_3D = 1,
        MAP_POS_XZ = 2
    }
    function getType(coord: PopAbstractCoord): PopCoordType;
    function makeEmpty2D(): Coord2D;
    function makeEmpty3D(): Coord3D;
    function makeEmptyXZ(): MapPosXZ;
    function make2D(x: number, z: number): Coord2D;
    function make3D(x: number, y: number, z: number): Coord3D;
    function makeXZ(x: number, z: number): MapPosXZ;
    function makeXZFromPos(pos: number): MapPosXZ;
    function copy2D(other: Coord2D): Coord2D;
    function copy3D(other: Coord3D): Coord3D;
    function copyXZ(other: MapPosXZ): MapPosXZ;
    function copy(other: PopAbstractCoord): PopAbstractCoord;
    function from2DTo3D(coord: Coord2D): Coord3D;
    function from2DToXZ(coord: Coord2D): MapPosXZ;
    function from3DTo2D(coord: Coord3D): Coord2D;
    function from3DToXZ(coord: Coord3D): MapPosXZ;
    function fromXZTo2D(coord: MapPosXZ): Coord2D;
    function fromXZTo3D(coord: MapPosXZ): Coord3D;
    function to2D(coord: PopAbstractCoord): Coord2D;
    function to3D(coord: PopAbstractCoord): Coord3D;
    function toXZ(coord: PopAbstractCoord): MapPosXZ;
}
export declare abstract class Location {
    abstract get coordType(): Coord.PopCoordType;
    abstract get coord2D(): Coord2D;
    abstract get coord3D(): Coord3D;
    abstract get mapPosXZ(): MapPosXZ;
    abstract copy(): Location;
    abstract ensureOnGround(): Location;
    abstract ensureAboveGround(): Location;
    abstract centerOnBlock(): Location;
    abstract zeroOnBlock(): Location;
    abstract randomizeOnBlock(): Location;
    static of(this: void, coord: Coord.PopAbstractCoord): Location;
    static make2D(this: void, x: number, z: number): Location;
    static make2D(this: void, value: number): Location;
    static make2D(this: void, coords: Coord2D): Location;
    static make2D(this: void): Location;
    static make3D(this: void, x: number, y: number, z: number): Location;
    static make3D(this: void, x: number, y: number): Location;
    static make3D(this: void, value: number): Location;
    static make3D(this: void, coords: Coord3D): Location;
    static make3D(this: void): Location;
    static makeXZ(this: void, x: number, z: number): Location;
    static makeXZ(this: void, position: number): Location;
    static makeXZ(this: void, mapPos: MapPosXZ): Location;
    static makeXZ(this: void): Location;
}
