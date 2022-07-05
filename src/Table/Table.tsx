import * as React from "react";
import {
  RowSelectionState,
  SortingState,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
  OnChangeFn,
  getSortedRowModel,
} from "@tanstack/react-table";
import { makeCheckboxHeader } from "./IndeterminateCheckbox";
import { TableRow } from "./TableRow";

interface Props<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  options?: {
    rowSelection: RowSelectionState;
    setRowSelection: OnChangeFn<RowSelectionState>;
  };
}

export function Table<TData extends RowData>({ data, columns, options }: Props<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const tableColumns = React.useMemo(() => {
    let cols = columns;

    if (options?.rowSelection) {
      cols = [makeCheckboxHeader(), ...cols];
    }

    return cols;
  }, [columns, options?.rowSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: options?.setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      rowSelection: options?.rowSelection,
    },
  });

  return (
    <table className="w-full overflow-hidden whitespace-nowrap max-h-64">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const canSort = header.id === "actions" ? false : header.column.getCanSort();

              return (
                <th
                  className={classnames(
                    "m-0 top-0 sticky p-2 px-3 font-semibold bg-gray-200 dark:bg-gray-3 lg:table-cell text-left select-none",
                    "first:rounded-tl-md last:rounded-tr-md",
                    canSort && "cursor-pointer select-none",
                  )}
                  key={header.id}
                  colSpan={header.colSpan}
                  data-column-index={header.index}
                  onClick={(event) => {
                    if (!canSort) return;
                    header.column.getToggleSortingHandler()?.(event);
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} row={row} />
        ))}
      </tbody>
    </table>
  );
}

function classnames(...array: unknown[]) {
  return array.filter(Boolean).join(" ");
}
