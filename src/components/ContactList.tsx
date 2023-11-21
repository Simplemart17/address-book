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

const people = [
  {
    name: 'Jane Cooper',
    address: '740 Bathurst street, ON',
    type: 'Admin',
    email: 'janecooper@example.com',
    phone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    address: '740 Bathurst street, ON',
    type: 'Admin',
    email: 'janecooper@example.com',
    phone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    address: '740 Bathurst street, ON',
    type: 'Admin',
    email: 'janecooper@example.com',
    phone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    address: '740 Bathurst street, ON',
    type: 'Admin',
    email: 'janecooper@example.com',
    phone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    address: '740 Bathurst street, ON',
    type: 'Admin',
    email: 'janecooper@example.com',
    phone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    address: '740 Bathurst street, ON',
    type: 'Admin',
    email: 'janecooper@example.com',
    phone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    address: '740 Bathurst street, ON',
    type: 'Admin',
    email: 'janecooper@example.com',
    phone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    address: '740 Bathurst street, ON',
    type: 'Admin',
    email: 'janecooper@example.com',
    phone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    address: '740 Bathurst street, ON',
    type: 'Admin',
    email: 'janecooper@example.com',
    phone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    address: '740 Bathurst street, ON',
    type: 'Admin',
    email: 'janecooper@example.com',
    phone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    address: '740 Bathurst street, ON',
    type: 'Admin',
    email: 'janecooper@example.com',
    phone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    address: '740 Bathurst street, ON',
    type: 'Admin',
    email: 'janecooper@example.com',
    phone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    address: '740 Bathurst street, ON',
    type: 'Admin',
    email: 'janecooper@example.com',
    phone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
]

export default function ContactList(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");

  const {
    values,
    handleChange,
    setValues,
    setFieldValue,
    handleSubmit
  } = useFormik({
    initialValues: {
      fullName: "",
      address: "",
      contactType: "",
      contactImage: "",
      fileName: "No file chosen",

    },
    onSubmit: (values: any) => {
      console.log(values)
    },
  });

  const handleFileChange = (event: any) => {
    const { name, files } = event.target;

    if (files) {
      const regexPattern1 = /[!@#$%^&*()+=[\]{};':"\\|,<>/?]+/;
      const regexPattern2 = /\W{2}/g;
      const fileName = files[0].name;
      const filesize = files[0].size;
      if (
        filesize > 2000000 ||
        fileName.length > 60 ||
        regexPattern1.test(fileName) ||
        fileName.match(regexPattern2)
      ) {
        // setValidationError({
        //   ...validationError,
        //   companyDocumentError: `Check file! File size not more than 2MB, file name should not contain special character and not more than 60 characters`,
        // });
        // setTimeout(() => {
        //   setValidationError({ companyDocumentError: '' });
        // }, 5000);

        return;
      }
      setValues({ ...values, [name]: files });
      setFieldValue('fileName', fileName);
    }
  };

  return (
    <>
      <BackgroundImage className="-bottom-14 -top-36" />
      <Container className="relative">
        <div className="py-10 px-28">
          <div className="flex items-center">
            <h1 className="text-4xl font-extrabold mb-7">Address Book</h1>
            <p className="bg-gray-600 text-[#dbecff] items-center mb-7 ml-3 p-1 rounded-md text-sm font-mono font-bold"><span className="mr-1 font-bold">{people.length}</span>{people.length > 1 ? "contacts" : "contact"}</p>
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
            {people.map((person, index) => (
              <li key={index} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-[#dbecff] shadow-lg">
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-sm font-medium text-gray-900">{person.name}</h3>
                      <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {person.type}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">{person.address}</p>
                  </div>
                  <ContactImage imageUrl={person.imageUrl} index={index} />
                </div>
                <div>
                  <div className="-mt-px flex divide-x divide-gray-200">
                    <div className="flex w-0 flex-1 cursor-pointer">
                      <a
                        onClick={() => setOpenDeleteDialog(true)}
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
          label="Full Name*"
          placeholder="Enter Full Name"
          onChange={handleChange}
        />
        <InputField
          name="address"
          label="Address*"
          value={values.address}
          type="text"
          placeholder="Enter Address"
          onChange={handleChange}
        />
        <SelectInput
          name="contactType"
          label="Contact Type*"
          onChange={handleChange}
        />
        <div>
          <p className="mt-4">Select an image*</p>
          <div className="flex items-center mb-10 h-14 rounded-md ring-1 ring-inset ring-blue-300 focus:ring-2 focus:ring-inset focus:ring-blue-500">
            <label className="ml-2 w-32 h-10 px-4 py-2 text-base text-white rounded-md cursor-pointer bg-blue-700 focus:outline-none">
              <input
                type="file"
                className="hidden"
                accept=".jpeg, .jpg, .png"
                name="contactImage"
              onChange={handleFileChange}
              />
              Browse Files
            </label>
            <p className="ml-2">{values.fileName}</p>
          </div>
        </div>
        <Button
          className="w-full mt-5"
          type="submit"
          onClick={() => handleSubmit()}
        >
          Submit
        </Button>
      </SlideOver>
      <ConfirmationModal
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        title="Delete Contact"
        message="Are you sure you want to delete this contact"
        buttonAction={() => console.log("this is it")}
      />
    </>
  )
}
