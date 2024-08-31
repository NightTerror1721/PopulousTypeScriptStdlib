import "./PopModules"

declare function getmetatable(this: void, object: any): any


/** @noSelf */
export namespace Coord
{
    export type PopAbstractCoord = Coord2D | Coord3D | MapPosXZ
    export enum PopCoordType
    {
        COORD_2D,
        COORD_3D,
        MAP_POS_XZ
    }

    function getCoordClassName(this: void, cls: any): string
    {
        return getmetatable(cls.new()).__name
    }

    const PopCoordTypeName = {
        Coord2D: getCoordClassName(Coord2D),
        Coord3D: getCoordClassName(Coord2D),
        MapPosXZ: getCoordClassName(Coord2D)
    }
    const PopCoordTypeByName = {
        [PopCoordTypeName.Coord2D]: PopCoordType.COORD_2D,
        [PopCoordTypeName.Coord3D]: PopCoordType.COORD_3D,
        [PopCoordTypeName.MapPosXZ]: PopCoordType.MAP_POS_XZ,
        [PopCoordTypeName.Coord2D + "*"]: PopCoordType.COORD_2D,
        [PopCoordTypeName.Coord3D + "*"]: PopCoordType.COORD_3D,
        [PopCoordTypeName.MapPosXZ + "*"]: PopCoordType.MAP_POS_XZ
    }

    

    export function getType(coord: PopAbstractCoord): PopCoordType
    {
        return PopCoordTypeByName[getmetatable(coord).__name]
    }
    
    export function makeEmpty2D() { return Coord2D.new() }
    export function makeEmpty3D() { return Coord3D.new() }
    export function makeEmptyXZ() { return MapPosXZ.new() }

    export function make2D(x: number, z: number)
    {
        const coord = makeEmpty2D()
        coord.Xpos = x
        coord.Zpos = z
        return coord
    }

    export function make3D(x: number, y: number, z: number)
    {
        const coord = makeEmpty3D()
        coord.Xpos = x
        coord.Ypos = y
        coord.Zpos = z
        return coord
    }

    export function makeXZ(x: number, z: number)
    {
        const coord = makeEmptyXZ()
        coord.XZ.X = x
        coord.XZ.Z = z
        return coord
    }

    export function makeXZFromPos(pos: number)
    {
        const coord = makeEmptyXZ()
        coord.Pos = pos
        return coord
    }

    export function copy2D(other: Coord2D) { return make2D(other.Xpos, other.Zpos) }
    export function copy3D(other: Coord3D) { return make3D(other.Xpos, other.Ypos, other.Zpos) }
    export function copyXZ(other: MapPosXZ) { return makeXZFromPos(other.Pos) }

    export function copy(other: PopAbstractCoord): PopAbstractCoord
    {
        switch(Coord.getType(other))
        {
            case PopCoordType.COORD_2D: return Coord.copy2D(<Coord2D>other)
            case PopCoordType.COORD_3D: return Coord.copy3D(<Coord3D>other)
            case PopCoordType.MAP_POS_XZ: return Coord.copyXZ(<MapPosXZ>other)
            default: return Coord.makeEmpty3D()
        }
    }

    export function from2DTo3D(coord: Coord2D)
    {
        const cpy = makeEmpty3D()
        coord2D_to_coord3D(coord, cpy)
        return cpy
    }
    export function from2DToXZ(coord: Coord2D)
    {
        const cpy = makeEmptyXZ()
        cpy.Pos = world_coord2d_to_map_idx(coord)
        return cpy
    }

    export function from3DTo2D(coord: Coord3D)
    {
        const cpy = makeEmpty2D()
        coord3D_to_coord2D(coord, cpy)
        return cpy
    }
    export function from3DToXZ(coord: Coord3D)
    {
        const cpy = makeEmptyXZ()
        cpy.Pos = world_coord3d_to_map_idx(coord)
        return cpy
    }

    export function fromXZTo2D(coord: MapPosXZ)
    {
        const cpy = makeEmpty2D()
        map_idx_to_world_coord2d(coord.Pos, cpy)
        return cpy
    }
    export function fromXZTo3D(coord: MapPosXZ)
    {
        const cpy = makeEmpty3D()
        map_idx_to_world_coord3d(coord.Pos, cpy)
        return cpy
    }

    export function to2D(coord: PopAbstractCoord)
    {
        switch(Coord.getType(coord))
        {
            case PopCoordType.COORD_2D: return Coord.copy2D(<Coord2D>coord)
            case PopCoordType.COORD_3D: return Coord.from3DTo2D(<Coord3D>coord)
            case PopCoordType.MAP_POS_XZ: return Coord.fromXZTo2D(<MapPosXZ>coord)
            default: return Coord.makeEmpty2D()
        }
    }

    export function to3D(coord: PopAbstractCoord)
    {
        switch(Coord.getType(coord))
        {
            case PopCoordType.COORD_2D: return Coord.from2DTo3D(<Coord2D>coord)
            case PopCoordType.COORD_3D: return Coord.copy3D(<Coord3D>coord)
            case PopCoordType.MAP_POS_XZ: return Coord.fromXZTo3D(<MapPosXZ>coord)
            default: return Coord.makeEmpty3D()
        }
    }

    export function toXZ(coord: PopAbstractCoord)
    {
        switch(Coord.getType(coord))
        {
            case PopCoordType.COORD_2D: return Coord.from2DToXZ(<Coord2D>coord)
            case PopCoordType.COORD_3D: return Coord.from3DToXZ(<Coord3D>coord)
            case PopCoordType.MAP_POS_XZ: return Coord.copyXZ(<MapPosXZ>coord)
            default: return Coord.makeEmptyXZ()
        }
    }
}


export abstract class Location
{
    public abstract get coordType(): Coord.PopCoordType

    public abstract get coord2D(): Coord2D
    public abstract get coord3D(): Coord3D
    public abstract get mapPosXZ(): MapPosXZ

    public abstract copy(): Location

    public abstract ensureOnGround(): Location
    public abstract ensureAboveGround(): Location

    public abstract centerOnBlock(): Location
    public abstract zeroOnBlock(): Location
    public abstract randomizeOnBlock(): Location

    public static of(this: void, coord: Coord.PopAbstractCoord): Location
    {
        switch(Coord.getType(coord))
        {
            case Coord.PopCoordType.COORD_2D: return new Location2D(<Coord2D>coord)
            case Coord.PopCoordType.COORD_3D: return new Location3D(<Coord3D>coord)
            case Coord.PopCoordType.MAP_POS_XZ: return new LocationXZ(<MapPosXZ>coord)
            default: return new Location3D(Coord.makeEmpty3D())
        }
    }

    public static make2D(this: void, x: number, z: number): Location
    public static make2D(this: void, value: number): Location
    public static make2D(this: void, coords: Coord2D): Location
    public static make2D(this: void): Location
    public static make2D(this: void, x?: Coord2D|number, z?: number): Location
    {
        if(x)
        {
            if(z) return new Location2D(Coord.make2D(x as number, z))
            if(typeof x === "number") return new Location2D(Coord.make2D(x, x))
            return new Location2D(x)
        }
        return new Location2D(Coord.makeEmpty2D())
    }

    public static make3D(this: void, x: number, y: number, z: number): Location
    public static make3D(this: void, x: number, y: number): Location
    public static make3D(this: void, value: number): Location
    public static make3D(this: void, coords: Coord3D): Location
    public static make3D(this: void): Location
    public static make3D(this: void, x?: Coord3D|number, y?: number, z?: number): Location
    {
        if(x)
        {
            if(y)
            {
                if(z) return new Location3D(Coord.make3D(x as number, y, z))
                return new Location3D(Coord.make3D(x as number, y, 0))
            }
            if(typeof x === "number") return new Location3D(Coord.make3D(x, x, x))
            return new Location3D(x)
        }
        return new Location3D(Coord.makeEmpty3D())
    }

    public static makeXZ(this: void, x: number, z: number): Location
    public static makeXZ(this: void, position: number): Location
    public static makeXZ(this: void, mapPos: MapPosXZ): Location
    public static makeXZ(this: void): Location
    public static makeXZ(this: void, x?: MapPosXZ|number, z?: number): Location
    {
        if(x)
        {
            if(z) return new LocationXZ(Coord.makeXZ(x as number, z))
            if(typeof x === "number") return new LocationXZ(Coord.makeXZFromPos(x))
            return new LocationXZ(x)
        }
        return new LocationXZ(Coord.makeEmptyXZ())
    }
}

class Location2D extends Location
{
    private readonly coord: Coord2D

    public constructor(coord: Coord2D)
    {
        super()
        this.coord = coord
    }

    public get coordType(): Coord.PopCoordType { return Coord.PopCoordType.COORD_2D }

    public get coord2D(): Coord2D { return this.coord }
    public get coord3D(): Coord3D { return Coord.from2DTo3D(this.coord) }
    public get mapPosXZ(): MapPosXZ { return Coord.from2DToXZ(this.coord) }

    public copy(): Location { return new Location2D(Coord.copy2D(this.coord)) }

    public ensureOnGround(): Location { return this }
    public ensureAboveGround(): Location { return this }

    public centerOnBlock(): Location { centre_coord_on_block(this.coord); return this }
    public zeroOnBlock(): Location { zero_coord_on_block(this.coord); return this }
    public randomizeOnBlock(): Location { randomize_coord_on_block(this.coord); return this }
}

class Location3D extends Location
{
    private readonly coord: Coord3D

    public constructor(coord: Coord3D)
    {
        super()
        this.coord = coord
    }

    public get coordType(): Coord.PopCoordType { return Coord.PopCoordType.COORD_3D }

    public get coord2D(): Coord2D { return Coord.from3DTo2D(this.coord) }
    public get coord3D(): Coord3D { return this.coord }
    public get mapPosXZ(): MapPosXZ { return Coord.from3DToXZ(this.coord) }

    public copy(): Location { return new Location3D(Coord.copy3D(this.coord)) }

    public ensureOnGround(): Location { ensure_point_on_ground(this.coord); return this }
    public ensureAboveGround(): Location { ensure_point_above_ground(this.coord); return this }

    public centerOnBlock(): Location { centre_coord3d_on_block(this.coord); return this }
    public zeroOnBlock(): Location { zero_coord_on_block(this.coord); return this }
    public randomizeOnBlock(): Location { return this }
}

class LocationXZ extends Location
{
    private readonly coord: MapPosXZ

    public constructor(coord: MapPosXZ)
    {
        super()
        this.coord = coord
    }

    public get coordType(): Coord.PopCoordType { return Coord.PopCoordType.MAP_POS_XZ }

    public get coord2D(): Coord2D { return Coord.fromXZTo2D(this.coord) }
    public get coord3D(): Coord3D { return Coord.fromXZTo3D(this.coord) }
    public get mapPosXZ(): MapPosXZ { return this.coord }

    public copy(): Location { return new LocationXZ(Coord.copyXZ(this.coord)) }

    public ensureOnGround(): Location { return this }
    public ensureAboveGround(): Location { return this }

    public centerOnBlock(): Location { return this }
    public zeroOnBlock(): Location { return this }
    public randomizeOnBlock(): Location { return this }
}
