import { HTMLProps } from "react"

interface SelectInputProps extends HTMLProps<HTMLSelectElement> {
  name: string
}

export default function SelectInput({ name, ...props }: SelectInputProps):JSX.Element {
  return (
    <div className="mt-4">
      {props.label && <label>{props.label}</label>}
      <select
        {...props}
        name={name}
        className="h-14 text-base outline-none block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 ring-1 ring-inset ring-blue-300 focus:ring-2 focus:ring-blue-500 sm:text-base sm:leading-6 placeholder-red-200"
        defaultValue="Select contact type"
      >
        <option disabled selected>Select contact type</option>
        <option value="Friend">Friend</option>
        <option value="Colleague">Colleague</option>
        <option value="Mate">Mate</option>
      </select>
    </div>
  )
}
