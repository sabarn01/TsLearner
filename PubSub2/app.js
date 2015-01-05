/**
Customer.ts
This file contain the model for the customer class for vantage
*/
var Vantage;
(function (Vantage) {
    (function (AddressType) {
        AddressType[AddressType["Billing"] = 0] = "Billing";
        AddressType[AddressType["Shipping"] = 1] = "Shipping";
        AddressType[AddressType["Primary"] = 2] = "Primary";
    })(Vantage.AddressType || (Vantage.AddressType = {}));
    var AddressType = Vantage.AddressType;

    var Address = (function () {
        function Address() {
            this.country = 'USA';
        }
        return Address;
    })();
    Vantage.Address = Address;
    var Customer = (function () {
        function Customer() {
        }
        return Customer;
    })();
    Vantage.Customer = Customer;
})(Vantage || (Vantage = {}));
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
"use strict";
///<reference path='PubSub.ts' />
///<reference path='TsTest.ts' />
var PubSubTests;
(function (PubSubTests) {
    var AllTests = (function () {
        function AllTests() {
        }
        AllTests.prototype.TestIsCalled = function () {
            var queue = new PubSub.PubSubQueue();
            var called = false;
            var callback = function (message) {
                called = true;
            };
            queue.AddSubscription("test", callback);
            queue.Publish("test", { foo: 'hi' });

            return called === true;
        };

        AllTests.prototype.TestMultipleCallbackAreCalled = function () {
            var queue = new PubSub.PubSubQueue();
            var CallCount = 0;
            var callback = function (message) {
                CallCount++;
            };
            queue.AddSubscription("test", callback);
            queue.AddSubscription("test", callback);
            queue.Publish("test", { foo: 'hi' });

            return CallCount === 2;
        };
        return AllTests;
    })();

    function TestPubSub() {
        var al = new AllTests();
        return TsTest.RunTests(al);
    }
    PubSubTests.TestPubSub = TestPubSub;
})(PubSubTests || (PubSubTests = {}));
var TsTest;
(function (TsTest) {
    var TestResult = (function () {
        function TestResult() {
            this.Error = "";
        }
        return TestResult;
    })();
    TsTest.TestResult = TestResult;

    var Tests = (function () {
        function Tests() {
        }
        Tests.prototype.TestSubIsCalled = function () {
            return true;
        };
        return Tests;
    })();
    TsTest.Tests = Tests;

    function RunTest(obj, fnNam) {
        var res = new TestResult();
        var StartTime = new Date();
        try  {
            res.Result = obj[fnNam]();
        } catch (err) {
            res.Result = false;
            if (typeof (err) === 'string') {
                res.Error = err;
            } else {
                res.Error = JSON.stringify(err);
            }
        }
        res.ElaspedTime = (new Date().getTime() - StartTime.getTime());
        res.Name = fnNam;
        return res;
    }

    function RunTests(obj) {
        var results = new Array();
        for (var prop in obj) {
            if (typeof (obj[prop]) === 'function') {
                results.push(RunTest(obj, prop));
            }
        }
        return results;
    }
    TsTest.RunTests = RunTests;
})(TsTest || (TsTest = {}));
//# sourceMappingURL=app.js.map
