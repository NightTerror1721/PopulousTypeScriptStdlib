import "./PopModules"
import { Location } from "./Location"
import { PersonModel, PersonState, ThingType, createPerson } from "./Things"
import { Marker, RawMarker } from "./Markers"

const _gsi = gsi()

export namespace InternalPersonModel
{
    const Mapper: Record<number, PopScriptFollowerModel> = {
        [PersonModel.None]: PopScriptFollowerModel.INT_NO_SPECIFIC_PERSON,
        [PersonModel.Brave]: PopScriptFollowerModel.INT_BRAVE,
        [PersonModel.Warrior]: PopScriptFollowerModel.INT_WARRIOR,
        [PersonModel.Religious]: PopScriptFollowerModel.INT_RELIGIOUS,
        [PersonModel.Spy]: PopScriptFollowerModel.INT_SPY,
        [PersonModel.SuperWarrior]: PopScriptFollowerModel.INT_SUPER_WARRIOR,
        [PersonModel.MedicineMan]: PopScriptFollowerModel.INT_MEDICINE_MAN
    }

    export function of(model: PersonModel|undefined): PopScriptFollowerModel|undefined { return model ? Mapper[model] : undefined }
}

export const enum PersonOrientation
{
    North = 1000,
    NorthEast = 1250,
    East = 1500,
    SouthEast = 1750,
    South = 0,
    SouthWest = 250,
    West = 500,
    NorthWest = 750
}

const PersonOrders = {
    idle: {
        [PersonState.WaitAtPoint]: true,
        [PersonState.WaitFirstAppear]: true,
        [PersonState.Spare]: true,
        [PersonState.AwaitingCommand]: true,
        [PersonState.Selected]: true,
        [PersonState.ReselectWait]: true,
        [PersonState.GotoBaseAndWait]: true
    },
    running: {
        [PersonState.Wander]: true,
        [PersonState.BaseWander]: true
    },
    onHouse: {
        [PersonState.WaitAtBuilding]: true
    }
}

const ValidOrientations = {
    [PersonOrientation.North]: PersonOrientation.North,
    [PersonOrientation.NorthEast]: PersonOrientation.NorthEast,
    [PersonOrientation.East]: PersonOrientation.East,
    [PersonOrientation.SouthEast]: PersonOrientation.SouthEast,
    [PersonOrientation.South]: PersonOrientation.South,
    [PersonOrientation.SouthWest]: PersonOrientation.SouthWest,
    [PersonOrientation.West]: PersonOrientation.West,
    [PersonOrientation.NorthWest]: PersonOrientation.NorthWest
}
export function isValidPersonOrientation(orientation: PersonOrientation)
{
    return orientation in ValidOrientations
}

export type ForEachPersonAction = (this: void, person: Thing) => ForEachPersonActionResult | undefined
export const enum ForEachPersonActionResult
{
    Stop = 0,
    Continue = 1
}

export class Person
{
    public readonly tribe: TribeID
    public readonly model: PersonModel
    private readonly _player: Player

    public constructor(tribe: TribeID, model: PersonModel)
    {
        this.tribe = tribe
        this.model = model
        this._player = getPlayer(tribe)
    }

    get numInWorld(): number { return this._player.NumPeopleOfType[this.model - 1] }
    get numInBoats(): number { return this._player.NumLocalPeopleInBoats[this.model - 1] }
    get numInBalloons(): number { return this._player.NumLocalPeopleInBalloons[this.model - 1] }

    forEachInWorld(action: ForEachPersonAction): void
    {
        Person.forEachPerson(this.tribe, this.model, action)
    }

    createNewInWorld(location: Location, orientation?: PersonOrientation)
    {
        const person = createPerson(this.model, this.tribe, location)
        if(person !== undefined)
        {
            if(orientation && isValidPersonOrientation(orientation))
                person.AngleXZ = orientation
        }
        return person
    }





    static forEachPerson(this: void, tribe: TribeID,        models: PersonModel[],  action: ForEachPersonAction): void
    static forEachPerson(this: void, tribe: TribeID,        models: PersonModel,    action: ForEachPersonAction): void
    static forEachPerson(this: void, tribe: TribeID,        action: ForEachPersonAction): void
    static forEachPerson(this: void, models: PersonModel[], action: ForEachPersonAction): void
    static forEachPerson(this: void, models: PersonModel,   action: ForEachPersonAction): void
    static forEachPerson(this: void, action: ForEachPersonAction): void
    static forEachPerson(this: void,
        arg0: TribeID|PersonModel[]|PersonModel|ForEachPersonAction,
        arg1?: PersonModel[]|PersonModel|ForEachPersonAction,
        arg2?: ForEachPersonAction
    ): void
    {
        const tribe = typeof arg0 === "number" ? arg0 as TribeID : undefined
        const models = arg2 ? arg1 as PersonModel[]|PersonModel
            : arg1 ? (tribe ? undefined : arg0 as PersonModel[]|PersonModel)
            : undefined
        const action = arg2 ? arg2 : arg1 ? arg1 as ForEachPersonAction : arg0 as ForEachPersonAction

        if(typeof models === "number")
        {
            ProcessGlobalTypeList(ThingType.Person, person => {
                if((tribe && person.Owner !== tribe) || person.Model !== models)
                    return true

                const result = action(person)
                return result === undefined || result !== ForEachPersonActionResult.Stop
            })
        }
        else if(models === undefined || models.length < 1)
        {
            ProcessGlobalTypeList(ThingType.Person, person => {
                if(tribe && person.Owner !== tribe)
                    return true

                const result = action(person)
                return result === undefined || result !== ForEachPersonActionResult.Stop
            })
        }
        else
        {
            ProcessGlobalTypeList(ThingType.Person, person => {
                if((tribe && person.Owner !== tribe) || !(person.Model in models))
                    return true

                const result = action(person)
                return result === undefined || result !== ForEachPersonActionResult.Stop
            })
        }
    }

    getListOrderedByIdleFirst(requiredPeople: number): [list: Thing[], minimumRequired: boolean]
    {
        const lists: [idle: Thing[], running: Thing[], onHouse: Thing[], others: Thing[]] = [[], [], [], []]
        ProcessGlobalSpecialList(this.tribe, SpecialListType.PEOPLELIST, person => {
            if(person.Model !== this.model)
                return true

            const state = person.State
            if(state in PersonOrders.idle) lists[0].push(person)
            else if(state in PersonOrders.running) lists[1].push(person)
            else if(state in PersonOrders.onHouse) lists[2].push(person)
            else lists[3].push(person)

            return lists[0].length < requiredPeople
        })

        const result = lists[0]
        if(result.length >= requiredPeople)
            return [result, true]

        for(let i = 1; i < 4; i++)
        {
            for(const value of lists[i])
                result.push(value)

            if(result.length >= requiredPeople)
                return [result, true]
        }

        return [result, false]
    }

    static readonly Count = PersonModel.__COUNT 
}

export class Shaman extends Person
{
    public constructor(tribe: TribeID)
    {
        super(tribe, PersonModel.Shaman)
    }

    get thing(): Thing|undefined { return getShaman(this.tribe) }

    get isAlive(): boolean { return this.thing !== undefined }

    get isSelected(): boolean { return IS_SHAMAN_SELECTED(this.tribe) != 0 }

    clearShamanLeftClick(): void { CLEAR_SHAMAN_LEFT_CLICK(this.tribe) }
    clearShamanRightClick(): void { CLEAR_SHAMAN_RIGHT_CLICK(this.tribe) }

    get isShamanIconLeftClicked(): boolean { return IS_SHAMAN_ICON_LEFT_CLICKED(this.tribe) != 0 }
    get isShamanIconRightClicked(): boolean { return IS_SHAMAN_ICON_RIGHT_CLICKED(this.tribe) != 0 }

    get isAvailableForAttack(): boolean { return IS_SHAMAN_AVAILABLE_FOR_ATTACK(this.tribe) != 0 }

    trackToAngle(angle: number): void { TRACK_SHAMAN_TO_ANGLE(this.tribe, angle) }

    moveToMarker(marker: RawMarker): void { MOVE_SHAMAN_TO_MARKER(this.tribe, Marker.asId(marker)) }
}
