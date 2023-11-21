import type { HTMLProps } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

interface InputFieldProps extends HTMLProps<HTMLInputElement> {
// type InputFieldProps = {
  error?: boolean;
  placeholder: string;
  errorMessage?: string;
  name: string;
  type: string;
}

export default function InputField({name, type, error, placeholder, errorMessage, ...props}: InputFieldProps):JSX.Element {
  return (
    <div className="w-full">
      <div className="relative rounded-md shadow-sm mt-4">
        {props.label && <label>{props.label}</label>}
        <input
          {...props}
          type={type}
          name={name}
          className={`p-3 h-14 block w-full rounded-md border-0 py-1.5 pr-10 text-xl sm:text-base outline-none ${error ? `text-red-600 ring-1 ring-inset ring-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500` : `text-black ring-1 ring-inset ring-blue-300 focus:ring-2 focus:ring-inset focus:ring-blue-500`} `}
          placeholder={placeholder}
          aria-invalid="true"
        />
        {error && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ExclamationCircleIcon className="h-5 w-5 text-red-600" aria-hidden="true" />
        </div>}
      </div>
      {error && <p className="mt-1 text-base text-red-600" id="email-error">
        {errorMessage}
      </p>}
    </div>
  )
}
