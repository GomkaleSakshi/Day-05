// Variables and data types
const programName = "Employee Directory";
let employeeCount = 3;
const isTrainingProject = true;
const departments = ["Engineering", "People", "Design"];
const employee = {
  id: 1,
  name: "Maya Chen",
  department: "Engineering",
  salary: 82000,
  active: true,
  manager: null
};

console.log("Program:", programName);
console.log("Count:", employeeCount, "Active:", isTrainingProject);
console.log("Types:", typeof programName, typeof employeeCount, typeof isTrainingProject);
console.log("Departments:", departments, "Employee:", employee);

// Function declaration and arrow function
function formatEmployee(person) {
  return `${person.name} works in ${person.department}.`;
}

const annualBonus = (salary, rate = 0.08) => salary * rate;
console.log(formatEmployee(employee));
console.log("Annual bonus:", annualBonus(employee.salary));

// Destructuring, spread, and rest parameters
const { name, department } = employee;
const [firstDepartment, ...otherDepartments] = departments;
const promotedEmployee = { ...employee, position: "Senior Software Engineer" };

function listNames(...names) {
  return names.join(", ");
}

console.log("Destructured:", name, department, firstDepartment, otherDepartments);
console.log("Copied with spread:", promotedEmployee);
console.log("Rest parameters:", listNames("Maya", "Andre", "Priya"));
console.log(`There are ${employeeCount} employees in ${departments.length} departments.`);

employeeCount += 1;
console.log("Updated employee count:", employeeCount);
