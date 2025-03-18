interface CurrentEmployees {
  Employee_Name: string;
  Employee_EmailID: string;
}

interface PreviousAssignments {
  Employee_Name: string;
  Employee_EmailID: string;
  Secret_Child_Name: string;
  Secret_Child_EmailID: string;
}
// interface PreviousAssignmentsData
/**
  Filters previous Secret Santa assignments to retain only those
  belonging to employees who are still part of the current organization. **/
export const getExistingAssignments = (
  currentEmployees: CurrentEmployees[],
  previousAssignments: PreviousAssignments[]
) => {
  console.log(previousAssignments, "previousAssignments");

  const currentEmployeeEmails = new Set(
    currentEmployees.map((emp) => emp.Employee_EmailID)
  );

  return previousAssignments.filter((prevAssign) =>
    currentEmployeeEmails.has(prevAssign.Employee_EmailID)
  );
};

/**
  Assigns a Secret Santa recipient to each employee while avoiding
  self-assignment and ensuring that no one receives the same recipient
  as the previous year. 
  **/
export const shuffleForGift = (
  employees: CurrentEmployees[],
  previousAssignments: Record<string, string>
) => {


  let available: CurrentEmployees[] = [...employees];
  let result = [];
  for (let employee of employees) {
    // Filter choices to exclude self-assignment and previous year's assignment
    let choices = available.filter(
      (e) =>
        e.Employee_EmailID !== employee.Employee_EmailID &&
        previousAssignments[employee.Employee_EmailID] !== e.Employee_EmailID
    );

    // If no valid choices are available, return an empty list and alert the user
    if (choices.length === 0) {
      alert("No valid assignments possible. Try reassigning.");
      return [];
    }

    // Select a random valid recipient
    let secretChild = choices[Math.floor(Math.random() * choices.length)];

    // Store the assignment
    result.push({
      Employee_Name: employee.Employee_Name,
      Employee_EmailID: employee.Employee_EmailID,
      Secret_Child_Name: secretChild.Employee_Name,
      Secret_Child_EmailID: secretChild.Employee_EmailID,
    });

    // Remove the assigned recipient from the available list
    available = available.filter(
      (e) => e.Employee_EmailID !== secretChild.Employee_EmailID
    );
  }
  return result;
};

/**
  Validates if all required fields exist in each entry of the given CSV data.
 **/
export const validateCSVData = (data: [], requiredFields: string[]) => {
  return data.every((entry) => requiredFields.every((field) => field in entry));
};
