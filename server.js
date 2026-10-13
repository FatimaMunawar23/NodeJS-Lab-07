
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());

const FILE_NAME = "./students.json";

function readStudents() {
    return JSON.parse(fs.readFileSync(FILE_NAME, "utf8"));
}

function saveStudents(students) {
    fs.writeFileSync(FILE_NAME, JSON.stringify(students, null, 2));
}

// GET: All students
app.get("/students", (req, res) => {
    const students = readStudents();
    res.status(200).json(students);
});

// GET: Student by ID
app.get("/students/id/:id", (req, res) => {
    const students = readStudents();
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
});

// GET: Students by department
app.get("/students/department/:department", (req, res) => {
    const students = readStudents();
    const department = req.params.department.toLowerCase();

    const result = students.filter(
        s => s.department.toLowerCase() === department
    );

    res.status(200).json(result);
});

// POST: Add a student
app.post("/students", (req, res) => {
    const students = readStudents();
    const { name, department } = req.body;

    if (!name || !department) {
        return res.status(400).json({
            message: "Name and department are required"
        });
    }

    const newId = students.length
        ? Math.max(...students.map(s => s.id)) + 1
        : 1;

    const newStudent = {
        id: newId,
        name: name,
        department: department
    };

    students.push(newStudent);
    saveStudents(students);

    res.status(201).json(newStudent);
});

// PUT: Update a student
app.put("/students/:id", (req, res) => {
    const students = readStudents();
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    const { name, department } = req.body;

    if (!name || !department) {
        return res.status(400).json({
            message: "Name and department are required"
        });
    }

    student.name = name;
    student.department = department;

    saveStudents(students);

    res.status(200).json(student);
});

// DELETE: Delete a student
app.delete("/students/:id", (req, res) => {
    const students = readStudents();
    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    const deletedStudent = students.splice(index, 1)[0];

    saveStudents(students);

    res.status(200).json({
        message: "Student deleted successfully",
        student: deletedStudent
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});