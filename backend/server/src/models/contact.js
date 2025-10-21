import mongoose from "mongoose";



const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["birthday", "death", "wedding", "marriage", "custom"],
    required: true,
  },
  label: String,
  date: { type: Date, required: true },
  recurring: { type: Boolean, default: true },
});

const contactSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: String,
    phone: { type: String, required: true },
    email: String,
    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
    tags: [String],
    notes: String,
    events: [eventSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);