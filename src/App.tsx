import { RowSelectionState } from "@tanstack/react-table";
import * as React from "react";
import "./App.css";
import { Table } from "./Table/Table";

const defaultData = [
  {
    firstName: "tanner",
    lastName: "linsley",
    age: 24,
    visits: 100,
    status: "In Relationship",
    progress: 50,
    actions: <button className="p-0.5 px-1.5 bg-gray-200 rounded-md">action</button>,
  },
  {
    firstName: "tandy",
    lastName: "miller",
    age: 40,
    visits: 40,
    status: "Single",
    progress: 80,
    actions: <button className="p-0.5 px-1.5 bg-gray-200 rounded-md">action</button>,
  },
  {
    firstName: "joe",
    lastName: "dirte",
    age: 45,
    visits: 20,
    status: "Complicated",
    progress: 10,
    actions: <button className="p-0.5 px-1.5 bg-gray-200 rounded-md">action</button>,
  },
];

export default function App() {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  return (
    <div className="grid place-content-center mt-10 w-full">
      <div className="w-[500px]">
        <Table
          options={{ rowSelection, setRowSelection }}
          data={defaultData}
          columns={[
            {
              accessorKey: "firstName",
              header: (data) => {
                return "First Name";
              },
            },
            { accessorKey: "lastName", header: "Last Name" },
            { accessorKey: "status", header: "Status" },
            { accessorKey: "age", header: "Age" },
            { accessorKey: "visits", header: "Visits", enableSorting: false },
            { accessorKey: "actions", header: "Actions" },
          ]}
        />
      </div>
    </div>
  );
}
