'use strict';

/**
 * Hello World application (variant 3: JavaScript + npm scripts + Jest).
 * The file is self-contained (no local require) so it can be packed
 * into a Node.js Single Executable Application (build/hello).
 */

/** Adds two numbers. Used by the BasicAddition unit test. */
function add(a, b) {
  return a + b;
}

/** Returns a greeting string. */
function greet(name = 'World') {
  return `Hello, ${name}!`;
}

/** Entry point: prints the greeting, returns the exit code. */
function main(argv = []) {
  console.log(greet(argv[0]));
  return 0;
}

module.exports = { add, greet, main };

let isSea = false;
try {
  isSea = require('node:sea').isSea();
} catch {
  isSea = false;
}

if (isSea || require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
