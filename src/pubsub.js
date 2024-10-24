const pubsub = {
    subs: {},
    subscribe(eventName, func) {
        let event = this.subs[eventName] || [];

        if (!event.includes(func)) {
            event.push(func);
        };

        this.subs[eventName] = event;
    },
    unsubscribe(eventName, func) {
        let event = this.subs[eventName] || [];

        if (event.includes(func)) {
            event = event.filter(f => f !== func);
            this.subs[eventName] = event;
        };

        if (event.length == 0) {
            delete this.subs[eventName];
        };
    },
    publish(eventName, data) {
        for (const func of this.subs[eventName] ? this.subs[eventName] : []) {
            func(data);
        };
    },
};

export { pubsub };
