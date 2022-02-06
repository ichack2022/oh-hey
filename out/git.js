"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_authors = void 0;
const child_process_1 = require("child_process");
//Start and end are lines - this will give a list of all authors
async function get_authors(filename, start, end) {
    let lines = await blame(filename, start, end);
    return [
        ...new Set(lines
            .split(/\r?\n/)
            .filter((s) => s.startsWith("author "))
            .map((line, _) => getName(line).trim())
            .filter((s) => s !== "Not Committed Yet")),
    ];
}
exports.get_authors = get_authors;
async function blame(filename, start, end) {
    // setInterval()
    return new Promise(function (resolve, reject) {
        console.log(filename);
        (0, child_process_1.exec)(`git blame "${filename}" -p -L ${start},${end}`, {
            cwd: filename.substring(0, filename.lastIndexOf("\\") + 1),
        }, (err, stdout, stderr) => {
            if (err) {
                reject(stderr);
            }
            resolve(stdout);
        });
    });
}
function getName(line) {
    const metadataMatcher = new RegExp(/author (.*)/);
    const author = metadataMatcher.exec(line)[1];
    return author;
}
//# sourceMappingURL=git.js.map