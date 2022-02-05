import { exec } from "child_process";

//Start and end are lines - this will give a list of all authors
export async function get_authors(filename: string, start: number, end: number): Promise<string[]> {
    let lines = await blame(filename, start, end);

    return [... new Set(lines.split(/\r?\n/).filter(s => s.startsWith("author ")).map((line, _) => getName(line).trim()).filter(s => s !== "Not Committed Yet"))];
}

async function blame(filename: string, start: number, end: number): Promise<string> {
    // setInterval()
    return new Promise(function(resolve, reject) {
        exec(`git blame ${filename} -p -L ${start},${end}`, {
            cwd: filename.substring(0, filename.lastIndexOf("\\")+1),
        } ,(err, stdout, stderr) => {
            if (err) {
                reject(stderr);
            }
            resolve(stdout);
        });
    });
}

function getName(line: string): string {
    const metadataMatcher = new RegExp(/author (.*)/);
    const author = metadataMatcher.exec(line)![1];
    return author;
}