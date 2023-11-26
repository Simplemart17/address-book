"use client";

import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { Container } from './Container';
import axios from 'axios';
import SlideOver from './SlideOver';
import { Button } from './Button';
import InputField from './InputField';
import { useFormik } from 'formik';
import { BackgroundImage } from './BackgroundImage';
import * as Yup from 'yup';
import ConfirmationModal from './modals/ConfirmationModal';
import { useRouter } from 'next/navigation';
import { v2Api } from '@/config/axiosInstance';
import { PageLoader } from './PageLoader';
import Notification from './modals/Notification';
import { NotificationProps } from './Landing';

type userProps = {
  email: string;
  full_name: string;
  user_id: string;
  user_type: string;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function TableList(): JSX.Element {
  const checkbox: any = useRef();
  const [checked, setChecked] = useState<boolean>(false);
  const [openSlideOver, setOpenSlideOver] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<userProps[]>([]);
  const [users, setUsers] = useState<userProps[]>([]);
  const [singleUser, setSingleUser] = useState<userProps>();
  const [userEmail, setUserEmail] = useState<string>("");
  const [updated, setUpdated] = useState<boolean>(false);
  const [confirmationDialog, setConfirmationDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<NotificationProps>({status: false, message: ""});
  const [openModal, setOpenModal] = useState<boolean>(false);
  const router = useRouter();

  useLayoutEffect(() => {
    const email = localStorage.getItem('email');

    if (!email) {
      router.push("/");
    }

    const fetchUserData = async () => {
      if (email) {
        const { data } = await v2Api.get(`/api/v2/users/${email}`);
        if (data?.data?.user_type !== "admin") {
          router.push("/");
        }
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('/api/v2/users');
      setUsers(data?.data);
    }

    fetchData();
  }, [updated])

  useEffect(() => {
    const fetchSingleData = async () => {
      if (userEmail) {
        const { data } = await v2Api.get(`/api/v2/users/${userEmail}`);
        setSingleUser(data?.data);
      }
    }

    fetchSingleData();
  }, [userEmail]);

  useLayoutEffect(() => {
    const isIndeterminate = selectedUser.length > 0 && selectedUser.length < users.length
    setChecked(selectedUser.length === users.length)
    setIndeterminate(isIndeterminate)
    checkbox.current.indeterminate = isIndeterminate
  }, [selectedUser, users.length]);

  function toggleAll() {
    setSelectedUser(checked || indeterminate ? [] : users);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  };

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    isSubmitting
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: singleUser?.full_name ?? "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().min(3, "Enter minimum of three characters").required('This field is required'),
    }),
    onSubmit: async (values: any) => {
      const { data } = await axios.patch(`/api/v2/users/${singleUser?.email}`, values);
      if (data.success) {
        setOpenSlideOver(false);
        setNotification({ status: data.success, message: data.message});
        setOpenModal(true);
        setUpdated(!updated);
      }
    },
  });

  const deleteUser = async () => {
    setLoading(true);
    const mappedSelected = selectedUser.filter(x => x.user_type !== "admin").map(user => user.user_id);

    for (const user of mappedSelected) {
      await axios.delete(`/api/v2/users/${user}`);
    }
    setUpdated(!updated);
    setNotification({ status: true, message: "Deleted successfully"});
    setOpenModal(true);
    setConfirmationDialog(false);
    setSelectedUser([]);
    setLoading(false);
  }

  const toggleUser = async (userId: string) => {
    setLoading(true);
  
    const { data } = await v2Api.put(`/api/v2/users/${userId}`);

    setUpdated(!updated);
    setNotification({ status: data.success, message: data.message});
    setOpenModal(true);
    setLoading(false);
  }

  return (
    <div className="relative py-5 sm:pb-24 sm:pt-10">
      <BackgroundImage className="-bottom-14 -top-36" />
      {loading && <PageLoader />}
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
                    <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 sm:left-12">
                      <button
                        onClick={() => setConfirmationDialog(true)}
                        type="button"
                        className="inline-flex items-center rounded bg-red-500 px-2 py-1 text-sm font-semibold text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-red-400"
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
                            disabled={users.length === 1}
                          />
                        </th>
                        <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                          Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Email
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Type
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {users.map((user: any, index: number) => (
                        <tr key={index} className={selectedUser.includes(user) ? 'bg-gray-50' : undefined}>
                          <td className="relative px-7 sm:w-12 sm:px-6">
                            {selectedUser.includes(user) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                            )}
                            <input
                              type="checkbox"
                              disabled={user.user_type === "admin"}
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
                            {user.full_name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{user.user_type}</td>
                          <td className="whitespace-nowrap py-4 pl-3 pr-2 text-right text-sm font-medium sm:pr-3">
                            <a
                              onClick={() => {
                                setOpenSlideOver(true);
                                setUserEmail(user.email)
                              }}
                              className="bg-[#7c70ee] text-gray-200 py-1 px-2 rounded hover:text-white cursor-pointer"
                            >
                              Edit<span className="sr-only">, {user.full_name}</span>
                            </a>
                          </td>
                          <td className="whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-3">
                            {user.user_type !== "admin" && <a
                              onClick={() => toggleUser(user.user_id)}
                              className={`${user?.verification[0]?.status ? "bg-green-500 hover:bg-green-400" : "bg-red-500 hover:bg-red-400"} text-gray-100 hover:text-white rounded py-1 px-2 cursor-pointer`}
                            >
                              {`${user?.verification[0]?.status ? "Activate" : "Deactivate"}`}<span className="sr-only">, {user.full_name}</span>
                            </a>}
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
      <SlideOver
        open={openSlideOver}
        setOpen={setOpenSlideOver}
        title="Edit User Full Name"
      >
        <InputField
          name="fullName"
          type="text"
          value={values.fullName}
          label="Full Name*"
          placeholder="Enter Full Name"
          onChange={handleChange}
          error={!!errors.fullName}
          errorMessage={errors.fullName as string}
        />
        <Button
          type="submit" className={`mt-10 w-full ${isSubmitting ? 'cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''}`}
          onClick={() => handleSubmit()} disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Submit"}
        </Button>
      </SlideOver>
      <ConfirmationModal
        open={confirmationDialog}
        setOpen={setConfirmationDialog}
        title="Delete Users"
        message="Are you sure you want to delete the selected user?"
        buttonAction={deleteUser}
        loading={loading}
      />
      <Notification
        show={openModal}
        setShow={setOpenModal}
        status={notification.status}
        message={notification.message}
      />
    </div>
  )
}
