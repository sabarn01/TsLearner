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
//# sourceMappingURL=PubSubTests.js.map
