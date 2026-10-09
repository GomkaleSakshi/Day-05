# Day-05: JavaScript Practice and Employee Dashboard

A beginner-friendly JavaScript practice set and a responsive employee directory dashboard built with HTML, CSS, and modern vanilla JavaScript. The dashboard loads its starter records from a local JSON file and supports employee CRUD in the browser with `localStorage` persistence.

## Features

- JavaScript fundamentals, array methods, advanced language concepts, and HTTP/REST practice.
- Dashboard statistics for employee count, department count, and average annual salary.
- Search by employee name, email, or department; filter by department; sort by name, salary, or department.
- Employee detail view, add, edit, and confirmed delete actions.
- Required-field, email, positive-salary, and duplicate-email validation.
- Responsive table layout, loading/error/empty states, and status messages.
- Data saved in the current browser's `localStorage` after the initial JSON load.

## Folder Structure

```text
Day-05/
├── javascript/
│   ├── fundamentals.js
│   ├── array-methods.js
│   ├── advanced-javascript.js
│   └── api-practice.js
├── employee-dashboard/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── data/
│       └── employees.json
└── README.md
```

## Technologies

- HTML5 and CSS3
- Vanilla JavaScript (ES modules and browser Fetch API)
- JSON and browser `localStorage`
- Node.js for running the standalone practice files

No framework or package installation is required. The dashboard uses Google Fonts when internet access is available and has local fallback fonts.

## Run the Dashboard in VS Code

The dashboard fetches `employee-dashboard/data/employees.json`, so it must be served over HTTP. Do not open `index.html` as a `file://` URL.

### Option 1: Live Server extension

1. Open the `Day-05` folder in VS Code.
2. If Live Server is not installed, open Extensions with `Ctrl+Shift+X`, search for **Live Server** by Ritwick Dey, and install it.
3. In the Explorer, right-click `employee-dashboard/index.html` and choose **Open with Live Server**. You can also open the file and click **Go Live** in the status bar.
4. The browser opens a local address, usually `http://127.0.0.1:5500/employee-dashboard/`.

### Option 2: Python local server

Open a VS Code terminal in the `Day-05` folder and run:

```powershell
python -m http.server 8000
```

Then visit <http://localhost:8000/employee-dashboard/>. Keep the terminal running while you use the dashboard; press `Ctrl+C` to stop the server.

## Run the JavaScript Practice Files with Node.js

Install Node.js if it is not already available, then open a terminal in the `Day-05` folder. Run the standalone files with:

```powershell
node javascript/fundamentals.js
node javascript/array-methods.js
node javascript/api-practice.js
```

`api-practice.js` needs internet access. Node.js 18 or later has a built-in Fetch API; use a current Node.js release for the examples.

### ES Modules Example

`advanced-javascript.js` uses `export` and top-level `await`, so run it as an ES module. Current Node.js versions detect the module syntax when running this file directly:

```powershell
node javascript/advanced-javascript.js
```

The file exports `createEmployeeCounter` and `describeRole`. Another ES module can import them with `import { createEmployeeCounter, describeRole } from "./advanced-javascript.js";`. Because the requested project structure has no `package.json`, Node may print a module-type detection warning; it still runs the file as an ES module. In the browser, the dashboard's `app.js` is loaded with `<script type="module">`.

## CRUD and Data Persistence

On its first successful load, the dashboard uses Fetch to read `employee-dashboard/data/employees.json` and stores that list in `localStorage` under `people-desk-employees-v1`. Add, edit, and delete actions update the in-memory list and save the resulting list to `localStorage`; refreshing the page keeps those changes in that browser. The supplied JSON is the initial seed, not a server-side database. Clearing this site's browser storage removes saved changes; reload then starts again from the JSON file. Storage is local to the browser and device and is not shared between users.

## Public Demo API

`javascript/api-practice.js` uses JSONPlaceholder (`https://jsonplaceholder.typicode.com`) to demonstrate GET, POST, PUT, and DELETE with JSON and Fetch. JSONPlaceholder is a public testing service: POST/PUT/DELETE responses are simulated and changes do not permanently persist. Network access is required. The dashboard's own CRUD is separate and uses localStorage.

## Testing Checklist

- [ ] Start a local server and confirm the dashboard loads all 12 employees from the JSON file.
- [ ] Confirm total employee count, department count, and average salary appear.
- [ ] Search by a name, email, and department; try a query with no matches.
- [ ] Filter departments and sort by name, salary, and department in both directions.
- [ ] Open an employee's details, edit the record, refresh, and confirm the edit persists.
- [ ] Add a valid employee, refresh, and confirm it persists.
- [ ] Try invalid/empty fields, an invalid email, a non-positive salary, and a duplicate email.
- [ ] Delete an employee and test both confirming and cancelling the confirmation prompt.
- [ ] Run each JavaScript practice command, including the ES module command.
- [ ] Check the dashboard at desktop and mobile widths.

## Upload to GitHub

Create an empty GitHub repository named `Day-05` first, without adding a README/license/gitignore there. From the VS Code terminal, run these commands in the `Day-05` folder, replacing the remote URL with your repository URL:

```powershell
git init
git add .
git commit -m "Complete Day-05 JavaScript and employee dashboard project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/Day-05.git
git push -u origin main
```
