// Scope: block-scoped variables stay inside their block.
const teamName = "Platform";

function showTeam() {
  const message = `Team: ${teamName}`;
  return message;
}

{
  const localMessage = "Only visible in this block";
  console.log(localMessage);
}
console.log(showTeam());

// Hoisting: function declarations can be called before their definition.
console.log("Hoisted function:", describeRole());
function describeRole() {
  return "Software Engineer";
}

// A closure remembers variables from the function where it was created.
function createEmployeeCounter() {
  let count = 0;
  return function addEmployee() {
    count += 1;
    return count;
  };
}

const countEmployees = createEmployeeCounter();
console.log("Closure count:", countEmployees(), countEmployees());

// A callback is a function passed to another function.
function greetEmployee(name, callback) {
  callback(`Welcome, ${name}!`);
}

greetEmployee("Maya", (message) => console.log("Callback:", message));

// Promises represent values that may be available later.
function getDepartment() {
  return Promise.resolve("Engineering");
}

getDepartment()
  .then((department) => console.log("Promise result:", department))
  .catch((error) => console.error("Promise error:", error));

// async/await makes promise-based code easier to read.
async function showDepartment() {
  try {
    const department = await getDepartment();
    console.log("async/await result:", department);
  } catch (error) {
    console.error("Could not load department:", error);
  }
}

await showDepartment();

// Event loop: synchronous work runs before queued promise callbacks.
console.log("Event loop: 1. synchronous start");
setTimeout(() => console.log("Event loop: 3. timer callback"), 0);
Promise.resolve().then(() => console.log("Event loop: 2. promise callback"));
console.log("Event loop: 1. synchronous end");

// ES modules use export to share code and import to use it in another file.
// This runnable file is itself an ES module; these exports can be imported by another module.
export { createEmployeeCounter, describeRole };

// Errors can be handled with try/catch instead of stopping the program.
try {
  throw new Error("Example employee lookup failed");
} catch (error) {
  console.log("Handled error:", error.message);
}
