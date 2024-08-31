import { AI } from "../AI"
import { Time } from "../GameTime"
import { IMath } from "../IMath"
import { Marker } from "../Markers"
import "../PopModules"
import { Tribe } from "../Tribes"
import { BaseControllerScriptComponent } from "./Common"

type GuardEntryCondition = (this: void) => boolean

interface GuardEntry extends AI.MarkerEntryParameters
{
    condition?: GuardEntryCondition
}

interface GuardControllerState
{
    idx: number
    remainingSeconds: number
    lastUpdateSeconds: number
    initials: boolean
    registered: boolean
}

export interface GuardEntryRequest
{
    marker1: Marker
    marker2?: Marker
    braves?: number
    warriors?: number
    superWarriors?: number
    preachers?: number
    condition?: GuardEntryCondition
}

export class GuardController extends BaseControllerScriptComponent<GuardControllerState>
{
    private readonly _entries: GuardEntry[]
    private readonly _initialEntries: GuardEntry[]
    private _checkPeriod: number
    private _numPerTime: number
    private _nextValidEntry: number

    public constructor(tribe: Tribe)
    {
        super("GuardController", tribe)

        this._entries = []
        this._initialEntries = []
        this._checkPeriod = 30
        this._numPerTime = 1
        this._nextValidEntry = 0

        this.state = {
            idx: 0,
            remainingSeconds: this._checkPeriod,
            lastUpdateSeconds: Time.current().seconds,
            initials: false,
            registered: false
        }
    }

    public get checkPeriod(): typeof this._checkPeriod { return this._checkPeriod }
    public set checkPeriod(value: typeof this._checkPeriod) { this._checkPeriod = IMath.imax(0, value) }

    public get numPerTime(): typeof this._numPerTime { return this._numPerTime }
    public set numPerTime(value: typeof this._numPerTime) { this._numPerTime = IMath.imax(1, value) }

    public registerEntry(request: GuardEntryRequest[]): void
    public registerEntry(request: GuardEntryRequest): void
    public registerEntry(
        marker1: Marker,
        marker2?: Marker,
        braves?: number,
        warriors?: number,
        superWarriors?: number,
        preachers?: number,
        condition?: (this: void) => boolean
    ): void
    public registerEntry(
        marker1: Marker | GuardEntryRequest | GuardEntryRequest[],
        marker2?: Marker,
        braves?: number,
        warriors?: number,
        superWarriors?: number,
        preachers?: number,
        condition?: (this: void) => boolean
    ): void
    {
        if(Marker.isMarker(marker1))
        {
            this._registerEntry(
                this._entries,
                marker1,
                marker2,
                braves,
                warriors,
                superWarriors,
                preachers,
                condition
            )
        }
        else if("marker1" in marker1)
        {
            this._registerEntry(
                this._entries,
                marker1.marker1,
                marker1.marker2,
                marker1.braves,
                marker1.warriors,
                marker1.superWarriors,
                marker1.preachers,
                marker1.condition
            )
        }
        else
        {
            marker1.forEach(entry => {
                this._registerEntry(
                    this._entries,
                    entry.marker1,
                    entry.marker2,
                    entry.braves,
                    entry.warriors,
                    entry.superWarriors,
                    entry.preachers,
                    entry.condition
                )
            })
        }
    }

    public registerInitialEntry(request: GuardEntryRequest[]): void
    public registerInitialEntry(request: GuardEntryRequest): void
    public registerInitialEntry(
        marker1: Marker,
        marker2?: Marker,
        braves?: number,
        warriors?: number,
        superWarriors?: number,
        preachers?: number,
        condition?: (this: void) => boolean
    ): void
    public registerInitialEntry(
        marker1: Marker | GuardEntryRequest | GuardEntryRequest[],
        marker2?: Marker,
        braves?: number,
        warriors?: number,
        superWarriors?: number,
        preachers?: number,
        condition?: (this: void) => boolean
    ): void
    {
        if(Marker.isMarker(marker1))
        {
            this._registerEntry(
                this._initialEntries,
                marker1,
                marker2,
                braves,
                warriors,
                superWarriors,
                preachers,
                condition
            )
        }
        else if("marker1" in marker1)
        {
            this._registerEntry(
                this._initialEntries,
                marker1.marker1,
                marker1.marker2,
                marker1.braves,
                marker1.warriors,
                marker1.superWarriors,
                marker1.preachers,
                marker1.condition
            )
        }
        else
        {
            marker1.forEach(entry => {
                this._registerEntry(
                    this._initialEntries,
                    entry.marker1,
                    entry.marker2,
                    entry.braves,
                    entry.warriors,
                    entry.superWarriors,
                    entry.preachers,
                    entry.condition
                )
            })
        }
    }

    
    private registerEntriesToAI()
    {
        const state = this.state
        if(state.registered)
            return

        state.registered = true

        this._initialEntries.forEach(entry => this._tribe.ai.setMarkerEntry(entry))
        this._entries.forEach(entry => this._tribe.ai.setMarkerEntry(entry))
    }
    
    private updateEntries(delta: number): void
    {
        if(this._entries.length < 1)
            return

        const state = this.state
        state.remainingSeconds -= delta

        while(state.remainingSeconds <= 0)
        {
            state.remainingSeconds += this._checkPeriod

            const initialIdx = state.idx
            let remaining = this._numPerTime
            while(remaining > 0)
            {
                const entry = this._entries[state.idx]
                state.idx = state.idx % this._entries.length
                if(entry.condition === undefined || entry.condition())
                {
                    this._tribe.ai.executeMarkerEntries(entry.entry)
                    remaining -= 1
                }

                if(state.idx === initialIdx)
                    break
            }
        }
    }

    private updateInitialEntries(deltaTime: Time): void
    {
        if(!this.state.initials && deltaTime.isAtLeast(2))
        {
            this.state.initials = true
            this._initialEntries.forEach(entry => this._tribe.ai.executeMarkerEntries(entry.entry))
        }
    }

    private _registerEntry(
        entriesList: GuardEntry[],
        marker1: Marker,
        marker2?: Marker,
        braves?: number,
        warriors?: number,
        superWarriors?: number,
        preachers?: number,
        condition?: (this: void) => boolean
    ): void
    {
        const entry: GuardEntry = {
            entry: this._nextValidEntry,
            marker1: marker1,
            marker2: marker2,
            braves: braves,
            warriors: warriors,
            superWarriors: superWarriors,
            preachers: preachers,
            condition: condition
        }

        this._nextValidEntry++
        entriesList.push(entry)
        //this._tribe.ai.setMarkerEntry(entry)
    }

    protected update(deltaTime: Time): void
    {
        if(deltaTime.turn === 0)
            this.registerEntriesToAI()

        const state = this.state
        const currentSeconds = deltaTime.seconds
        const delta = currentSeconds - state.lastUpdateSeconds
        if(delta > 0)
        {
            state.lastUpdateSeconds = currentSeconds
            this.updateEntries(delta)
            this.updateInitialEntries(deltaTime)
        }
    }
}
