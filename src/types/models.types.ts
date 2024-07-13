import mongoose from "mongoose";

export type VisitHistoryType = {
    timestamp: Date;
    ip: string[];
    userAgent: string;
    device: object;
    location: object;
};



export interface URLModelType  {
    shortId: string;
    redirectUrl: string;
    visitHistory: [{
        country: any, 
        city: string,
        device: string,
    }],
    createdBy: string;
    urlTitle: string;
    qrCode: string;
    customUrl: string;
    createdAt: string;
}
