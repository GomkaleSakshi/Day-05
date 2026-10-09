const STORAGE_KEY = "people-desk-employees-v1";
const DATA_URL = "./data/employees.json";
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const elements = {
  tableBody: document.querySelector("#employee-table-body"),
  totalEmployees: document.querySelector("#total-employees"),
  totalDepartments: document.querySelector("#total-departments"),
  averageSalary: document.querySelector("#average-salary"),
  resultCount: document.querySelector("#result-count"),
  tableSummary: document.querySelector("#table-summary"),
  search: document.querySelector("#employee-search"),
  departmentFilter: document.querySelector("#department-filter"),
  sortBy: document.querySelector("#sort-by"),
  sortDirection: document.querySelector("#sort-direction"),
  employeeDialog: document.querySelector("#employee-dialog"),
  employeeForm: document.querySelector("#employee-form"),
  employeeDialogTitle: document.querySelector("#employee-dialog-title"),
  employeeId: document.querySelector("#employee-id"),
  name: document.querySelector("#employee-name"),
  email: document.querySelector("#employee-email"),
  department: document.querySelector("#employee-department"),
  position: document.querySelector("#employee-position"),
  salary: document.querySelector("#employee-salary"),
  location: document.querySelector("#employee-location"),
  formError: document.querySelector("#form-error"),
  detailsDialog: document.querySelector("#details-dialog"),
  detailsContent: document.querySelector("#employee-details-content"),
  toast: document.querySelector("#toast")
};

let employees = [];
let toastTimer;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function showMessage(message, type = "success") {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.toggle("error", type === "error");
  elements.toast.hidden = false;
  toastTimer = window.setTimeout(() => { elements.toast.hidden = true; }, 3800);
}

function saveEmployees() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    return true;
  } catch (error) {
    showMessage(`Changes are visible for this session but could not be saved: ${error.message}`, "error");
    return false;
  }
}

async function loadEmployees() {
  elements.tableBody.innerHTML = '<tr><td class="table-message" colspan="6">Loading employee directory...</td></tr>';

  try {
    const savedEmployees = localStorage.getItem(STORAGE_KEY);
    if (savedEmployees !== null) {
      const parsedEmployees = JSON.parse(savedEmployees);
      if (!Array.isArray(parsedEmployees)) throw new Error("Saved employee data is not a list.");
      employees = parsedEmployees;
    } else {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error(`Employee data could not be loaded (${response.status}).`);
      const initialEmployees = await response.json();
      if (!Array.isArray(initialEmployees)) throw new Error("The employee data file is not a list.");
      employees = initialEmployees;
      saveEmployees();
    }

    renderDashboard();
  } catch (error) {
    employees = [];
    updateStatistics();
    elements.tableBody.innerHTML = `<tr><td class="table-message" colspan="6"><strong>Could not load employees</strong>${escapeHtml(error.message)} Start a local server and reload this page.</td></tr>`;
    elements.resultCount.textContent = "0";
    elements.tableSummary.textContent = "Employee records unavailable";
    showMessage("The employee directory could not be loaded.", "error");
  }
}

function updateStatistics() {
  const departments = new Set(employees.map((employee) => employee.department.trim()).filter(Boolean));
  const totalSalary = employees.reduce((total, employee) => total + Number(employee.salary || 0), 0);
  const averageSalary = employees.length ? totalSalary / employees.length : 0;

  elements.totalEmployees.textContent = String(employees.length);
  elements.totalDepartments.textContent = String(departments.size);
  elements.averageSalary.textContent = currencyFormatter.format(averageSalary);
}

function updateDepartmentFilter() {
  const selectedDepartment = elements.departmentFilter.value;
  const departments = [...new Set(employees.map((employee) => employee.department.trim()).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second));

  elements.departmentFilter.innerHTML = '<option value="">All departments</option>' + departments
    .map((department) => `<option value="${escapeHtml(department)}">${escapeHtml(department)}</option>`)
    .join("");

  if (departments.includes(selectedDepartment)) elements.departmentFilter.value = selectedDepartment;
}

function getVisibleEmployees() {
  const searchTerm = elements.search.value.trim().toLocaleLowerCase();
  const department = elements.departmentFilter.value;
  const sortKey = elements.sortBy.value;
  const direction = elements.sortDirection.value === "desc" ? -1 : 1;

  return employees
    .filter((employee) => {
      const matchesSearch = [employee.name, employee.email, employee.department]
        .some((value) => String(value).toLocaleLowerCase().includes(searchTerm));
      return matchesSearch && (!department || employee.department === department);
    })
    .sort((first, second) => {
      const comparison = sortKey === "salary"
        ? Number(first.salary) - Number(second.salary)
        : String(first[sortKey]).localeCompare(String(second[sortKey]), undefined, { sensitivity: "base" });
      return comparison * direction;
    });
}

function renderEmployeeRow(employee, index) {
  const safeId = escapeHtml(employee.id);
  return `<tr>
    <td><div class="employee-cell"><span class="employee-avatar avatar-${index % 5}" aria-hidden="true">${escapeHtml(initials(employee.name))}</span><span><strong class="employee-name">${escapeHtml(employee.name)}</strong><span class="employee-email">${escapeHtml(employee.email)}</span></span></div></td>
    <td><span class="department-tag">${escapeHtml(employee.department)}</span></td>
    <td>${escapeHtml(employee.position)}</td>
    <td>${escapeHtml(employee.location)}</td>
    <td class="salary-cell salary-column">${currencyFormatter.format(Number(employee.salary))}</td>
    <td><div class="row-actions"><button class="row-action" type="button" data-action="view" data-id="${safeId}">View</button><button class="row-action" type="button" data-action="edit" data-id="${safeId}">Edit</button><button class="row-action delete-action" type="button" data-action="delete" data-id="${safeId}">Delete</button></div></td>
  </tr>`;
}

function renderEmployees() {
  const visibleEmployees = getVisibleEmployees();
  const hasSearch = elements.search.value.trim() || elements.departmentFilter.value;
  elements.resultCount.textContent = String(visibleEmployees.length);
  elements.tableSummary.textContent = visibleEmployees.length === employees.length
    ? `Showing all ${employees.length} employees`
    : `Showing ${visibleEmployees.length} of ${employees.length} employees`;

  if (visibleEmployees.length === 0) {
    const title = employees.length === 0 ? "No employees yet" : "No employees match your search";
    const description = employees.length === 0
      ? "Add an employee to start building the directory."
      : hasSearch ? "Try a different name, email, or department." : "Add an employee to start building the directory.";
    elements.tableBody.innerHTML = `<tr><td class="table-message" colspan="6"><strong>${title}</strong>${description}</td></tr>`;
    return;
  }

  elements.tableBody.innerHTML = visibleEmployees.map(renderEmployeeRow).join("");
}

function renderDashboard() {
  updateStatistics();
  updateDepartmentFilter();
  renderEmployees();
}

function openEmployeeForm(employee = null) {
  elements.employeeForm.reset();
  elements.formError.hidden = true;
  elements.employeeId.value = employee ? String(employee.id) : "";
  elements.employeeDialogTitle.textContent = employee ? "Edit employee" : "Add employee";
  document.querySelector("#save-employee-button").textContent = employee ? "Save changes" : "Save employee";

  if (employee) {
    elements.name.value = employee.name;
    elements.email.value = employee.email;
    elements.department.value = employee.department;
    elements.position.value = employee.position;
    elements.salary.value = employee.salary;
    elements.location.value = employee.location;
  }

  elements.employeeDialog.showModal();
  elements.name.focus();
}

function showFormError(message) {
  elements.formError.textContent = message;
  elements.formError.hidden = false;
}

function handleEmployeeFormSubmit(event) {
  event.preventDefault();
  elements.formError.hidden = true;

  if (!elements.employeeForm.reportValidity()) return;

  const currentId = elements.employeeId.value;
  const formEmployee = {
    name: elements.name.value.trim(),
    email: elements.email.value.trim().toLowerCase(),
    department: elements.department.value.trim(),
    position: elements.position.value.trim(),
    salary: Number(elements.salary.value),
    location: elements.location.value.trim()
  };

  if (Object.values(formEmployee).some((value) => value === "" || (typeof value === "number" && (!Number.isFinite(value) || value <= 0)))) {
    showFormError("Enter a valid value in every field. Salary must be greater than zero.");
    return;
  }

  const duplicateEmail = employees.some((employee) => employee.email.toLowerCase() === formEmployee.email && String(employee.id) !== currentId);
  if (duplicateEmail) {
    showFormError("That work email is already in the directory.");
    return;
  }

  if (currentId) {
    employees = employees.map((employee) => String(employee.id) === currentId ? { ...employee, ...formEmployee } : employee);
    showMessage(`${formEmployee.name} has been updated.`);
  } else {
    const nextId = employees.reduce((highestId, employee) => Math.max(highestId, Number(employee.id) || 0), 0) + 1;
    employees = [...employees, { id: nextId, ...formEmployee }];
    showMessage(`${formEmployee.name} has been added.`);
  }

  saveEmployees();
  elements.employeeDialog.close();
  renderDashboard();
}

function openEmployeeDetails(employee) {
  elements.detailsContent.innerHTML = `<div class="detail-identity"><span class="employee-avatar" aria-hidden="true">${escapeHtml(initials(employee.name))}</span><div><h3>${escapeHtml(employee.name)}</h3><p>${escapeHtml(employee.position)}</p></div></div>
    <dl class="detail-list">
      <div><dt>Email</dt><dd>${escapeHtml(employee.email)}</dd></div>
      <div><dt>Department</dt><dd>${escapeHtml(employee.department)}</dd></div>
      <div><dt>Location</dt><dd>${escapeHtml(employee.location)}</dd></div>
      <div><dt>Annual salary</dt><dd>${currencyFormatter.format(Number(employee.salary))}</dd></div>
      <div><dt>Employee ID</dt><dd>${escapeHtml(employee.id)}</dd></div>
    </dl>`;
  elements.detailsDialog.showModal();
}

function handleTableAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const employee = employees.find((record) => String(record.id) === button.dataset.id);
  if (!employee) return;

  if (button.dataset.action === "view") openEmployeeDetails(employee);
  if (button.dataset.action === "edit") openEmployeeForm(employee);
  if (button.dataset.action === "delete") {
    const shouldDelete = window.confirm(`Delete ${employee.name} from the employee directory? This cannot be undone.`);
    if (!shouldDelete) return;
    employees = employees.filter((record) => String(record.id) !== String(employee.id));
    saveEmployees();
    renderDashboard();
    showMessage(`${employee.name} has been deleted.`);
  }
}

document.querySelectorAll("#add-employee-button, #add-employee-inline")
  .forEach((button) => button.addEventListener("click", () => openEmployeeForm()));
elements.employeeForm.addEventListener("submit", handleEmployeeFormSubmit);
elements.tableBody.addEventListener("click", handleTableAction);
elements.search.addEventListener("input", renderEmployees);
elements.departmentFilter.addEventListener("change", renderEmployees);
elements.sortBy.addEventListener("change", renderEmployees);
elements.sortDirection.addEventListener("change", renderEmployees);
document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => document.getElementById(button.dataset.closeDialog).close());
});
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    elements.search.focus();
  }
});

loadEmployees();
