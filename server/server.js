const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pwd",
});

db.connect((err) => {
  if (err) console.log("❌ MySQL connection error:", err);
  else console.log("✅ Connected to MySQL Database");
});


// ✅ LOGIN ENDPOINT
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ success: false, message: "Username and password required" });

  const sql = "SELECT * FROM tbl_admin WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (results.length > 0) {
      const user = results[0];
      res.json({
        success: true,
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          accounttype: user.accounttype,
          status: user.status,
        },
      });
    } else res.json({ success: false, message: "Invalid username or password" });
  });
});


// ✅ Verify Admin
app.get("/verify-admin/:id", (req, res) => {
  const sql = "SELECT * FROM tbl_admin WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (results.length > 0) res.json({ success: true, admin: results[0] });
    else res.json({ success: false, message: "Admin not found" });
  });
});


// ✅ BENEFICIARIES CRUD

// Get all beneficiaries
app.get("/api/beneficiaries", (req, res) => {
  db.query("SELECT * FROM tbl_pwd", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add new beneficiary
app.post("/api/beneficiaries", (req, res) => {
  const {
    firstname,
    lastname,
    middlename,
    suffix,
    gender,
    age,
    birthdate,
    disability_type,
    id_number,
    status,
  } = req.body;

  if (!firstname || !lastname || !gender || !age || !birthdate || !disability_type || !id_number) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO tbl_pwd 
    (firstname, lastname, middlename, suffix, gender, age, birthdate, disability_type, id_number, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      firstname,
      lastname,
      middlename || null,
      suffix || null,
      gender,
      age,
      birthdate,
      disability_type,
      id_number,
      status || "pending",
    ],
    (err, result) => {
      if (err) {
        console.error("Error adding beneficiary:", err);
        return res.status(500).json({ error: "Failed to add beneficiary" });
      }
      res.json({ success: true, id: result.insertId });
    }
  );
});

// Edit beneficiary
app.put("/api/beneficiaries/:id", (req, res) => {
  const {
    firstname,
    lastname,
    middlename,
    suffix,
    gender,
    age,
    birthdate,
    disability_type,
    id_number,
  } = req.body;

  if (!firstname || !lastname || !gender || !age || !birthdate || !disability_type || !id_number) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    UPDATE tbl_pwd 
    SET firstname=?, lastname=?, middlename=?, suffix=?, gender=?, age=?, birthdate=?, disability_type=?, id_number=? 
    WHERE id=?
  `;

  db.query(
    sql,
    [
      firstname,
      lastname,
      middlename || null,
      suffix || null,
      gender,
      age,
      birthdate,
      disability_type,
      id_number,
      req.params.id,
    ],
    (err) => {
      if (err) {
        console.error("Error updating beneficiary:", err);
        return res.status(500).json({ error: "Failed to update beneficiary" });
      }
      res.json({ success: true });
    }
  );
});

// Delete beneficiary
app.delete("/api/beneficiaries/:id", (req, res) => {
  db.query("DELETE FROM tbl_pwd WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Error deleting beneficiary:", err);
      return res.status(500).json({ error: "Failed to delete beneficiary" });
    }
    res.json({ success: true });
  });
});

// Approve beneficiary
app.post("/api/beneficiaries/:id/approve", (req, res) => {
  db.query("UPDATE tbl_pwd SET status = 'approved' WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Reject beneficiary
app.post("/api/beneficiaries/:id/reject", (req, res) => {
  db.query("UPDATE tbl_pwd SET status = 'rejected' WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


// ✅ STAFF CRUD
app.get("/api/staff", (req, res) => {
  db.query("SELECT * FROM tbl_staff", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/api/staff", (req, res) => {
  const { firstname, lastname, username, password, accounttype } = req.body;
  const sql =
    "INSERT INTO tbl_staff (firstname, lastname, username, password, accounttype, status) VALUES (?, ?, ?, ?, ?, 'active')";
  db.query(sql, [firstname, lastname, username, password, accounttype], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete("/api/staff/:id", (req, res) => {
  db.query("DELETE FROM tbl_staff WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


// ✅ Certificate Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.post("/api/certificates/:beneficiaryId", upload.single("certificate"), (req, res) => {
  const sql = "INSERT INTO tbl_certificates (pwd_id, filename) VALUES (?, ?)";
  db.query(sql, [req.params.beneficiaryId, req.file.filename], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


// ✅ Dashboard Summary
app.get("/api/dashboard-summary", (req, res) => {
  const summary = {};
  db.query("SELECT COUNT(*) AS total_pwd FROM tbl_pwd", (err, result1) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching PWD data" });
    summary.total_pwd = result1[0].total_pwd;

    db.query("SELECT COUNT(*) AS total_admin FROM tbl_admin", (err, result2) => {
      if (err) return res.status(500).json({ success: false, message: "Error fetching admin data" });
      summary.total_admin = result2[0].total_admin;

      res.json({ success: true, summary });
    });
  });
});


// ✅ Admin Summary
app.get("/api/admin-summary", (req, res) => {
  const sql = `
    SELECT 
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_admins,
      SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactive_admins
    FROM tbl_admin
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, summary: result[0] });
  });
});


// ✅ Admin List
app.get("/api/admins", (req, res) => {
  const sql = "SELECT id, firstname, lastname, accounttype, status FROM tbl_admin";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching admins:", err);
      return res.status(500).json({ success: false, message: "Error fetching admins" });
    }
    res.json(results);
  });
});


// ✅ Start Server
app.listen(8081, () => {
  console.log("🚀 Backend running on http://localhost:8081");
});
