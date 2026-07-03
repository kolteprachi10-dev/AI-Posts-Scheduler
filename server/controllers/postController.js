const sheets = require("../services/googleSheetsService");

// =======================
// CREATE POST
// =======================

const createPost = async (req, res) => {

    try {

            console.log("========== CREATE POST ==========");
            console.log("USER:", req.user);
            console.log("BODY:", req.body);

        const {
            title,
            platform,
            date,
            time,
            caption
        } = req.body;

        const id = Date.now().toString();

        await sheets.spreadsheets.values.append({

            spreadsheetId: process.env.SPREADSHEET_ID,

            range: "Sheet1!A:J",

            valueInputOption: "USER_ENTERED",

            requestBody: {

                values: [[

                    id,

                    req.user.id,

                    req.user.name,

                    req.user.email,

                    title,

                    platform,

                    date,

                    time,

                    caption,

                    "Pending"

                ]]

                

            }

        });

        res.json({

            success: true,

            message: "Post Saved Successfully"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Error Saving Post"

        });

    }

};

// =======================
// GET POSTS
// =======================

const getPosts = async (req, res) => {

    try {

        const response = await sheets.spreadsheets.values.get({

            spreadsheetId: process.env.SPREADSHEET_ID,

            range: "Sheet1!A:J"

        });

        const rows = response.data.values || [];

        if (rows.length <= 1) {

            return res.json([]);

        }

        const posts = rows

            .slice(1)

            .map((row, index) => ({

                rowNumber: index + 2,

                id: row[0] || "",

                userId: row[1] || "",

                userName: row[2] || "",

                userEmail: row[3] || "",

                title: row[4] || "",

                platform: row[5] || "",

                date: row[6] || "",

                time: row[7] || "",

                caption: row[8] || "",

                status: row[9] || ""

            }))

            .filter(post => post.userEmail === req.user.email);

        res.json(posts);

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Error Fetching Posts"

        });

    }

};

// =======================
// DELETE POST
// =======================

const deletePost = async (req, res) => {

    try {

        const rowNumber = Number(req.params.rowNumber);

        await sheets.spreadsheets.batchUpdate({

            spreadsheetId: process.env.SPREADSHEET_ID,

            requestBody: {

                requests: [

                    {

                        deleteDimension: {

                            range: {

                                sheetId: 0,

                                dimension: "ROWS",

                                startIndex: rowNumber - 1,

                                endIndex: rowNumber

                            }

                        }

                    }

                ]

            }

        });

        res.json({

            success: true,

            message: "Post Deleted Successfully"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Error Deleting Post"

        });

    }

};

// =======================
// UPDATE POST
// =======================

const updatePost = async (req, res) => {

    try {

        const rowNumber = req.params.rowNumber;

        const {

            title,

            platform,

            date,

            time,

            caption

        } = req.body;

        await sheets.spreadsheets.values.update({

            spreadsheetId: process.env.SPREADSHEET_ID,

            range: `Sheet1!E${rowNumber}:J${rowNumber}`,

            valueInputOption: "USER_ENTERED",

            requestBody: {

                values: [[

                    title,

                    platform,

                    date,

                    time,

                    caption,

                    "Pending"

                ]]

            }

        });

        res.json({

            success: true,

            message: "Post Updated Successfully"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Error Updating Post"

        });

    }

};

module.exports = {

    createPost,

    getPosts,

    deletePost,

    updatePost

};