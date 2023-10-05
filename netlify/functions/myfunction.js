const { spawn } = require("child_process");

exports.handler = async (event, context) => {
  const child = spawn("python3", ["flask-server/server.py"]);

  child.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Server started" }),
  };
};