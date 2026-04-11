import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"

const baselineWarning =
  "[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`"

const nextBin = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
)

function forwardStream(stream, target) {
  let buffered = ""

  stream.setEncoding("utf8")
  stream.on("data", (chunk) => {
    buffered += chunk

    const lines = buffered.split(/\r?\n/)
    buffered = lines.pop() ?? ""

    for (const line of lines) {
      if (line.includes(baselineWarning)) {
        continue
      }

      target.write(`${line}\n`)
    }
  })

  stream.on("end", () => {
    if (!buffered || buffered.includes(baselineWarning)) {
      return
    }

    target.write(buffered)
  })
}

const child = spawn(process.execPath, [nextBin, "build"], {
  stdio: ["inherit", "pipe", "pipe"],
  env: process.env,
})

forwardStream(child.stdout, process.stdout)
forwardStream(child.stderr, process.stderr)

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})
