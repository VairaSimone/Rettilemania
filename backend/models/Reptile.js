import mongoose, { Schema } from 'mongoose';

const reptileSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        species: {
            type: String,
            required: true
        },
        morph: {
            type: String
        },
        birthDate: {
            trype: Date
        },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        feddingHistory: { type: mongoose.Schema.Types.ObjectId, ref: "Feeding" },
        growthRecords: [{
            date: {
                type: Date,
                required: true
            },
            weight: {
                type: Number
            },
            length: {
                type: Number
            }
        }],
        healthRecords: [{
            date: {
                type: Date
            },
            note: {
                type: String
            },
            vetVisit: {
                type: Date,
                default: Date.now
            }
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: "Reptile"
    }
)

const Reptile = mongoose.models.Reptile || mongoose.model("Reptile", reptileSchema)
export default Reptile