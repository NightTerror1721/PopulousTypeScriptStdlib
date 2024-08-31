/** @noSelfInFile */

const nativeLog = log

export const enum LogLevel
{
    OFF = 0,
    ERROR = 100,
    WARN = 200,
    INFO = 300,
    DEBUG = 400
}

export namespace Logger
{
    export let SystemLevel: LogLevel = LogLevel.WARN

    function levelToString(level: LogLevel): string
    {
        if(level >= LogLevel.DEBUG) return "DEBUG"
        else if(level >= LogLevel.INFO) return "INFO"
        else if(level >= LogLevel.WARN) return "WARN"
        else return "ERROR"
    }

    export function log(level: LogLevel, messageFn: () => any): void
    export function log(level: LogLevel, message: any): void
    export function log(level: LogLevel, message: any): void
    {
        if(SystemLevel >= level && level > LogLevel.OFF)
        {
            const prefix = `[${levelToString(level)}]: `
            if(typeof(message) === "function")
                nativeLog(`${prefix}${message()}`)
            else
                nativeLog(`${prefix}${message}`)
        }
    }

    export function debug(message: any): void
    export function debug(messageFn: () => any): void
    export function debug(message: any) { log(LogLevel.DEBUG, message) }

    export function info(message: any): void
    export function info(messageFn: () => any): void
    export function info(message: any) { log(LogLevel.INFO, message) }

    export function warn(message: any): void
    export function warn(messageFn: () => any): void
    export function warn(message: any) { log(LogLevel.WARN, message) }

    export function error(message: any): void
    export function error(messageFn: () => any): void
    export function error(message: any, ) { log(LogLevel.ERROR, message) }
}