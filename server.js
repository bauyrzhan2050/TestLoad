// const express = require("express");
// const cors = require("cors");
// const fs = require("fs/promises");

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());

// app.post("/submit", async (req, res) => {
//   try {
//     const { firstName, lastName } = req.body;
//     if (!firstName || !lastName) {
//       return res.status(400).json({ error: "not valid data" });
//     }
//     const data = await fs.readFile("data.json", "utf-8");
//     const jsonData = JSON.parse(data);
//     jsonData.push({ firstName, lastName });

//     await fs.writeFile("data.json", JSON.stringify(jsonData, null, 2));
//     res.json({
//       success: true,
//       message: "information were added",
//     });
//   } catch (error) {
//     console.error("Error!", error);
//     res.status(500).json({ error: "server problem" });
//   }
// });

// app.listen(port, () => {
//   console.log(`server is running at http://localhost:${port}`);
// });

const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const port = 3000;
const dataFilePath = "data.json";

app.use(cors());
app.use(express.json());

app.post("/submit", async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ error: "not valid data" });
    }

    // Check if the file exists
    let data;
    try {
      await fs.access(dataFilePath);
      data = await fs.readFile(dataFilePath, "utf-8");
    } catch (readError) {
      // If the file doesn't exist, create it with an empty array
      if (readError.code === "ENOENT") {
        data = "[]";
        await fs.writeFile(dataFilePath, data);
      } else {
        console.error("Error reading data.json:", readError);
        return res.status(500).json({ error: "server problem (read)" });
      }
    }

    let jsonData;
    try {
      // Check if the data is empty before parsing
      jsonData = data.trim() ? JSON.parse(data) : [];
    } catch (parseError) {
      console.error("Error parsing JSON data:", parseError);
      return res.status(500).json({ error: "server problem (parse)" });
    }

    jsonData.push({ firstName, lastName });

    try {
      await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));
    } catch (writeError) {
      console.error("Error writing to data.json:", writeError);
      return res.status(500).json({ error: "server problem (write)" });
    }

    res.json({
      success: true,
      message: "information were added",
    });
  } catch (error) {
    console.error("Error!", error);
    res.status(500).json({ error: "server problem" });
  }
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
