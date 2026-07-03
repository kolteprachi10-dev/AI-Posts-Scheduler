const sheets = require("./googleSheetsService");

const convertTo24Hour = (timeStr) => {
    let [time, modifier] = timeStr.split(" ");

    let [hours, minutes] = time.split(":");

    hours = parseInt(hours);

    if (modifier === "PM" && hours !== 12) {
        hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
        hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}:00`;
};

const startScheduler = () => {

    setInterval(async () => {

        try {

            console.log("Checking scheduled posts...");

            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: process.env.SPREADSHEET_ID,
                range: "Sheet1!A:J"
            });

            const rows = response.data.values || [];

            if (rows.length <= 1) return;

            const now = new Date();

            for (let i = 1; i < rows.length; i++) {

                const row = rows[i];

                const id = row[0];
                const userId = row[1];
                const userName = row[2];
                const userEmail = row[3];
                const title = row[4];
                const platform = row[5];
                const date = row[6];
                const time = row[7];
                const caption = row[8];
                const status = row[9];

                // skip already published
                if (status && status.toLowerCase() === "published") continue;

                // safety check
                if (!date || !time) {
                    console.log("Skipping invalid row:", row);
                    continue;
                }

                // convert AM/PM safely
                const safeTime = (time.includes("AM") || time.includes("PM"))
                    ? convertTo24Hour(time)
                    : time.length === 5 ? `${time}:00` : time;

                const scheduledTime = new Date(`${date}T${safeTime}`);


                if (isNaN(scheduledTime.getTime())) {
                    console.log("Invalid date row:", date, time);
                    continue;
                }

                if (scheduledTime <= now) {

                    console.log("Publishing post:", id);

                    const updateRes = await sheets.spreadsheets.values.update({
                        spreadsheetId: process.env.SPREADSHEET_ID,
                        range: `Sheet1!J${i + 1}`,
                        valueInputOption: "RAW",
                        requestBody: {
                            values: [["Published"]]
                        }
                    });

                    console.log("Update response:", updateRes.status);

                    console.log("Published:", id);
                }
            }

        } catch (error) {
            console.log("Scheduler Error:", error.message);
        }

    }, 60000);
};

module.exports = startScheduler;