import { RawMarker } from "./Markers";
export declare enum PatrolMode {
    CIRCLE = 0,
    PATH = 1
}
export declare class Patrol {
    static readonly MAX_PATROLS = 16;
    readonly id: number;
    readonly tribe: TribeID;
    mode: PatrolMode;
    private _marker1;
    private _marker2;
    private _braves;
    private _warriors;
    private _superWarriors;
    private _preachers;
    constructor(id: number, tribe: TribeID);
    get centerMarker(): RawMarker;
    set centerMarker(marker: RawMarker);
    get startMarker(): RawMarker;
    set startMarker(marker: RawMarker);
    get endMarker(): RawMarker;
    set endMarker(marker: RawMarker);
    get braves(): number;
    set braves(amount: number);
    get warriors(): number;
    set warriors(amount: number);
    get superWarriors(): number;
    set superWarriors(amount: number);
    get preachers(): number;
    set preachers(amount: number);
    setCircleMode(center: RawMarker): void;
    setPathMode(start: RawMarker, end: RawMarker): void;
    setPersons(braves?: number, warriors?: number, superWarriors?: number, preachers?: number): void;
    setPersons(persons: PatrolPersonsData): void;
    set(data: PatrolCircleSet): void;
    set(data: PatrolPathSet): void;
}
type PatrolPersonsData = {
    braves?: number;
    warriors?: number;
    superWarriors?: number;
    preachers?: number;
};
type PatrolCircleSet = PatrolPersonsData & {
    mode: PatrolMode.CIRCLE;
    center: RawMarker;
};
type PatrolPathSet = PatrolPersonsData & {
    mode: PatrolMode.PATH;
    start: RawMarker;
    end: RawMarker;
};
export {};
