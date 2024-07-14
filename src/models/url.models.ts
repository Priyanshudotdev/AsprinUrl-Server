import mongoose, { Schema, model } from "mongoose";
import { URLModelType } from "../types/models.types.js";


const UrlSchema = new Schema<URLModelType>({
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
            type:String,
            required:false
        },
        device: {
            type:String,
            required:false
        },
        country: {
            type:String,
            required:false
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

export const Url = model<URLModelType>("Url", UrlSchema);
