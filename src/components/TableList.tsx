"use client";

import { useLayoutEffect, useRef, useState } from 'react'
import { Container } from './Container';

const users = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function TableList(): JSX.Element {
  const checkbox: any = useRef()
  const [checked, setChecked] = useState<boolean>(false)
  const [indeterminate, setIndeterminate] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<any>([])

  useLayoutEffect(() => {
    const isIndeterminate = selectedUser.length > 0 && selectedUser.length < users.length
    setChecked(selectedUser.length === users.length)
    setIndeterminate(isIndeterminate)
    checkbox.current.indeterminate = isIndeterminate
  }, [selectedUser])

  function toggleAll() {
    setSelectedUser(checked || indeterminate ? [] : users)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  return (
    <Container className="relative">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:px-4 mt-10 sm:flex-auto">
          <h1 className="text-xl font-semibold leading-6 text-gray-900">User Lists</h1>
        </div>
        <div className="mt-5 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="relative">
                {selectedUser.length > 0 && (
                  <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                    <button
                      type="button"
                      className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    >
                      {selectedUser.length > 1 ? "Delete all" : "Delete"}
                    </button>
                  </div>
                )}
                <table className="min-w-full table-fixed divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          ref={checkbox}
                          checked={checked}
                          onChange={toggleAll}
                        />
                      </th>
                      <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {users.map((user, index) => (
                      <tr key={index} className={selectedUser.includes(user) ? 'bg-gray-50' : undefined}>
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          {selectedUser.includes(user) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            value={user.email}
                            checked={selectedUser.includes(user)}
                            onChange={(e) =>
                              setSelectedUser(
                                e.target.checked
                                  ? [...selectedUser, user]
                                  : selectedUser.filter((p: any) => p !== user)
                              )
                            }
                          />
                        </td>
                        <td
                          className={classNames(
                            'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                            selectedUser.includes(user) ? 'text-indigo-600' : 'text-gray-900'
                          )}
                        >
                          {user.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Edit<span className="sr-only">, {user.name}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
