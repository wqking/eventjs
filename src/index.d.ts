declare module 'wqking-eventjs' {
    type ArgumentPassingMode = 1 | 2;

    export interface Parameters {
        getEvent?: (...args: any[]) => any;
        canContinueInvoking?: (...args: any[]) => boolean;
        argumentPassingMode?: ArgumentPassingMode;
        argumentsAsArray?: boolean;
        mixins?: MixinFilter[];
    }

    export interface Callback {
        (...args: any[]): any;
    }

    export class Handle {
        constructor(callback: Callback, counter: number);
    }

    export class CallbackList {
        constructor(params?: Parameters);

        append(callback: Callback): Handle;

        prepend(callback: Callback): Handle;

        insert(callback: Callback, before: Callback | Handle): Handle;

        remove(handle: Callback | Handle): boolean;

        empty(): boolean;

        has(handle: Callback | Handle): boolean;

        hasAny(): boolean;

        forEach(func: (callback: Callback) => void): void;

        forEachIf(func: (callback: Callback) => void): boolean;

        dispatch(...args: any[]): void;

        applyDispatch(...args: any[]): void;
    }

    export class EventDispatcher {
        /**
         * ArgumentPassingMode: 1
         * @static
         * @readonly
         * @type {ArgumentPassingMode}
         * @memberof EventDispatcher
         */
        static readonly argumentPassingIncludeEvent: ArgumentPassingMode;

        /**
        * ArgumentPassingMode: 2
        * @static
        * @readonly
        * @type {ArgumentPassingMode}
        * @memberof EventDispatcher
        */
        static readonly argumentPassingExcludeEvent: ArgumentPassingMode;

        /**
        * ArgumentPassingMode: 2
        * @static
        * @readonly
        * @type {ArgumentPassingMode}
        * @memberof EventDispatcher
        */
        static readonly defaultArgumentPassingMode: ArgumentPassingMode;

        constructor(params?: Parameters);

        appendListener(event: any, callback: Callback): Handle;

        prependListener(event: any, callback: Callback): Handle;

        insertListener(event: any, callback: Callback, before: Callback | Handle): Handle;

        removeListener(event: any, handle: Callback | Handle): boolean;

        hasListener(event: any, handle: Callback | Handle): boolean;

        hasAnyListener(event: any): boolean;

        dispatch(...args: any[]): void;

        applyDispatch(...args: any[]): void;

        forEach(event: any, func: (callback: Callback) => void): void;

        forEachIf(event: any, func: (callback: Callback) => void): boolean;
    }

    export class EventQueue {
        constructor(params?: Parameters);

        enqueue(event: any, ...args: any[]): void;

        process(): void;

        processOne(): void;

        processIf(func: (...args: any[]) => boolean): void;

        empty(): boolean;

        clearEvents(): void;

        peekEvent(): any;

        takeEvent(): any;
    }

    export class MixinFilter {
        constructor(params?: Parameters);

        appendFilter(filter: (...args: any[]) => boolean): Handle;

        mixinBeforeDispatch(args: any[]): boolean;

        removeFilter(handle: Handle | ((...args: any[]) => boolean)): boolean;
    }
}