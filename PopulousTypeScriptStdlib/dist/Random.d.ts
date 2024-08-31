import "./PopModules";
/** @noSelf */
declare namespace Random {
    function integer(min: number, max: number): number;
    function integer(min: number): number;
    function float(): number;
    function element<T>(array: T[]): T;
}
export default Random;
