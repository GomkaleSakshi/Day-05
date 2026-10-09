const employees = [
  { name: "Maya Chen", department: "Engineering", salary: 82000, active: true },
  { name: "Andre Lewis", department: "People", salary: 68000, active: true },
  { name: "Priya Nair", department: "Design", salary: 76000, active: false },
  { name: "Jordan Brooks", department: "Engineering", salary: 91000, active: true },
  { name: "Elena Garcia", department: "Finance", salary: 73000, active: true }
];

const employeeNames = employees.map((employee) => employee.name);
const engineeringTeam = employees.filter((employee) => employee.department === "Engineering");
const totalSalary = employees.reduce((total, employee) => total + employee.salary, 0);
const designLead = employees.find((employee) => employee.department === "Design");
const hasHighEarner = employees.some((employee) => employee.salary >= 90000);
const everyoneHasSalary = employees.every((employee) => employee.salary > 0);
const sortedBySalary = [...employees].sort((first, second) => first.salary - second.salary);

console.log("map() employee names:", employeeNames);
console.log("filter() engineering team:", engineeringTeam);
console.log("reduce() total salary:", totalSalary);
console.log("find() design employee:", designLead);
console.log("some() salary at least $90,000:", hasHighEarner);
console.log("every() salary is positive:", everyoneHasSalary);
console.log("sort() by salary, lowest first:", sortedBySalary);
