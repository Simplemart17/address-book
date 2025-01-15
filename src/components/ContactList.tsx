"use client";

import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/20/solid'
import { ContactImage } from './ContactImage'
import InputField from './InputField'
import { Button } from './Button'
import { Container } from './Container'
import { BackgroundImage } from './BackgroundImage'
import SlideOver from './SlideOver'
import { useFormik } from 'formik';
import SelectInput from './SelectInput';
import ConfirmationModal from './modals/ConfirmationModal';
import * as Yup from 'yup';
import EmptyRecord from './EmptyRecord';
import { PageLoader } from './PageLoader';
import { v2Api } from '@/config/axiosInstance';
import Notification from './modals/NotificationModal';
import { NotificationProps } from './Landing';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ContactList(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [update, setUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [contacts, setContacts] = useState<any>([]);
  const [singleContacts, setSingleContacts] = useState<any>({});
  const [docId, setDocId] = useState<string>("");
  const [userData, setUserData] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [notification, setNotification] = useState<NotificationProps>({ status: false, message: "" });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isUploadingImg, setIsUploadingImg] = useState<boolean>(false);

  const router = useRouter();

  const mapColor: any = {
    Friend: " bg-green-50 text-green-700 ",
    Colleague: " bg-blue-100 text-blue-700 ",
    Mate: " bg-purple-50 text-purple-700 "
  }

  useLayoutEffect(() => {
    const email = localStorage.getItem('email');

    if (!email) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      let resp;
      const userEmail = localStorage.getItem('email');

      if (userEmail) {
        setEmail(userEmail);
        const { data } = await v2Api.get(`/api/v2/contacts?email=${userEmail}`);
        resp = data;
      }

      setContacts(resp?.data);
      setLoading(false);
    }

    fetchData();
  }, [email, update]);

  useEffect(() => {
    const fetchSingleData = async () => {
      if (docId) {
        const { data } = await v2Api.get(`/api/v2/contacts/${docId}`);
        setSingleContacts(data?.data);
        setLoading(false);
      }
    }

    fetchSingleData();
  }, [docId]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (email) {
        const { data } = await v2Api.get(`/api/v2/users/${email}`);
        setUserData(data?.data?.full_name);
        setLoading(false);
      }
    }

    fetchUserData();
  }, [email]);

  const {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    setSubmitting,
    setFieldValue,
    errors,
    resetForm
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: singleContacts.fullName ?? "",
      address: singleContacts.address ?? "",
      phone: singleContacts.phone ?? "",
      type: singleContacts.type ?? "",
      email: email,
      search: "",
      url: singleContacts.url
    },
    validationSchema: Yup.object({
      fullName: Yup.string().min(3, "Enter minimum of three characters").required('This field is required'),
      address: Yup.string().min(5, "The address is too short!").required('This field is required'),
      phone: Yup.string().matches(/^[0-9]{10,11}$/, "Enter only numbers, maximum of eleven digits").required('This field is required'),
      type: Yup.string().required('This field is required'),
    }),
    onSubmit: async values => {
      try {
        if (action === "add") {
          const { data } = await v2Api.post("/api/v2/contacts", values);
          if (data.success) {
            setNotification({ status: data.success, message: "Contact added successfully!" });
            setOpen(false);
            setOpenModal(true);
            setUpdate(!update);
            resetForm();
          } else {
            setNotification({ status: data.success, message: data.message });
            setOpen(false);
            setOpenModal(true);
            resetForm();
          }
        } else {
          const { data } = await v2Api.patch(`/api/v2/contacts/${docId}`, values);
          if (data.success) {
            setUpdate(!update);
            setOpen(false);
            resetForm();
            setDocId("");
            setSingleContacts({});
            setNotification({ status: true, message: "Contact updated successfully!" });
            setOpenModal(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  const deleteContact = async () => {
    setSubmitting(true);
    await v2Api.delete(`/api/v2/contacts/${docId}`);

    setUpdate(!update);
    setOpenDeleteDialog(false);
    setDocId("");
    setSingleContacts({});
    setSubmitting(false);
    setNotification({ status: true, message: "Contact deleted successfully!" });
    setOpenModal(true);
  }

  const searchedContacts = useMemo(
    () =>
      contacts?.filter((data: any) =>
        data.fullName.toLowerCase().includes(values.search.toLowerCase()),
      ),
    [values.search, contacts],
  );

  const uploadContactImg = async (e: any) => {

    try {
      const { data } = await v2Api.post("/api/v2/upload", {
        url: e.target.files[0],
      },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (data.success) {
        setFieldValue("url", data.url);
      }
    } catch (error) {
      console.log(error, "what error do we have");
    }
  };

  return (
    <div className="relative py-20 sm:pb-24 sm:pt-36">
      <BackgroundImage className="-bottom-14 -top-36" />
      <Container className="relative">
        {loading ? <PageLoader /> : <div className="py-10 px-28">
          <div className="flex items-center">
            <h1 className="text-4xl font-extrabold mb-7">{`${userData}'s Address Book`}</h1>
            <p className="bg-gray-600 text-[#dbecff] items-center mb-7 ml-3 p-1 rounded-md text-sm font-mono font-bold"><span className="mr-1 font-bold">{searchedContacts?.length}</span>{searchedContacts?.length > 1 ? "contacts" : "contact"}</p>
          </div>
          <p className="ml-2">Use the search bar to look for your contact by typing the name</p>
          <div className="lg:flex items-center justify-between mb-10 block">
            <InputField
              name="search"
              placeholder="Search contact"
              type="text"
              value={values.search}
              onChange={handleChange}
            />
            <Button
              type="submit"
              className="lg:ml-5 mt-4 ml-0 w-full lg:w-52"
              onClick={() => {
                setOpen(true);
                setAction("add");
              }}
            >
              Add New Contact
            </Button>
          </div>
          {!searchedContacts?.length ? <EmptyRecord className="mt-24" message="You don not have any saved contact" /> :
            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {searchedContacts.map((person: any, index: number) => (
                <li key={index} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-[#dbecff] shadow-lg">
                  <div className="flex w-full items-center justify-between space-x-6 p-6">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-sm font-medium text-gray-900">{person.fullName}</h3>
                        <span className={`inline-flex flex-shrink-0 items-center rounded-full ${mapColor[person.type]}  px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ring-green-600/20`}>
                          {person.type}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-gray-500">{person.address}</p>
                      <p className="mt-1 truncate text-sm text-gray-700 font-bold">{person.phone}</p>
                    </div>
                    <ContactImage imageUrl={person.url} index={index} />
                  </div>
                  <div>
                    <div className="-mt-px flex divide-x divide-gray-200">
                      <div className="flex w-0 flex-1 cursor-pointer">
                        <a
                          onClick={() => {
                            setOpenDeleteDialog(true);
                            setDocId(person._id);
                          }}
                          className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                        >
                          <TrashIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                          Delete
                        </a>
                      </div>
                      <div className="-ml-px flex w-0 flex-1 cursor-pointer">
                        <a
                          onClick={() => {
                            setOpen(true);
                            setAction("edit");
                            setDocId(person._id);
                          }}
                          className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                        >
                          <PencilSquareIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          Edit
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>}
        </div>}
      </Container>
      <SlideOver
        open={open} setOpen={setOpen}
        title={`${action === "edit" ? "Edit" : "Add New"} Contact`}
      >
        <div className="flex items-center space-x-6 rounded-md border-0 ring-blue-300 ring-1 ring-inset p-3">
          <div className="shrink-0">
            <Image
              id='preview_img'
              className="h-16 w-16 rounded-full ring-2 ring-gray-300 p-1"
              src={values.url ?? "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1588010810/user2.png"}
              width={100}
              height={100}
              alt="Contact photo"
              priority
              unoptimized
            />
          </div>
          <label className="block">
            <span className="sr-only">Choose contact photo</span>
            <input
              // disabled
              accept="image/*"
              name="url"
              type="file" onChange={uploadContactImg}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
          </label>
        </div>
        <InputField
          name="fullName"
          type="text"
          value={values.fullName}
          error={!!errors.fullName}
          errorMessage={errors.fullName as string}
          label="Full Name*"
          placeholder="Enter Full Name"
          onChange={handleChange}
        />
        <InputField
          name="address"
          label="Address*"
          value={values.address}
          error={!!errors.address}
          errorMessage={errors.address as string}
          type="text"
          placeholder="Enter Address"
          onChange={handleChange}
        />
        <InputField
          name="phone"
          label="Phone Number*"
          value={values.phone}
          error={!!errors.phone}
          errorMessage={errors.phone as string}
          type="text"
          placeholder="Enter Phone Number"
          onChange={handleChange}
        />
        <SelectInput
          name="type"
          error={!!errors.type}
          value={values.type}
          errorMessage={errors.type as string}
          label="Contact Type*"
          onChange={handleChange}
        />
        <Button
          className={`w-full mt-14 ${isSubmitting ? 'cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''}`}
          type="submit"
          disabled={isSubmitting}
          onClick={() => handleSubmit()}
        >
          {isSubmitting ? "Submitting" : "Submit"}
        </Button>
      </SlideOver>
      <ConfirmationModal
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        title="Delete Contact"
        message="Are you sure you want to delete this contact"
        buttonAction={deleteContact}
        loading={isSubmitting}
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
