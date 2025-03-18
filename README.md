# Secret Santa Assignment System

## Overview
This project is a **Secret Santa assignment system** built with **React**. It allows users to upload two CSV files—one containing the list of current employees and another with last year's assignments. The system ensures that:

- Employees are randomly assigned a Secret Santa recipient.
- No one is assigned to themselves.
- Previous year assignments are avoided.
- The results can be downloaded as a new CSV file.

## Features
- 📂 **CSV Upload**: Upload current employee list and previous year's assignments.
- 🔄 **Shuffling Algorithm**: Ensures a fair and unique assignment.
- ✅ **Validation**: Checks for missing employees, incorrect file formats, and ensures a valid assignment.
- 📤 **Downloadable Output**: Exports the final Secret Santa assignments as a CSV file.
- 🛠 **Error Handling**: Alerts users when assignments fail or files are invalid.

## Installation & Setup

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn

### Steps to Run Locally
```bash
# Clone the repository
git clone https://github.com/murugappanDev/DigitalXC.git
cd DigitalXC

# Install dependencies
npm install  # or yarn install

# Start the application
npm start  # or yarn start
```

The app should now be running at `http://localhost:3000`.

## How to Use
1. Upload the **current employees CSV file**.
2. Upload the **previous year’s assignments CSV file**.
3. Click the `Generate Assignments` button.
4. Review the generated Secret Santa pairings.
5. Click `Download CSV` to save the new assignments.

## CSV File Format
### **Current Employees CSV Format**
| Employee_Name | Employee_EmailID |
|--------------|----------------|
| Alice        | alice@example.com |
| Bob          | bob@example.com |

### **Previous Year’s Assignments CSV Format**
| Employee_EmailID | Secret_Child_EmailID |
|-----------------|---------------------|
| alice@example.com | bob@example.com |
| bob@example.com   | charlie@example.com |

## Error Handling
- If an **invalid CSV format** is uploaded, an alert will notify the user.
- If **no valid assignment** is possible (e.g., circular dependencies), a retry mechanism will attempt to reshuffle.
- If the **shuffling algorithm fails after multiple attempts**, the user will be notified.