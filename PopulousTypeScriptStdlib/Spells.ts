import "./PopModules"
import { Flags } from "./Flags"
import { SpellModel } from "./Things"

const _gsi = gsi()
const _sti = spells_type_info()

export namespace InternalSpellModel
{
    const Mapper: Record<number, PopScriptSpellModel> = {
        [SpellModel.None]: PopScriptSpellModel.INT_NO_SPECIFIC_SPELL,
        [SpellModel.Burn]: PopScriptSpellModel.INT_BURN,
        [SpellModel.Blast]: PopScriptSpellModel.INT_BLAST,
        [SpellModel.LightningBolt]: PopScriptSpellModel.INT_LIGHTNING_BOLT,
        [SpellModel.Whirlwind]: PopScriptSpellModel.INT_WHIRLWIND,
        [SpellModel.InsectPlage]: PopScriptSpellModel.INT_INSECT_PLAGUE,
        [SpellModel.Invisibility]: PopScriptSpellModel.INT_INVISIBILITY,
        [SpellModel.Hypnotism]: PopScriptSpellModel.INT_HYPNOTISM,
        [SpellModel.Firestorm]: PopScriptSpellModel.INT_FIRESTORM,
        [SpellModel.GhostArmy]: PopScriptSpellModel.INT_GHOST_ARMY,
        [SpellModel.Erosion]: PopScriptSpellModel.INT_EROSION,
        [SpellModel.Swamp]: PopScriptSpellModel.INT_SWAMP,
        [SpellModel.LandBridge]: PopScriptSpellModel.INT_LAND_BRIDGE,
        [SpellModel.AngelOfDeath]: PopScriptSpellModel.INT_ANGEL_OF_DEATH,
        [SpellModel.Earthquake]: PopScriptSpellModel.INT_EARTHQUAKE,
        [SpellModel.Flatten]: PopScriptSpellModel.INT_FLATTEN,
        [SpellModel.Volcano]: PopScriptSpellModel.INT_VOLCANO,
        [SpellModel.ConvertWild]: PopScriptSpellModel.INT_CONVERT,
        [SpellModel.Armageddon]: PopScriptSpellModel.INT_WRATH_OF_GOD,
        [SpellModel.Shield]: PopScriptSpellModel.INT_SHIELD,
        [SpellModel.Bloodlust]: PopScriptSpellModel.INT_BLOODLUST,
        [SpellModel.Teleport]: PopScriptSpellModel.INT_TELEPORT
    }

    export function of(model: SpellModel|undefined): PopScriptSpellModel|undefined { return model ? Mapper[model] : undefined }
}

export class Spell
{
    public readonly tribe: TribeID
    public readonly model: SpellModel
    private readonly _playerThings: PlayerThings
    private readonly _player: Player

    public constructor(tribe: TribeID, model: SpellModel)
    {
        this.tribe = tribe
        this.model = model
        this._playerThings = _gsi.ThisLevelInfo.PlayerThings[tribe - 1]
        this._player = getPlayer(tribe)
    }

    get isEnabled(): boolean
    {
        return Flags.isBitSet(this._playerThings.SpellsAvailable, this.model)
    }
    set isEnabled(value: boolean)
    {
        this._playerThings.SpellsAvailable = value
            ? Flags.setBit(this._playerThings.SpellsAvailable, this.model)
            : Flags.clearBit(this._playerThings.SpellsAvailable, this.model)
    }

    get isChargeEnabled(): boolean
    {
        return !Flags.isBitSet(this._playerThings.SpellsNotCharging, this.model)
    }
    set isChargeEnabled(value: boolean)
    {
        this._playerThings.SpellsNotCharging = !value
            ? Flags.setBit(this._playerThings.SpellsNotCharging, this.model)
            : Flags.clearBit(this._playerThings.SpellsNotCharging, this.model)
    }

    get shots(): number { return this._playerThings.SpellsAvailableOnce[this.model - 1] }
    set shots(value: number) { this._playerThings.SpellsAvailableOnce[this.model - 1] = Math.max(0, Math.floor(value)) }

    giveShots(shots: number) { this.shots += this.shots + Math.max(0, Math.floor(shots)) }

    get isLevelEnabled(): boolean
    {
        return !Flags.isBitSet(this._playerThings.SpellsAvailableLevel, this.model - 1)
    }
    set isLevelEnabled(value: boolean)
    {
        this._playerThings.SpellsNotCharging = value
            ? Flags.setBit(this._playerThings.SpellsAvailableLevel, this.model - 1)
            : Flags.clearBit(this._playerThings.SpellsAvailableLevel, this.model - 1)
    }

    get mana(): number { return this._player.SpellsMana[this.model - 1] }

    get castCount(): number { return this.model > 22 ? 0 : this._player.SpellsCast[this.model - 1] }

    static getCost(this: void, model: SpellModel): number
    {
        return _sti[model - 1].Cost
    }

    get cost(): number { return Spell.getCost(this.model) }

    static getInternalModelValue(this: void, model: SpellModel): number
    {
        return InternalSpellModel.of(model) ?? PopScriptSpellModel.INT_NO_SPECIFIC_SPELL
    }

    get internalModelValue(): number { return Spell.getInternalModelValue(this.model) }

    static readonly Count = SpellModel.__COUNT
}
