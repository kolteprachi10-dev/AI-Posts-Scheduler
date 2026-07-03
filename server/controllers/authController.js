const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sheets = require("../services/googleSheetsService");

// ============================
// REGISTER
// ============================

const register = async (req, res) => {
    try {

        console.log("✅ Register API Called");

        const { name, email, password } = req.body;

        console.log("Body:", req.body);

        console.log("Reading Users Sheet...");

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: "Users!A:D"
        });

        console.log("Users Sheet Read Successfully");

        const rows = response.data.values || [];

        const exists = rows.slice(1).find(row => row[2] === email);

        if (exists) {
            return res.json({
                success: false,
                message: "Email already exists"
            });
        }

        console.log("Hashing Password...");

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Password Hashed");

        const id = Date.now().toString();

        console.log("Saving User...");

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: "Users!A:D",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[id, name, email, hashedPassword]]
            }
        });

        console.log("User Saved");

        res.json({
            success: true,
            message: "Registration Successful"
        });

    } catch (error) {

        console.error("REGISTER ERROR:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

// ============================
// LOGIN
// ============================

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: "Users!A:D"
        });

        const rows = response.data.values || [];

        const user = rows.slice(1).find(row => row[2] === email);

        console.log("USER FROM SHEET:", user);

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid Email"
            });
        }

        const match = await bcrypt.compare(password, user[3]);

        if (!match) {
            return res.json({
                success: false,
                message: "Invalid Password"
            });
        }

        const payload = {
            id: user[0],
            name: user[1],
            email: user[2]
        };

        console.log("JWT PAYLOAD:", payload);

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        console.log("GENERATED TOKEN:", token);

        res.json({
            success: true,
            message: "Login Successful",
            token,
            user: payload
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

module.exports = {

    register,

    login

};