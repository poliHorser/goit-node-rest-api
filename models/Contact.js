import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSetting  } from './hooks.js';
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      required: [true, 'Set email for contact'],
    },
    phone: {
      type: String,
      required: [true, 'Set phone for contact'],
    },
    favorite: {
      type: Boolean,
      default: false,
      required: true
    },
  },  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError)

contactSchema.pre("findOneAndUpdate", setUpdateSetting);

contactSchema.post("findOneAndUpdate", handleSaveError);
const Contact = model("contact", contactSchema)

export default Contact