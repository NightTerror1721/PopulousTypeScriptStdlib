import { IMath } from "./IMath"
import "./PopModules"

const _gsi = gsi()

export class Time
{
    public static readonly TURNS_PER_SECOND = 12
    public static readonly SECONDS_PER_TURN = 1.0 / Time.TURNS_PER_SECOND

    public readonly turn: number
    public readonly seconds: number

    private constructor(turn: number)
    {
        this.turn = turn
        this.seconds = turn / Time.TURNS_PER_SECOND
    }

    public static current(this: void) { return new Time(_gsi.Counts.ProcessThings) }
    public static toTurns(seconds: number) { return Math.floor(seconds * Time.TURNS_PER_SECOND) }
    public static toSeconds(turns: number) { return turns / Time.TURNS_PER_SECOND }

    public static fromSeconds(seconds: number) { return new Time(Time.toTurns(Math.max(0, seconds))) }
    public static fromTurns(turns: number) { return new Time(IMath.imax(0, turns)) }

    public static get currentTurns() { return _gsi.Counts.ProcessThings }
    public static get currentSeconds() { return Time.toSeconds(Time.currentTurns) }

    public isTurn(turn: number) { return this.turn === turn }
    public isAtLeastTurn(turn: number) { return this.turn >= turn }
    public isAtMostTurn(turn: number) { return this.turn <= turn }
    public isBetweenTurns(minTurn: number, maxTurn: number)
    {
        return Math.min(minTurn, maxTurn) >= this.turn && this.turn >= Math.max(minTurn, maxTurn)
    }


    public is(seconds: number) { return this.seconds === seconds }
    public isAtLeast(seconds: number) { return this.seconds >= seconds }
    public isAtMost(seconds: number) { return this.seconds <= seconds }
    public isBetween(minSeconds: number, maxSeconds: number)
    {
        return Math.min(minSeconds, maxSeconds) >= this.seconds && this.seconds >= Math.max(minSeconds, maxSeconds)
    }

    public equals(other: Time) { return this.turn === other.turn }


    public everyTurns(turns: number, initialDelayTurns: number, action: (this: void) => void): boolean
    public everyTurns(turns: number, initialDelayTurns: number): boolean
    public everyTurns(turns: number): boolean
    public everyTurns(turns: number, initialDelayTurns?: number, action?: (this: void) => void): boolean
    {
        const turn = this.turn - (initialDelayTurns ? Math.max(0, Math.floor(initialDelayTurns)) : 0)
        if(turn <= 0) return false
        if((turn % Math.floor(turns)) === 0)
        {
            if(action !== undefined) action()
            return true
        }
        return false
    }

    public everyPowTurns(base: number, exponent: number, initialDelayTurns: number, action: (this: void) => void): boolean
    public everyPowTurns(base: number, exponent: number, initialDelayTurns: number): boolean
    public everyPowTurns(base: number, exponent: number): boolean
    public everyPowTurns(base: number, exponent: number, initialDelayTurns?: number, action?: (this: void) => void): boolean
    {
        return this.everyTurns(Math.floor(Math.pow(base, exponent)), initialDelayTurns!!, action!!)
    }

    public every2PowTurns(base: number, initialDelayTurns: number, action: (this: void) => void): boolean
    public every2PowTurns(base: number, initialDelayTurns: number): boolean
    public every2PowTurns(base: number): boolean
    public every2PowTurns(base: number, initialDelayTurns?: number, action?: (this: void) => void): boolean
    {
        return this.everyPowTurns(base, 2, initialDelayTurns!!, action!!)
    }

    public every(seconds: number, initialDelaySeconds: number, action: (this: void) => void): boolean
    public every(seconds: number, initialDelaySeconds: number): boolean
    public every(seconds: number): boolean
    public every(seconds: number, initialDelaySeconds?: number, action?: (this: void) => void): boolean
    {
        const delay = initialDelaySeconds ? Time.toTurns(initialDelaySeconds) : 0
        return this.everyTurns(Time.toTurns(seconds), delay, action!!)
    }
}
