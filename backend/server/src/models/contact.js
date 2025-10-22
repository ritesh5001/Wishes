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
    name: { type: String, required: true },
    // Keep a single address string field
    address: String,
    events: [eventSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);