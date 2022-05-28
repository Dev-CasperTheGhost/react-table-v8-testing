import * as React from "react";
import {
  AccessorFn,
  ColumnDef,
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  Overwrite,
  Render,
  RowSelectionState,
  SortingState,
  Table as ITable,
  TableGenerics,
  useTableInstance,
} from "@tanstack/react-table";
import { makeCheckboxHeader } from "./IndeterminateCheckbox";
import { TableRow } from "./TableRow";

type ColumnTest<TAccessor> = Overwrite<
  ColumnDef<
    Overwrite<
      TableGenerics,
      {
        Value: TableGenerics["Row"][TAccessor];
      }
    >
  >,
  {
    id?: string;
  }
>;

export type _Table<RowType extends object> = ITable<
  Overwrite<
    { Row: never; Renderer: Render; Rendered: React.ReactNode | JSX.Element },
    { Row: RowType }
  >
>;

export interface TableColumn<RowType extends object> extends ColumnTest<keyof RowType> {
  key: keyof RowType | AccessorFn<RowType>;
}

interface Props<RowType extends object> {
  data: RowType[];
  columns: TableColumn<RowType>[];
  options?: {
    rowSelection: RowSelectionState;
    setRowSelection: OnChangeFn<RowSelectionState>;
  };
}

export function Table<RowType extends object>({ data, columns, options }: Props<RowType>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = React.useMemo(() => createTable().setRowType<RowType>(), []);

  const tableColumns = React.useMemo(() => {
    let cols = columns.map((column) =>
      table.createDataColumn(column.key, {
        ...column,
        cell: (info: any) => info.getValue(),
      } as any),
    );

    if (options?.rowSelection) {
      cols = [makeCheckboxHeader(table), ...cols];
    }

    return cols;
  }, [columns, options]);

  const instance = useTableInstance(table, {
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: options?.setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    state: {
      rowSelection: options?.rowSelection,
      sorting,
    },
  });

  return (
    <table className="w-full overflow-hidden whitespace-nowrap max-h-64">
      <thead>
        {instance.getHeaderGroups().map((headerGroup) => (
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
                  {header.isPlaceholder ? null : header.renderHeader()}
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
        {instance.getRowModel().rows.map((row) => (
          <TableRow key={row.id} row={row} />
        ))}
      </tbody>
    </table>
  );
}

function classnames(...array: unknown[]) {
  return array.filter(Boolean).join(" ");
}
