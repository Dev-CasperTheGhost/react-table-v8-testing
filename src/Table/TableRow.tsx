import { Overwrite, Render, Row } from "@tanstack/react-table";

interface Props<RowType extends object> {
  row: Row<
    Overwrite<
      {
        Renderer: Render;
        Rendered: React.ReactNode | JSX.Element;
        Row: never;
      },
      {
        Row: RowType;
      }
    >
  >;
}

export function TableRow<RowType extends object>({ row }: Props<RowType>) {
  return (
    <tr data-row-index={row.index} key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <td className="m-0 text-left p-2 px-3" key={cell.id}>
          {cell.renderCell()}
        </td>
      ))}
    </tr>
  );
}
