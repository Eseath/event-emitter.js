const EventEmitter = function () {};

EventEmitter.prototype = {
    eventListeners: {},

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

    listen(eventName, listener) {
        if (typeof listener !== 'function') {
            throw new TypeError('listener must be a function');
        }

        let listeners = this.getListeners(eventName);

        listeners[eventName] = (listeners[eventName] || []);
        listeners[eventName].push({
            listener: listener,
            once: false,
        });

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
