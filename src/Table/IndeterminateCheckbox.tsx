import * as React from "react";
import { _Table } from "./Table";

export function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & React.HTMLAttributes<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = indeterminate;
    }
  }, [ref, indeterminate]);

  return <input type="checkbox" ref={ref} className={className + " cursor-pointer"} {...rest} />;
}

export function makeCheckboxHeader<RowType extends object>(table: _Table<RowType>) {
  return table.createDisplayColumn({
    id: "select",
    header: ({ instance }) => (
      <IndeterminateCheckbox
        {...{
          checked: instance.getIsAllRowsSelected(),
          indeterminate: instance.getIsSomeRowsSelected(),
          onChange: instance.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  });
}
