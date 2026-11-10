/**
 * CODE RUNNER
 * ---------------------------------------------------------------------------
 * Runs the student's JavaScript against test cases, on the SERVER, so the
 * result can be trusted (a student cannot fake a pass in the browser).
 *
 * How it works:
 *   1. For every test we create a brand-new, empty VM context.
 *   2. We run the student's code, then call their function with the test args.
 *   3. The result is turned into JSON text and compared with the expected one.
 *   4. A 1-second timeout stops infinite loops.
 *
 * IMPORTANT SECURITY NOTE:
 * Node's built-in `vm` module is NOT a perfect security sandbox. It is fine
 * for a college project / demo. Before putting SkillSync on the public
 * internet, either run this in a separate container / service (for example
 * Docker with no network, or a service such as Judge0), or set
 * ENABLE_CODE_CHALLENGES=false in .env to turn coding challenges off.
 */
const vm = require("vm");

const MAX_CODE_LENGTH = 5000;
const TIMEOUT_MS = 1000;

const runCodeChallenge = (userCode, challenge) => {
  if (typeof userCode !== "string" || !userCode.trim()) {
    return { passed: false, passedCount: 0, total: challenge.tests.length, details: [], error: "No code was submitted." };
  }
  if (userCode.length > MAX_CODE_LENGTH) {
    return { passed: false, passedCount: 0, total: challenge.tests.length, details: [], error: "Code is too long." };
  }

  const details = [];
  let passedCount = 0;

  challenge.tests.forEach((test, index) => {
    // Object.create(null) = a sandbox with no link back to the server's objects.
    const context = vm.createContext(Object.create(null));
    const expectedJson = JSON.stringify(test.expected);
    let status = "failed";
    let message = "";
    let received;

    try {
      const script = new vm.Script(
        `${userCode}\n;JSON.stringify(${challenge.functionName}(...${JSON.stringify(test.args)}));`
      );
      received = script.runInContext(context, { timeout: TIMEOUT_MS });

      if (received === expectedJson) {
        status = "passed";
        passedCount++;
      } else {
        message = "Output did not match the expected result.";
      }
    } catch (err) {
      message = /timed out/i.test(err.message)
        ? "Your code took too long (possible infinite loop)."
        : err.message;
    }

    // Only the first 2 tests are visible; the rest are hidden tests.
    const visible = index < 2;
    details.push({
      test: index + 1,
      status,
      hidden: !visible,
      ...(visible && {
        input: JSON.stringify(test.args).slice(1, -1),
        expected: expectedJson,
        received: received === undefined ? "undefined" : received,
      }),
      message: visible || status === "failed" ? message : "",
    });
  });

  return {
    passed: passedCount === challenge.tests.length,
    passedCount,
    total: challenge.tests.length,
    details,
  };
};

module.exports = { runCodeChallenge };
