const fs = require("fs");

const fileName = "test.txt";
const initialContent = "Hello Node.js\n";
const updatedContent = "Learning FS Module\n";

// Create File
console.log("Creating File...");

fs.writeFile(fileName, initialContent, (err) => {
    if (err) {
        console.log("Error creating file:", err.message);
        return;
    }

    console.log("File Created");

    // Read File
    console.log("Reading File...");

    fs.readFile(fileName, "utf8", (err, data) => {
        if (err) {
            console.log("Error reading file:", err.message);
            return;
        }

        console.log(data.trim());

        // Update File
        console.log("Updating File...");

        fs.appendFile(fileName, updatedContent, (err) => {
            if (err) {
                console.log("Error updating file:", err.message);
                return;
            }

            console.log("File Updated");

            // Read updated content
            fs.readFile(fileName, "utf8", (err, data) => {
                if (err) {
                    console.log("Error reading updated file:", err.message);
                    return;
                }

                console.log(data.trim());

                // Delete File
                console.log("Deleting File...");

                fs.unlink(fileName, (err) => {
                    if (err) {
                        console.log("Error deleting file:", err.message);
                        return;
                    }

                    console.log("File Deleted");
                });
            });
        });
    });
});