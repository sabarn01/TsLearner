module PubSub {

    class Subscription {
        constructor(Topic: string, callBack: (message: any) => void) {
            this.Topic = Topic;
            this.Callback = callBack;
        }

        public Callback: (message: any) => void;
        public Topic: string;
    }



    /**
     * Represents a queue of messages that send data on a topic structure. 
     */
    export class PubSubQueue { 
        private Subscriptions: { [topic: string]: Array<Subscription>; } = {}


        public AddSubscription(topic: string, callBack: (model: any) => void) {
            var sub = new Subscription(topic, callBack)
        if (!this.Subscriptions.hasOwnProperty(topic)) {
                //This Topic has not been 
                this.Subscriptions[topic] = [sub];
            }
            else {
                this.Subscriptions[topic].push(sub);
            }
        }

        public RemoveSubScription(callBack: (modle: any) => void) {
            var x = 0;
            
            for (var topic in this.Subscriptions) {
                if(this.Subscriptions.hasOwnProperty(topic)){                    
                    var Subs = this.Subscriptions[topic];
                    this.Subscriptions[topic] = Subs.filter(function (item, index, array) {
                        return (!(item.Callback === callBack));
                    });
                }
            }          
        }

        public Publish(topic: string, item: any) {
            if (topic in this.Subscriptions) {
                this.Subscriptions[topic].forEach(function (value) {
                    value.Callback(item); 
                });
            }
        }
    };

}





