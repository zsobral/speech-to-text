import { HTMLProps } from "react";

export function Checkbox(
  props: { label: string } & HTMLProps<HTMLInputElement>
) {
  return (
    <div className="flex items-center">
      <input
        id={props.id}
        type="checkbox"
        className="w-4 h-4"
        checked={props.checked}
        onChange={props.onChange}
      />
      <label htmlFor={props.id} className="ms-2">
        {props.label}
      </label>
    </div>
  );
}
