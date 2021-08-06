"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const util_1 = require("util");
function echoExecutor(options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.info(`Executing "echo"...`);
        console.info(`Options: ${JSON.stringify(options, null, 2)}`);
        const { stdout, stderr } = yield util_1.promisify(child_process_1.exec)(`echo ${options.textToEcho}`);
        console.log(stdout);
        console.error(stderr);
        return { success: true };
    });
}
exports.default = echoExecutor;
//# sourceMappingURL=impl.js.map