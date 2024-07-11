import mongoose,{Schema, model, trusted} from "mongoose";
import { URLModelType } from "../types/models.types.js";



const UrlSchema = new Schema({
    shortId:{
        type:String,
        unique:true
    },
    redirectUrl:{
        type:String,
        required:true
    },
    visitHistory:[{
        timestamp:Number
    }],
    createdBy: {
        type: String,
        required: true
    },
    urlTitle: {
        type: String,
        required: true,
        unique:true
    },
    qrCode:{
        type: String,
        required: true
    },
    customUrl:{
        type: String,
        unique: true
    }
},
{timestamps:true})

export const Url = model<URLModelType>("Url",UrlSchema);
