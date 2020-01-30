const EventEmitter = function () {};

function indexOfListener(listeners, listener) {
    let i = listeners.length;

    while (i--) {
        if (listeners[i] === listener) {
            return i;
        }
    }

    return -1;
}

EventEmitter.prototype = {
    eventListeners: {},

    removeListener(evt, listener) {
        let listeners = this.getListeners(evt);
        let index;
        let key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    },

    getListeners(eventName) {
        let events = this.eventListeners;
        let response;

        if (eventName instanceof RegExp) {
            response = {};
            for (let key in events) {
                if (events.hasOwnProperty(key) && eventName.test(key)) {
                    response[key] = events[key];
                }
            }
        } else {
            response = {};

            for (let key in events) {
                if (!events.hasOwnProperty(key)) {
                    continue;
                }

                if (key.includes('*') && eventName.includes(key.replace('*', ''))) {
                    response[key] = events[key];
                }
            }

            response[eventName] = events[eventName] || (events[eventName] = []);
        }

        return response;
    },

    listen(eventName, listener, once = false) {
        if (typeof listener !== 'function') {
            throw new TypeError('listener must be a function');
        }

        let listeners = this.getListeners(eventName);

        listeners[eventName] = (listeners[eventName] || []);
        listeners[eventName].push({ listener, once });

        return this;
    },

    off(eventName, listener) {
        let listenersMap = this.getListeners(eventName);
        let listeners;

        for (let key in listenersMap) {
            if (listenersMap.hasOwnProperty(key)) {
                listeners = listenersMap[key].slice(0);

                for (let i = 0; i < listeners.length; i++) {
                    if (listener === listeners[i].listener) {
                        this.removeListener(eventName, listeners[i]);
                    }
                }
            }
        }

        return this;
    },

    emit(eventName, ...args) {
        let listenersMap = this.getListeners(eventName);
        let listeners;

        for (let key in listenersMap) {
            if (listenersMap.hasOwnProperty(key)) {
                listeners = listenersMap[key].slice(0);

                for (let i = 0; i < listeners.length; i++) {
                    const listener = listeners[i];

                    if (listener.once === true) {
                        this.removeListener(eventName, listener);
                    }

                    listener.listener.apply(this, [
                        { type: eventName, payload: args[0] },
                        ...args.slice(1),
                    ]);
                }
            }
        }

        return this;
    },
};

EventEmitter.mixin = function (target) {
    Object.assign(target.prototype, EventEmitter.prototype);
};

module.exports = EventEmitter;
