import { Schema, model } from "mongoose";
const UrlSchema = new Schema({
    shortId: {
        type: String,
        unique: true
    },
    redirectUrl: {
        type: String,
        required: true
    },
    visitHistory: [{
            city: {
                type: String,
                required: false
            },
            device: {
                type: String,
                required: false
            },
            country: {
                type: String,
                required: false
            }
        }],
    createdBy: {
        type: String,
        required: true
    },
    urlTitle: {
        type: String,
        required: true,
        unique: true
    },
    qrCode: {
        type: String,
        required: true
    },
    customUrl: {
        type: String,
        unique: true
    }
}, { timestamps: true });
export const Url = model("Url", UrlSchema);
