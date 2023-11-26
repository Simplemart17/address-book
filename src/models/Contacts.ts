import mongoose from 'mongoose'

export interface ContactsProps extends mongoose.Document {
  email: string;
  fullName: string;
  address: string;
  phone: string;
  type: string;
  url: string;
}

const ContactSchema = new mongoose.Schema<ContactsProps>({
  email: {
    type: String,
    required: [true, 'Please provide a valid email address'],
    index: true,
  },
  fullName: {
    type: String,
    required: [true, "Please provide the contact's full name"],
  },
  address: {
    type: String,
    required: [true, 'Please enter your address'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a valid phone number'],
    unique: true
  },
  type: {
    type: String,
  },
  url: {
    type: String,
  },
})

export default mongoose.models.Contact || mongoose.model<ContactsProps>('Contact', ContactSchema)