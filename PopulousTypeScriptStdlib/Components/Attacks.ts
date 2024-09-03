import { Time } from "../GameTime"
import { IMath } from "../IMath"
import { Marker } from "../Markers"
import { Person } from "../Persons"
import "../PopModules"
import Random from "../Random"
import { BuildingModel, PersonModel, SpellModel } from "../Things"
import { Tribe } from "../Tribes"
import { BaseControllerScriptComponent } from "./Common"

let __DebugMode = false
export function setAttackDebugModeEnabled(enabled: boolean) { __DebugMode = enabled }
export function isAttackDebugModeEnabled() { return __DebugMode }

interface AttackInternalParams
{
    attackerTribe?: Tribe
    targetTribe?: Tribe
    minPeople: number
    maxPeople: number
    damage: number
    targetType: PopScriptAttackTargetType
    targetModel: BuildingModel|PersonModel
    mode: PopScriptAttackType
    spell1: SpellModel
    spell2: SpellModel
    spell3: SpellModel
    marker1: Marker
    marker2: Marker
    lookAfter: boolean
    direction: number
    ignoreMana: boolean
    shaman: boolean
    optionalShama: boolean
    braves: number
    warriors: number
    superWarriors: number
    preachers: number
    spies: number
}

export interface AttackTemplate extends Partial<AttackInternalParams>
{
    everySeconds?: number
    randomExtraEverySeconds?: number
    delaySeconds?: number
    once?: boolean
    forceFirst?: boolean
    condition?: (this: void) => boolean
    override?: (this: void) => AttackTemplate
    callback?: (this: void, status: boolean) => void
}

class AttackControllerEntry
{
    public readonly entryId: number
    private readonly _template: AttackTemplate
    private readonly _controllerState: AttackControllerState

    public constructor(entryId: number, template: AttackTemplate, controllerState: AttackControllerState)
    {
        this.entryId = entryId
        this._template = template
        this._controllerState = controllerState
        this._controllerState.entries[this.entryId] = {} as AttackControllerEntryState
        this.enable()
    }

    private get state() { return this._controllerState.entries[this.entryId] }

    public get isEnabled() { return this.state.enabled }
    private set isEnabled(value) { this.state.enabled = value }

    private get lastAttackSeconds() { return this.state.lastAttackSeconds }
    private set lastAttackSeconds(value) { this.state.lastAttackSeconds = value }

    private get delaySeconds() { return this.state.delaySeconds }
    private set delaySeconds(value) { this.state.delaySeconds = value }

    private get periodSeconds() { return this.state.periodSeconds }
    private set periodSeconds(value) { this.state.periodSeconds = value }

    private computeNextPeriod(): number
    {
        let period = Math.max(0, this._template.everySeconds ?? 0)
        if(this._template.randomExtraEverySeconds !== undefined)
        {
            let rand = Time.toTurns(this._template.randomExtraEverySeconds)
            rand = Random.integer(0, rand + 1)
            rand = Time.toSeconds(rand)
            period += rand
        }
        return period
    }

    public enable(): void
    {
        this.isEnabled = true
        this.lastAttackSeconds = Time.currentSeconds
        this.delaySeconds = Math.max(0, this._template.delaySeconds ?? 0)
        this.periodSeconds = this.computeNextPeriod()
    }

    public disable(): void { this.isEnabled = false }

    public update(currentSeconds: number, delta: number): void
    {
        if(!this.isEnabled || (this._template.condition !== undefined && !this._template.condition()))
            return

        if(!!this._template.forceFirst)
        {
            this._template.forceFirst = false
            this.delaySeconds = 0
            this.lastAttackSeconds = currentSeconds - this.periodSeconds
        }

        if(this.delaySeconds > 0)
        {
            this.delaySeconds -= delta
            if(this.delaySeconds > 0)
            {
                if(__DebugMode)
                {
                    const ownerName = this._template.attackerTribe?.name
                    const secs = IMath.toInteger(this.delaySeconds * 100) / 100
                    log(`[${ownerName}][Attack[${this.entryId}]]: Delay for: ${secs} sec`)
                }
                return
            }
            this.lastAttackSeconds = currentSeconds + this.delaySeconds
            this.delaySeconds = 0
        }

        if((currentSeconds - this.lastAttackSeconds) >= this.periodSeconds)
        {
            if(this.periodSeconds <= 0) this.disable()
            const override = this._template.override !== undefined ? this._template.override() : {}
            const result = AttackUtils.doAttackNow(this._template, override, this.entryId)
            if(result)
            {
                if(this._template.once)
                    this.disable()
                else
                {
                    this.lastAttackSeconds = currentSeconds
                    this.periodSeconds = this.computeNextPeriod()
                }
            }
            if(this._template.callback !== undefined)
                this._template.callback(result)
        }
        else if(__DebugMode)
        {
            const time = this.periodSeconds - (currentSeconds - this.lastAttackSeconds)
            const ownerName = this._template.attackerTribe?.name
            const secs = IMath.toInteger(time * 100) / 100
            log(`[${ownerName}][Attack[${this.entryId}]]: Next on '${secs}' seconds`)
        }
    }
}

interface AttackControllerEntryState
{
    enabled: boolean
    lastAttackSeconds: number
    delaySeconds: number
    periodSeconds: number
}

interface AttackControllerState
{
    entries: Record<number, AttackControllerEntryState>
}


export class AttackController extends BaseControllerScriptComponent<AttackControllerState>
{
    private readonly _entries: Record<number, AttackControllerEntry>
    private _lastUpdate?: number

    public constructor(tribe: Tribe)
    {
        super("AttackController", tribe)

        this._entries = {}
        this._lastUpdate = undefined

        this.state = {
            entries: {}
        }
    }

    public registerEntry(entryId: number, template: AttackTemplate): void
    {
        const entry = new AttackControllerEntry(entryId, Object.assign({}, template), this.state)
        this._entries[entry.entryId] = entry
    }

    public enableEntry(entryId: number): boolean
    {
        const entry = this._entries[entryId]
        if(entry === undefined)
            return false

        if(!entry.isEnabled)
            entry.enable()

        return true
    }

    public disableEntry(entryId: number): boolean
    {
        const entry = this._entries[entryId]
        if(entry === undefined)
            return false

        if(entry.isEnabled)
            entry.disable()

        return true
    }

    protected update(deltaTime: Time): void
    {
        const currentSeconds = deltaTime.seconds
        if(this._lastUpdate === undefined)
        {
            this._lastUpdate = currentSeconds
            return
        }

        const delta = currentSeconds - this._lastUpdate
        this._lastUpdate = currentSeconds
        for(const entry of Object.values(this._entries))
            entry.update(currentSeconds, delta)
    }


    public static doAttackNow(template: AttackTemplate, override?: AttackTemplate): boolean
    {
        return AttackUtils.doAttackNow(template, override)
    }
}



/** @noSelf */
namespace AttackUtils
{
    function replaceByOverrided(template: AttackTemplate, override: AttackTemplate): AttackTemplate
    {
        return Object.assign({}, template, override)
    }

    function prepareParams(template: AttackTemplate, override?: AttackTemplate): AttackInternalParams
    {
        if(override !== undefined)
            template = replaceByOverrided(template, override);
        return {
            attackerTribe: template.attackerTribe,
            targetTribe: template.targetTribe,
            minPeople: IMath.imax(template.minPeople ?? 0, 0),
            maxPeople: IMath.imax(template.maxPeople ?? 0, IMath.imax(template.minPeople ?? 0, 0)),
            damage: IMath.iclamp(template.damage ?? 999, 0, 999),
            targetType: template.targetType ?? PopScriptAttackTargetType.ATTACK_MARKER,
            targetModel: template.targetModel ?? 0,
            mode: template.mode ?? PopScriptAttackType.ATTACK_NORMAL,
            spell1: template.spell1 ?? SpellModel.None,
            spell2: template.spell2 ?? SpellModel.None,
            spell3: template.spell3 ?? SpellModel.None,
            marker1: Marker.of(Marker.validOrDefault(template.marker1)),
            marker2: Marker.of(Marker.validOrDefault(template.marker2)),
            lookAfter: template.lookAfter ?? false,
            direction: template.direction ?? -1,
            optionalShama: template.optionalShama ?? false,
            ignoreMana: template.ignoreMana ?? false,
            shaman: (template.shaman ?? false) || (template.optionalShama ?? false),
            braves: IMath.iclamp(template.braves ?? 0, 0, 100),
            warriors: IMath.iclamp(template.warriors ?? 0, 0, 100),
            superWarriors: IMath.iclamp(template.superWarriors ?? 0, 0, 100),
            preachers: IMath.iclamp(template.preachers ?? 0, 0, 100),
            spies: IMath.iclamp(template.spies ?? 0, 0, 100)
        }
    }

    function checkEnoughPersons(person: Person, people: number, percent: number): boolean
    {
        if(percent <= 0 || people <= 0) return true
        const expected = IMath.toInteger(people * (percent / 100.0))
        return person.numInWorld > expected
    }

    function getSpellCost(tribe: Tribe, spell: SpellModel): number
    {
        if(spell === SpellModel.None) return 0
        return tribe.spells.get(spell)?.cost ?? 0
    }

    function checkEnoughMana(tribe: Tribe, model1: SpellModel, model2: SpellModel, model3: SpellModel): boolean
    {
        const cost = getSpellCost(tribe, model1) + getSpellCost(tribe, model2) + getSpellCost(tribe, model3)
        return cost <= 0 || tribe.mana >= cost
    }

    function checkAvailableShaman(tribe: Tribe, useShaman: boolean, model1: SpellModel, model2: SpellModel, model3: SpellModel): boolean
    {
        if(useShaman || model1 != SpellModel.None || model2 != SpellModel.None || model3 != SpellModel.None)
            return tribe.shaman.isAvailableForAttack && checkEnoughMana(tribe, model1, model2, model3)
        return true
    }

    function checkVehicleAvailability(tribe: Tribe, people: number, attackType: PopScriptAttackType): boolean
    {
        if(attackType == PopScriptAttackType.ATTACK_BY_BOAT)
        {
            const num = (people / 5) + 1
            return tribe.numBoats >= num
        }
        else if(attackType == PopScriptAttackType.ATTACK_BY_BALLOON)
        {
            const num = (people / 2) + 1
            return tribe.numBalloons >= num
        }
        return true
    }

    export function doAttack(params: AttackInternalParams, entryId: number): boolean
    {
        const attacker = params.attackerTribe
        if(attacker === undefined)
            return false

        const target = params.targetTribe
        if(target === undefined)
            return false

        let people = params.minPeople
        if(params.maxPeople > people)
            people = people + Random.integer(params.maxPeople - params.minPeople)
        if(attacker.numPeople <= people * 1.5)
            return false

        if(checkVehicleAvailability(attacker, people, params.mode))
            return false

        const useShaman = checkAvailableShaman(attacker, params.shaman, params.spell1, params.spell2, params.spell3)
        if(!useShaman && !params.optionalShama)
            return false

        if(params.shaman && !(attacker.shaman.isAvailableForAttack && (params.ignoreMana || checkEnoughMana(attacker, params.spell1, params.spell2, params.spell3))))
            return false

        if(!checkEnoughPersons(attacker.persons.brave, people, params.braves)) return false
        if(!checkEnoughPersons(attacker.persons.warrior, people, params.warriors)) return false
        if(!checkEnoughPersons(attacker.persons.superWarrior, people, params.superWarriors)) return false
        if(!checkEnoughPersons(attacker.persons.preacher, people, params.preachers)) return false
        if(!checkEnoughPersons(attacker.persons.spy, people, params.spies)) return false

        const attrs = attacker.ai.attributes
        attrs.awayShaman = useShaman && params.shaman ? 100 : 0
        attrs.awayBrave = params.braves
        attrs.awayWarrior = params.warriors
        attrs.awaySuperWarrior = params.superWarriors
        attrs.awayReligious = params.preachers
        attrs.awaySpy = params.spies

        const result = attacker.ai.attack(
            target.id,
            people,
            params.targetType,
            params.targetModel,
            params.damage,
            useShaman && params.spell1 ? params.spell1 : SpellModel.None,
            useShaman && params.spell2 ? params.spell2 : SpellModel.None,
            useShaman && params.spell3 ? params.spell3 : SpellModel.None,
            params.mode,
            params.lookAfter ? 1 : 0,
            params.marker1,
            params.marker2,
            params.direction
        )

        if(result && __DebugMode)
            log(`[${attacker.name}][Attack[${entryId}]]: Attack to ${target.name} with ${people} people`)

        return result
    }

    export function doAttackNow(template: AttackTemplate, override?: AttackTemplate, entryId?: number): boolean
    {
        const params = prepareParams(template, override)
        if(params.attackerTribe === undefined || params.targetTribe === undefined)
            return false

        return doAttack(params, entryId ?? 0)
    }
}
