export class EventEmitter {
    /**
     * Adds a listener function to the specified event.
     *
     * @param event
     * @param listener
     * @param once
     */
    listen(event: string, listener: Function, once?: boolean) : EventEmitter;

    /**
     * //
     * @param event
     * @param args
     */
    emit(event: string|RegExp, ...args: any[]) : EventEmitter;

    /**
     * Removes listener of the specified event.
     *
     * @param event
     * @param listener
     */
    off(event: string, listener: Function) : EventEmitter;

    /**
     * Merges with specified class.
     *
     * @param target
     */
    static mixin(target: Function|object) : void;
}
