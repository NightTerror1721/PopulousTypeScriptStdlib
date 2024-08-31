/** @noSelfInFile */
export declare const enum LogLevel {
    OFF = 0,
    ERROR = 100,
    WARN = 200,
    INFO = 300,
    DEBUG = 400
}
export declare namespace Logger {
    let SystemLevel: LogLevel;
    function log(level: LogLevel, messageFn: () => any): void;
    function log(level: LogLevel, message: any): void;
    function debug(message: any): void;
    function debug(messageFn: () => any): void;
    function info(message: any): void;
    function info(messageFn: () => any): void;
    function warn(message: any): void;
    function warn(messageFn: () => any): void;
    function error(message: any): void;
    function error(messageFn: () => any): void;
}
