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
//# sourceMappingURL=TsTest.js.map
