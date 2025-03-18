import React, { useState } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import {
  getExistingAssignments,
  shuffleForGift,
  validateCSVData,
} from "./utils/utils";

interface Employee {
  Employee_Name: string;
  Employee_EmailID: string;
}

interface Assignment extends Employee {
  Secret_Child_Name: string;
  Secret_Child_EmailID: string;
}
const App = () => {
  const [currentEmployeesData, setCurrentEmployeesData] = useState<Employee[]>(
    []
  );
  const [previousAssignmentsData, setPreviousAssignmentsData] = useState<
    Assignment[]
  >([]);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  // Required fields for validation
  const CurrentEmployeesRequiredFields = ["Employee_Name", "Employee_EmailID"];

  const PreviousSantaAssignRequiredFields = [
    "Employee_Name",
    "Employee_EmailID",
    "Secret_Child_Name",
    "Secret_Child_EmailID",
  ];

  // Handles file input, reads the uploaded file, and sets the state with parsed data.
  const handleFileData = (
    e: React.ChangeEvent<HTMLInputElement>,
    setData: any
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result;
      const workbook = XLSX.read(new Uint8Array(arrayBuffer as ArrayBuffer), {
        type: "array",
      });
      const sheetName = workbook.SheetNames[0];
      const sheetData: any = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheetName]
      );
      
      const isCurrentEmployeeData = setData === setCurrentEmployeesData;
      const requiredFields = isCurrentEmployeeData
        ? CurrentEmployeesRequiredFields
        : PreviousSantaAssignRequiredFields;

      if (
        setData === setPreviousAssignmentsData &&
        !validateCSVData(sheetData, requiredFields)
      ) {
        alert("Invalid  data format");
        return;
      }

      setData(sheetData);
    };
  };

  // Processes the uploaded data and generates new Secret Santa assignments.
  const createSantaGift = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentEmployeesData.length <= 1) {
      alert("Please enter valid data with more than one employee.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const validSecretSantaAssignments = getExistingAssignments(
        currentEmployeesData,
        previousAssignmentsData
      );

      const previousAssignmentsMap: any = Object.fromEntries(
        validSecretSantaAssignments.map((entry: any) => [
          entry.Employee_EmailID,
          entry.Secret_Child_EmailID,
        ])
      );
      const shuffledAssignments = shuffleForGift(
        [...currentEmployeesData],
        previousAssignmentsMap
      );
      setAssignments(shuffledAssignments);
      setLoading(false);
    }, 1000);
  };

  //Downloads the generated Secret Santa assignments as a CSV file.
  const downloadCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(assignments);
    const workbook = XLSX.utils.book_new();
    const date = new Date();
    const getCurrentYear = date.getFullYear();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Secret Santa Assignments-${getCurrentYear}`
    );
    XLSX.writeFile(workbook, `Secret_Santa_Assignments-${getCurrentYear}.xlsx`);
  };

  return (
    <div>
      <Form onSubmit={createSantaGift} className="pt-5  ">
        <Row className="d-flex justify-content-center mb-2">
          <Col lg={4}>
            <Form.Group>
              <Form.Label className=" fs-4 mb-4">
                Current Employees List
              </Form.Label>
              <Form.Control
                type="file"
                className="p-3"
                accept=".csv, .xls, .xlsx"
                onChange={(e: any) =>
                  handleFileData(e, setCurrentEmployeesData)
                }
                required
              />
            </Form.Group>
          </Col>
          <Col lg={4}>
            <Form.Group>
              <Form.Label className=" fs-4 mb-4">
                Previous Year Assignments
              </Form.Label>
              <Form.Control
                type="file"
                accept=".csv, .xls, .xlsx"
                className="p-3"
                onChange={(e: any) =>
                  handleFileData(e, setPreviousAssignmentsData)
                }
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-5 d-flex justify-content-center">
          <Col lg={2}>
            <Button className="py-3 px-4 " type="submit" disabled={loading}>
              {loading ? "Processing..." : "Generate Assignments"}
            </Button>
          </Col>
        </Row>
      </Form>

      {assignments.length > 0 && (
        <Row className="m-5 d-flex justify-content-center">
          <h3 className="mb-5 fs-3">
            Secret Santa Assignments {new Date().getFullYear()}
          </h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Employee Name</th>
                <th>Employee Email</th>
                <th>Secret Child Name</th>
                <th>Secret Child Email</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{assignment.Employee_Name}</td>
                  <td>{assignment.Employee_EmailID}</td>
                  <td>{assignment.Secret_Child_Name}</td>
                  <td>{assignment.Secret_Child_EmailID}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button
            className="d-flex justify-content-center mt-3 w-25"
            onClick={downloadCSV}
          >
            Download CSV
          </Button>
        </Row>
      )}
    </div>
  );
};

export default App;
