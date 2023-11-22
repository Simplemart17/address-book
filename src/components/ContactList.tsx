"use client";

import { useState, useEffect } from 'react';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/20/solid'
import { ContactImage } from './ContactImage'
import InputField from './InputField'
import { Button } from './Button'
import { Container } from './Container'
import { BackgroundImage } from './BackgroundImage'
import SlideOver from './SlideOver'
import { useFormik } from 'formik';
import SelectInput from './SelectInput';
import ConfirmationModal from './ConfirmationModal';
import axios from 'axios';
import { formatResponseObject } from '@/utils';
import * as Yup from 'yup';

export default function ContactList(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [update, setUpdate] = useState<boolean>(false);
  const [contacts, setContacts] = useState<any>([]);
  const [singleContacts, setSingleContacts] = useState<any>({});
  const [docId, setDocId] = useState<string>("");

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/api/contacts");
      const res = formatResponseObject(data?.data)
      setContacts(res);
    }

    fetchData();
  }, [update]);

  useEffect(() => {
    const fetchSingleData = async () => {
      if (docId) {
        const { data } = await axios.get(`/api/contacts/${docId}`);
        setSingleContacts(data?.data);
      }
    }

    fetchSingleData();
  }, [docId]);

  const {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    setSubmitting,
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
    },
    validationSchema: Yup.object({
      fullName: Yup.string().min(3, "Enter minimum of three characters").required('This field is required'),
      address: Yup.string().min(10, "The address is too short!").required('This field is required'),
      phone: Yup.string().min(10, "Enter a valid phone number").required('This field is required'),
      type: Yup.string().required('This field is required'),
    }),
    onSubmit: async values => {
      try {
        let res;
        if (action === "add") {
          const { data } = await axios.post("/api/contacts", values);
          res = data;
        } else {
          const { data } = await axios.patch(`/api/contacts/${docId}`, values);
          res = data;
        }

        if (res.success) {
          setUpdate(!update);
          setOpen(false);
          resetForm();
          setDocId("");
          setSingleContacts({});
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  const deleteContact = async () => {
    setSubmitting(true);
    await axios.delete(`/api/contacts/${docId}`);
    
    setUpdate(!update);
    setOpenDeleteDialog(false);
    setDocId("");
    setSingleContacts({});
    setSubmitting(false);
  }


  return (
    <>
      <BackgroundImage className="-bottom-14 -top-36" />
      <Container className="relative">
        <div className="py-10 px-28">
          <div className="flex items-center">
            <h1 className="text-4xl font-extrabold mb-7">{`${'Martins'}'s Address Book`}</h1>
            <p className="bg-gray-600 text-[#dbecff] items-center mb-7 ml-3 p-1 rounded-md text-sm font-mono font-bold"><span className="mr-1 font-bold">{contacts.length}</span>{contacts.length > 1 ? "contacts" : "contact"}</p>
          </div>
          <p className="ml-2">Use the search bar to look for your contact by typing the name</p>
          <div className="lg:flex items-center justify-between mb-10 block">
            <InputField
              name="search"
              placeholder="Search contact"
              type="text"
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
          <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((person: any, index: number) => (
              <li key={index} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-[#dbecff] shadow-lg">
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-sm font-medium text-gray-900">{person.fullName}</h3>
                      <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
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
                          setDocId(person.documentId);
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
                          setDocId(person.documentId);
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
          </ul>
        </div>
      </Container>
      <SlideOver
        open={open} setOpen={setOpen}
        title={`${action === "edit" ? "Edit" : "Add New"} Contact`}
      >
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
    </>
  )
}
