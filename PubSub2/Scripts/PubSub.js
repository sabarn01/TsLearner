var PubSub;
(function (PubSub) {
    var Subscription = (function () {
        function Subscription(Topic, callBack) {
            this.Topic = Topic;
            this.Callback = callBack;
        }
        return Subscription;
    })();

    /**
    * Represents a queue of messages that send data on a topic structure.
    */
    var PubSubQueue = (function () {
        function PubSubQueue() {
            this.Subscriptions = {};
        }
        PubSubQueue.prototype.AddSubscription = function (topic, callBack) {
            var sub = new Subscription(topic, callBack);
            if (!this.Subscriptions.hasOwnProperty(topic)) {
                //This Topic has not been
                this.Subscriptions[topic] = [sub];
            } else {
                this.Subscriptions[topic].push(sub);
            }
        };

        PubSubQueue.prototype.RemoveSubScription = function (callBack) {
            var x = 0;

            for (var topic in this.Subscriptions) {
                if (this.Subscriptions.hasOwnProperty(topic)) {
                    var Subs = this.Subscriptions[topic];
                    this.Subscriptions[topic] = Subs.filter(function (item, index, array) {
                        return (!(item.Callback === callBack));
                    });
                }
            }
        };

        PubSubQueue.prototype.Publish = function (topic, item) {
            if (topic in this.Subscriptions) {
                this.Subscriptions[topic].forEach(function (value) {
                    value.Callback(item);
                });
            }
        };
        return PubSubQueue;
    })();
    PubSub.PubSubQueue = PubSubQueue;
    ;
})(PubSub || (PubSub = {}));
//# sourceMappingURL=PubSub.js.map
