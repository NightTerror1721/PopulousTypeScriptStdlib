import { Time } from "../GameTime"
import { IMath } from "../IMath"
import { LocalDataObject } from "../Serialization"
import { Tribe } from "../Tribes"
import { BaseEnvironmentControllerScriptComponent } from "./Common"

export interface Event<EventDataType extends LocalDataObject = LocalDataObject>
{
    readonly data: EventDataType
    readonly action: EventAction<EventDataType>
    readonly condition?: EventCondition<EventDataType> | { condition: EventCondition<EventDataType>; frequency?: Time, delay?: Time }
    readonly onInit?: EventOnInit<EventDataType>
    readonly onUpdate?: EventOnUpdate<EventDataType> | { onUpdate: EventOnUpdate<EventDataType>; frequency?: Time, delay?: Time }
    readonly times?: number
    readonly once?: boolean
}

export type EventCondition<DT extends LocalDataObject> = (this: void, event: Event<DT>) => boolean
export namespace EventCondition
{
    export function and<DT extends LocalDataObject>(cnd1: EventCondition<DT>, cnd2: EventCondition<DT>): EventCondition<DT>
    export function and<DT extends LocalDataObject>(cnd1: EventCondition<DT>, ...cnds: EventCondition<DT>[]): EventCondition<DT>
    export function and<DT extends LocalDataObject>(cnds: EventCondition<DT>[]): EventCondition<DT>
    export function and<DT extends LocalDataObject>(
        cnd1: EventCondition<DT>|EventCondition<DT>[],
        cnds?: EventCondition<DT>|EventCondition<DT>[]
    ): EventCondition<DT> {
        if(!cnds)
        {
            if(typeof(cnd1) === "function")
                return cnd1

            return (event: Event<DT>) => {
                for(let cnd of cnd1)
                {
                    if(!cnd(event))
                        return false
                }
                return true
            }
        }

        if(typeof(cnds) === "function")
        {
            if(typeof(cnd1) === "function")
                return (event: Event<DT>) => cnd1(event) && cnds(event)

            if(cnd1.length < 1)
                return cnds

            return (event: Event<DT>) => cnd1[0](event) && cnds(event)
        }

        if(cnds.length < 1)
        {
            if(typeof(cnd1) === "function")
                return cnd1

            return (_: Event<DT>) => true
        }

        if(typeof(cnd1) === "function")
        {
            return (event: Event<DT>) => {
                if(!cnd1(event))
                    return false
                
                for(let cnd of cnds)
                {
                    if(!cnd(event))
                        return false
                }
                return true
            }
        }

        return (event: Event<DT>) => {
            for(let cnd of cnd1)
            {
                if(!cnd(event))
                    return false
            }
            for(let cnd of cnds)
            {
                if(!cnd(event))
                    return false
            }
            return true
        }
    }

    export function or<DT extends LocalDataObject>(cnd1: EventCondition<DT>, cnd2: EventCondition<DT>): EventCondition<DT>
    export function or<DT extends LocalDataObject>(cnd1: EventCondition<DT>, ...cnds: EventCondition<DT>[]): EventCondition<DT>
    export function or<DT extends LocalDataObject>(cnds: EventCondition<DT>[]): EventCondition<DT>
    export function or<DT extends LocalDataObject>(
        cnd1: EventCondition<DT>|EventCondition<DT>[],
        cnds?: EventCondition<DT>|EventCondition<DT>[]
    ): EventCondition<DT> {
        if(!cnds)
        {
            if(typeof(cnd1) === "function")
                return cnd1

            return (event: Event<DT>) => {
                for(let cnd of cnd1)
                {
                    if(cnd(event))
                        return true
                }
                return false
            }
        }

        if(typeof(cnds) === "function")
        {
            if(typeof(cnd1) === "function")
                return (event: Event<DT>) => cnd1(event) || cnds(event)

            if(cnd1.length < 1)
                return cnds

            return (event: Event<DT>) => cnd1[0](event) || cnds(event)
        }

        if(cnds.length < 1)
        {
            if(typeof(cnd1) === "function")
                return cnd1

            return (_: Event<DT>) => true
        }

        if(typeof(cnd1) === "function")
        {
            return (event: Event<DT>) => {
                if(cnd1(event))
                    return true
                
                for(let cnd of cnds)
                {
                    if(cnd(event))
                        return true
                }
                return false
            }
        }

        return (event: Event<DT>) => {
            for(let cnd of cnd1)
            {
                if(cnd(event))
                    return true
            }
            for(let cnd of cnds)
            {
                if(cnd(event))
                    return true
            }
            return false
        }
    }

    export function not<DT extends LocalDataObject>(cnd: EventCondition<DT>): EventCondition<DT>
    {
        return (event: Event<DT>) => !cnd(event)
    }
}

export type EventAction<DT extends LocalDataObject> = (this: void, event: Event<DT>) => void
export type EventOnInit<DT extends LocalDataObject> = (this: void, event: Event<DT>) => void
export type EventOnUpdate<DT extends LocalDataObject> = (this: void, event: Event<DT>, time: Time) => void



class EventHandler
{
    private readonly _event: Event<LocalDataObject>
    private readonly _action: EventAction<LocalDataObject>
    private readonly _condition?: EventCondition<LocalDataObject>
    private readonly _conditionFrequencyTurns: number
    private readonly _conditionDelayTurns: number
    private readonly _onInit?: EventOnInit<LocalDataObject>
    private readonly _onUpdate?: EventOnUpdate<LocalDataObject>
    private readonly _onUpdateFrequencyTurns: number
    private readonly _onUpdateDelayTurns: number
    private _times?: number
    private _expired: boolean

    constructor(event: Event<LocalDataObject>)
    {
        this._event = event
        this._action = event.action
        this._condition = !event.condition ? undefined : typeof(event.condition) === "function" ? event.condition : event.condition.condition
        if(this._condition && event.condition && typeof(event.condition) !== "function")
        {
            this._conditionFrequencyTurns = event.condition.frequency && event.condition.frequency.turn > 0
                ? IMath.toInteger(event.condition.frequency.turn)
                : 1
            this._conditionDelayTurns = event.condition.delay && event.condition.delay.turn >= 0
                ? IMath.toInteger(event.condition.delay.turn)
                : 0
        }
        else
        {
            this._conditionFrequencyTurns = 1
            this._conditionDelayTurns = 0
        }
        this._onInit = event.onInit
        this._onUpdate = !event.onUpdate ? undefined : typeof(event.onUpdate) === "function" ? event.onUpdate : event.onUpdate.onUpdate
        if(this._onUpdate && event.onUpdate && typeof(event.onUpdate) !== "function")
        {
            this._onUpdateFrequencyTurns = event.onUpdate.frequency && event.onUpdate.frequency.turn > 0
                ? IMath.toInteger(event.onUpdate.frequency.turn)
                : 1
            this._onUpdateDelayTurns = event.onUpdate.delay && event.onUpdate.delay.turn >= 0
                ? IMath.toInteger(event.onUpdate.delay.turn)
                : 0
        }
        else
        {
            this._onUpdateFrequencyTurns = 1
            this._onUpdateDelayTurns = 0
        }
        if(event.once)
            this._times = 1
        else
            this._times = event.times && event.times > 0 ? IMath.imax(1, event.times) : undefined
        this._expired = false
    }

    get isExpired() { return this._expired }

    initiate()
    {
        if(this._onInit)
            this._onInit(this._event)
    }

    update(time: Time)
    {
        if(this._onUpdate && time.everyTurns(this._onUpdateFrequencyTurns, this._onUpdateDelayTurns))
            this._onUpdate(this._event, time)
    }

    check(time: Time)
    {
        return time.everyTurns(this._conditionFrequencyTurns, this._conditionDelayTurns) && (!this._condition || this._condition(this._event))
    }

    run()
    {
        this._action(this._event)
        if(this._times)
        {
            this._times--
            if(this._times < 1)
            {
                this._times = 0
                this._expired = true
            }
        }
    }

    load(backup: EntryHandlerBackupData)
    {
        for(let [key, value] of Object.entries(backup.data))
            this._event.data[key] = value
        this._times = backup.times
        this._expired = backup.expired
    }

    save(): EntryHandlerBackupData
    {
        return {
            data: Object.assign(this._event.data),
            times: this._times,
            expired: this._expired
        }
    }
}

interface EntryHandlerBackupData
{
    data: LocalDataObject
    times?: number
    expired: boolean
}

interface EventControllerState
{
    initiated: boolean
    backups: EntryHandlerBackupData[]
}



export class EventController extends BaseEnvironmentControllerScriptComponent<EventControllerState>
{
    private readonly _events: EventHandler[]

    public constructor()
    {
        super("EventController")

        this._events = []

        this.state = {
            initiated: false,
            backups: []
        }
    }

    public registerEvent<DT extends LocalDataObject>(event: Event<DT>): void
    public registerEvent<DT extends LocalDataObject>(event: Event<DT>[]): void
    public registerEvent<DT extends LocalDataObject>(event: Event<DT>|Event<DT>[])
    {
        if(this.state.initiated)
            error("Cannot register events after game begins")

        if("data" in event)
        {
            const handler = new EventHandler(event as any)
            this._events.push(handler)
        }
        else
        {
            for(let evt of event)
            {
                const handler = new EventHandler(evt as any)
                this._events.push(handler)
            }
        }
    }

    protected override update(time: Time): void
    {
        if(time.turn === 0)
        {
            if(!this.state.initiated)
            {
                this.state.initiated = true
                this._events.forEach(e => e.initiate())
            }
        }
        
        for(let event of this._events)
        {
            if(!event.isExpired)
            {
                event.update(time)
                if(event.check(time))
                    event.run()
            }
        }
    }

    protected override onPreSave(): void
    {
        const backups: EntryHandlerBackupData[] = []

        for(let event of this._events)
            backups.push(event.save())

        this.state.backups = backups
    }

    protected override onPostLoad(): void
    {
        const backups = this.state.backups
        const len = IMath.imin(this._events.length, backups.length)
        for(let i = 0; i < len; i++)
            this._events[i].load(backups[i])
    }
}
