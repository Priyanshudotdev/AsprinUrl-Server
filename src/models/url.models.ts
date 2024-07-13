import mongoose, { Schema, model } from "mongoose";
import { URLModelType } from "../types/models.types.js";

const visitHistorySchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    ip: { type: [String], required: true },
    userAgent: { type: String, required: true },
    device: { type: Object, required: true },
    location: { type: Object, required: true },
}, { _id: false });

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
        city: String,
        device: String,
        country: String
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
