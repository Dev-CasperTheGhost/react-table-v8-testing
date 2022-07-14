import { flexRender, RowData, Row } from "@tanstack/react-table";

interface Props<TData extends RowData> {
  row: Row<TData>;
}

export function TableRow<TData extends RowData>({ row }: Props<TData>) {
  return (
    <tr data-row-index={row.index} key={row.id}>
      {row.getVisibleCells().map((cell) => {
        const value =
          cell.column.id === "select" ? cell.column.columnDef.cell : cell.getValue<any>();

        return (
          <td className="m-0 text-left p-2 px-3" key={cell.id}>
            {flexRender(value, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}
