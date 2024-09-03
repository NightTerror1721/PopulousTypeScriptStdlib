import { IMath } from "./IMath"
import { Marker, RawMarker } from "./Markers"

export enum PatrolMode
{
    CIRCLE,
    PATH
}

export class Patrol
{
    public static readonly MAX_PATROLS = 16

    public readonly id: number
    public readonly tribe: TribeID
    
    public mode: PatrolMode
    
    private _marker1: Marker
    private _marker2: Marker

    private _braves: number
    private _warriors: number
    private _superWarriors: number
    private _preachers: number

    public constructor(id: number, tribe: TribeID)
    {
        this.id = id
        this.tribe = tribe

        this.mode = PatrolMode.CIRCLE

        this._marker1 = Marker.INVALID
        this._marker2 = Marker.INVALID
        this._braves = 0
        this._warriors = 0
        this._superWarriors = 0
        this._preachers = 0
    }

    public get centerMarker() { return this._marker1 }
    public set centerMarker(marker: RawMarker) { this._marker1 = Marker.of(marker) }

    public get startMarker() { return this._marker1 }
    public set startMarker(marker: RawMarker) { this._marker1 = Marker.of(marker) }

    public get endMarker() { return this._marker2 }
    public set endMarker(marker: RawMarker) { this._marker2 = Marker.of(marker) }

    public get braves() { return this._braves }
    public set braves(amount) { this._braves = IMath.inatural(amount) }

    public get warriors() { return this._warriors }
    public set warriors(amount) { this._warriors = IMath.inatural(amount) }

    public get superWarriors() { return this._superWarriors }
    public set superWarriors(amount) { this._superWarriors = IMath.inatural(amount) }

    public get preachers() { return this._preachers }
    public set preachers(amount) { this._preachers = IMath.inatural(amount) }

    public setCircleMode(center: RawMarker)
    {
        this.mode = PatrolMode.CIRCLE
        this._marker1 = Marker.of(center)
        this._marker2 = Marker.INVALID
    }

    public setPathMode(start: RawMarker, end: RawMarker)
    {
        this.mode = PatrolMode.CIRCLE
        this._marker1 = Marker.of(start)
        this._marker2 = Marker.of(end)
    }

    public setPersons(braves?: number, warriors?: number, superWarriors?: number, preachers?: number): void
    public setPersons(persons: PatrolPersonsData): void
    public setPersons(braves?: number|PatrolPersonsData, warriors?: number, superWarriors?: number, preachers?: number): void
    {
        if(braves && typeof(braves) !== "number")
        {
            this._braves = braves.braves ? IMath.inatural(braves.braves) : 0
            this._warriors = braves.warriors ? IMath.inatural(braves.warriors) : 0
            this._superWarriors = braves.superWarriors ? IMath.inatural(braves.superWarriors) : 0
            this._preachers = braves.preachers ? IMath.inatural(braves.preachers) : 0
        }
        else
        {
            this._braves = braves ? IMath.inatural(braves) : 0
            this._warriors = warriors ? IMath.inatural(warriors) : 0
            this._superWarriors = superWarriors ? IMath.inatural(superWarriors) : 0
            this._preachers = preachers ? IMath.inatural(preachers) : 0
        }
    }

    public set(data: PatrolCircleSet): void
    public set(data: PatrolPathSet): void
    public set(data: PatrolCircleSet | PatrolPathSet): void
    {
        if(data.mode === PatrolMode.CIRCLE)
            this.setCircleMode(data.center)
        else
            this.setPathMode(data.start, data.end)
        this.setPersons(data)
    }
}

type PatrolPersonsData = {
    braves?: number,
    warriors?: number,
    superWarriors?: number,
    preachers?: number
}

type PatrolCircleSet = PatrolPersonsData & {
    mode: PatrolMode.CIRCLE,
    center: RawMarker
}

type PatrolPathSet = PatrolPersonsData & {
    mode: PatrolMode.PATH,
    start: RawMarker,
    end: RawMarker
}
