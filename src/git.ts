import { exec } from "child_process";

//Start and end are lines - this will give a list of all authors
export async function get_authors(
  filename: string,
  start: number,
  end: number
): Promise<string[]> {
  let lines = await blame(filename, start, end);

  return [
    ...new Set(
      lines
        .split(/\r?\n/)
        .filter((s) => s.startsWith("author "))
        .map((line, _) => getName(line).trim())
        .filter((s) => s !== "Not Committed Yet")
    ),
  ];
}

async function blame(
  filename: string,
  start: number,
  end: number
): Promise<string> {
  return await asyncExec(
    `git blame "${filename}" -p -L ${start},${end}`,
    filename
  );
}

export async function getRoot(fileName: string): Promise<string> {
  return await asyncExec("git rev-parse --show-toplevel", fileName);
}

function getName(line: string): string {
  const metadataMatcher = new RegExp(/author (.*)/);
  const author = metadataMatcher.exec(line)![1];
  return author;
}

async function asyncExec(cmd: string, filename: string): Promise<string> {
  return new Promise(function (resolve, reject) {
    exec(
      cmd,
      {
        cwd: filename.substring(0, filename.lastIndexOf("\\") + 1),
      },
      (err, stdout, stderr) => {
        if (err) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
}
