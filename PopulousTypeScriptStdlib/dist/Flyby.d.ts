import { Location } from "./Location";
import "./PopModules";
/** @noSelf */
export declare namespace Flyby {
    export function create(): void;
    export function stop(): void;
    export function setAllowInterrupt(enabled: boolean): void;
    export function setEventLocation(x: number, z: number, start: number, duration: number): void;
    export function setEventLocation(location: Location, start: number, duration: number): void;
    export function setEventAngle(angle: number, start: number, duration: number): void;
    export function setEventZoom(zoom: number, start: number, duration: number): void;
    export function setEventTooltip(x: number, z: number, code: number, start: number, duration: number): void;
    export function setEventTooltip(location: Location, code: number, start: number, duration: number): void;
    export function setEndTarget(x: number, z: number, angle: number, duration: number): void;
    export function setEndTarget(location: Location, angle: number, duration: number): void;
    export function openDialog(dialogIdx: number, start: number): void;
    interface TemporaryEvent extends Event {
        duration: number;
    }
    export interface Event {
        start: number;
        readonly eventType: Event.Type;
    }
    export namespace Event {
        const enum Type {
            LOCATION = 0,
            ANGLE = 1,
            ZOOM = 2,
            TOOLTIP = 3,
            DIALOG = 4
        }
        function location(x: number, z: number, start: number, duration: number): EventLocation;
        function location(location: Location, start: number, duration: number): EventLocation;
        function angle(angle: number, start: number, duration: number): EventAngle;
        function zoom(zoom: number, start: number, duration: number): EventZoom;
        function tooltip(x: number, z: number, code: number, start: number, duration: number): EventTooltip;
        function tooltip(location: Location, code: number, start: number, duration: number): EventTooltip;
        function dialog(dialogIdx: number, start: number): {
            eventType: Type;
            dialogIdx: number;
            start: number;
        };
        function endTarget(x: number, z: number, angle: number, duration: number): EventEndTarget;
        function endTarget(location: Location, angle: number, duration: number): EventEndTarget;
    }
    export interface EventLocation extends TemporaryEvent {
        x: number;
        z: number;
    }
    export function EventLocation(x: number, z: number, start: number, duration: number): EventLocation;
    export function EventLocation(location: Location, start: number, duration: number): EventLocation;
    export interface EventAngle extends TemporaryEvent {
        angle: number;
    }
    export function EventAngle(angle: number, start: number, duration: number): EventAngle;
    export interface EventZoom extends TemporaryEvent {
        zoom: number;
    }
    export function EventZoom(zoom: number, start: number, duration: number): EventZoom;
    export interface EventTooltip extends EventLocation {
        code: number;
    }
    export function EventTooltip(x: number, z: number, code: number, start: number, duration: number): EventTooltip;
    export function EventTooltip(location: Location, code: number, start: number, duration: number): EventTooltip;
    export interface EventDialog extends Event {
        dialogIdx: number;
    }
    export function EventDialog(dialogIdx: number, start: number): {
        eventType: Event.Type;
        dialogIdx: number;
        start: number;
    };
    export interface EventEndTarget {
        x: number;
        z: number;
        angle: number;
        duration: number;
    }
    export function EventEndTarget(x: number, z: number, angle: number, duration: number): EventEndTarget;
    export function EventEndTarget(location: Location, angle: number, duration: number): EventEndTarget;
    export function start(events: Event[], endTarget?: EventEndTarget): void;
    export function start(): void;
    export {};
}
