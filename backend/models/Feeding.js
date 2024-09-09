/*
import mongoose, { Schema } from 'mongoose';

const feedingSchema = new Schema(
    {
        reptile: { type: mongoose.Schema.Types.ObjectId, ref: 'Reptile', required: true },
        date: { type: Date, required: true }, 
        foodType: { type: String, required: true },
        quantity: { type: Number },
        notes: { type: String }
    },
    {
        collection: "feeding"
    }
)

const Feeding = mongoose.models.Feeding || mongoose.model("Feeding", feedingSchema)
export default Feeding

*/