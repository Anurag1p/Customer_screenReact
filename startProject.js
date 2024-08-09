const { exec } = require('child_process');
const path = require('path');

// Path to the directory containing your React project
const projectPath = path.join(__dirname);

// Command to start the React project
const startCommand = 'npm start';

// Execute the command in the project directory
const process = exec(startCommand, { cwd: projectPath });

// Log output to the console
process.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

process.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

process.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
