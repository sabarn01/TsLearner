module TsTest {
    export class TestResult {
        Result: boolean;
        Name: string;
        ElaspedTime: Number;
        Error: string = "";
    }

    export class Tests {
        public TestSubIsCalled(): boolean {
            return true;
        }
    }

    function RunTest(obj: any, fnNam: string): TestResult {
        var res = new TestResult();
        var StartTime = new Date();
        try {
            res.Result = obj[fnNam]();
        } catch (err) {
            res.Result = false;
            if (typeof (err) === 'string') {
                res.Error = err;
            }
            else {
                res.Error = JSON.stringify(err);
            }

        }
        res.ElaspedTime = (new Date().getTime() - StartTime.getTime());
        res.Name = fnNam;
        return res;
    }

    

    export function RunTests(obj: any): Array<TestResult> {
        var results = new Array<TestResult>();
        for (var prop in obj) {
            if (typeof (obj[prop]) === 'function') {
                results.push(RunTest(obj, prop));
            }
        }
        return results;
    }
}