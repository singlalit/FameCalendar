let celebData = [];

// Function to load and parse the Excel file
async function loadExcel() {
    try {
        const response = await fetch("celeb_data.xlsx");
        if (!response.ok) throw new Error("Failed to fetch the Excel file");

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet data to JSON
        celebData = XLSX.utils.sheet_to_json(sheet);

        // Convert month names to a standardized format
        celebData.forEach(celeb => {
            celeb["Date of Birth(dd-mm-yyyy)"] = convertMonthNameToDate(celeb["Date of Birth(dd-mm-yyyy)"]);
        });

        console.log("Excel Data Loaded:", celebData); // Debugging (Check in Console)
    } catch (error) {
        console.error("Error loading Excel file:", error);
        document.getElementById("outputMessage").textContent = "Error loading data. Please try again.";
    }
}

// Function to convert month name to date format "DD-MM-YYYY"
function convertMonthNameToDate(dob) {
    const monthMap = {
        "January": "01",
        "February": "02",
        "March": "03",
        "April": "04",
        "May": "05",
        "June": "06",
        "July": "07",
        "August": "08",
        "September": "09",
        "October": "10",
        "November": "11",
        "December": "12"
    };

    const [day, monthName, year] = dob.split(" ");
    const month = monthMap[monthName]; // Get the month number from the map
    return `${day}-${month}-${year}`; // Return in "DD-MM-YYYY" format
}

// Call the function to load Excel data
loadExcel();

// Function to check if the entered date matches any celebrity's birthday
function checkBirthday() {
    let inputDate = document.getElementById("dateInput").value;
    
    if (!inputDate) {
        document.getElementById("outputMessage").textContent = "Please enter a date!";
        return;
    }

    let [year, month, day] = inputDate.split("-");
    let formattedDate = `${day}-${month}-${year}`; // Convert input to "DD-MM-YYYY"

    let found = celebData.find(celeb => celeb["Date of Birth(dd-mm-yyyy)"] === formattedDate);

    if (found) {
        document.getElementById("outputMessage").innerHTML = `🎉 <b>${found.Celebrity}</b> was born on this date! <br> 🌎 Nationality: ${found.Nationality}`;
    } else {
        document.getElementById("outputMessage").textContent = "❌ No celebrity birthday found for this date.";
    }
}