"use strict";

///<reference path='PubSub.ts' />
///<reference path='TsTest.ts' />

module PubSubTests {
    class AllTests {
        public TestIsCalled(): boolean {
            var queue = new PubSub.PubSubQueue();
            var called = false;
            var callback = (message: any) => {
                called = true;
            };
            queue.AddSubscription("test", callback);
            queue.Publish("test", { foo: 'hi' }); 

            return called === true;
        }

        public TestMultipleCallbackAreCalled(): boolean {
            var queue = new PubSub.PubSubQueue();
            var CallCount = 0
            var callback = (message: any) => {
                CallCount++;
            };
            queue.AddSubscription("test", callback); 
            queue.AddSubscription("test", callback); 
            queue.Publish("test", { foo: 'hi' });

            return CallCount === 2;
        }

        public TestSubDelete(): boolean {
            var queue = new PubSub.PubSubQueue();
            var called = false;
            var callback = (message: any) => {
                called = true;
            };
            queue.AddSubscription("test", callback);
            queue.RemoveSubScription(callback); 
            queue.Publish("test", { foo: 'hi' });

            return called === false;
        }
    }

    export function TestPubSub(): Array<TsTest.TestResult>
    {
        var al = new AllTests(); 
        return TsTest.RunTests(al);
    }

}


