document.addEventListener("DOMContentLoaded", function () {
    console.log("Loading CSV file...");

    Papa.parse("data.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            if (!results.data || results.data.length === 0) {
                console.error("CSV is empty or incorrectly formatted.");
                return;
            }

            // Convert dates to match input format (YYYY-MM-DD)
            results.data.forEach(celeb => {
                let dateParts = celeb["Date of Birth"].split("-");
                if (dateParts.length === 3) {
                    let monthMap = {
                        "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04",
                        "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
                        "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
                    };

                    let formattedDate = `19${dateParts[2]}-${monthMap[dateParts[1]]}-${dateParts[0].padStart(2, "0")}`;
                    celeb["Formatted Date"] = formattedDate;
                }
            });

            window.celebrityData = results.data;
            console.log("CSV Loaded Successfully:", window.celebrityData);
        },
        error: function (error) {
            console.error("Error loading CSV file:", error);
        }
    });
});

function checkBirthday() {
    let dateInput = document.getElementById("dateInput").value;
    let outputMessage = document.getElementById("outputMessage");

    if (!dateInput) {
        outputMessage.innerHTML = "❌ Please select a date.";
        return;
    }

    if (!window.celebrityData || window.celebrityData.length === 0) {
        outputMessage.innerHTML = "⚠️ Error: Data is not loaded yet. Please try again.";
        console.error("Error: celebrityData is undefined or empty.");
        return;
    }

    let formattedDate = new Date(dateInput).toISOString().split("T")[0];

    let foundCelebrities = window.celebrityData.filter(celeb => celeb["Formatted Date"] === formattedDate);

    if (foundCelebrities.length > 0) {
        let names = foundCelebrities.map(celeb => `${celeb.Name} (${celeb.Nationality})`).join(", ");
        outputMessage.innerHTML = `🎉 Celebrities born on this date: ${names}`;
    } else {
        outputMessage.innerHTML = "❌ No celebrity found with this birth date.";
    }
}
