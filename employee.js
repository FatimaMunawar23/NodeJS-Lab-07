
const fs = require("fs");

const fileName = "./employees.json";

const data = fs.readFileSync(fileName, "utf8");
const employees = JSON.parse(data);

console.log("Existing Employees:");
console.log(employees);

const newEmployee = {
    id: 6,
    name: "Fatima",
    department: "IT"
};

employees.push(newEmployee);

fs.writeFileSync(
    fileName,
    JSON.stringify(employees, null, 2),
    "utf8"
);

console.log("New employee added successfully.");
console.log("Total Employees:", employees.length);