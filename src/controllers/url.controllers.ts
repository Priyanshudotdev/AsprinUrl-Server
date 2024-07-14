import { Request,Response } from "express";
import {generate,characters} from 'shortid'
import { Url } from "../models/url.models.js";
import { CustomRequest } from "../types/auth.types.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import {imageSync} from 'qr-image'
import fs from 'fs';
import { myCache } from "../app.js";
import { promisify } from 'util';
import UAParser from "ua-parser-js";
import axios from 'axios'

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

export const handleGenerateNewShortURL = async (req: CustomRequest, res: Response) => {
    const { url, userId, urlTitle, customUrl } = req.body;

    if (!url || !userId) {
        return res.status(400).json({ message: "Error: URL and UserId are required" });
    }

    try {
        // Generate QR code from URL
        const qrCodeData = url;
        const timestamp = Date.now();
        const qrCodeFileName = `qr_${userId}_${timestamp}.png`;

        const qrPng = imageSync(qrCodeData, { type: 'png' });
        const qrCodeFilePath = `./${qrCodeFileName}`;
        await writeFileAsync(qrCodeFilePath, qrPng);

        // Upload QR code to Cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(qrCodeFilePath);

        // Clean up: delete temporary QR code file
        await unlinkAsync(qrCodeFilePath);

        if (!cloudinaryResponse || !cloudinaryResponse.url) {
            return res.status(400).json({ message: "Failed to upload QR code on Cloudinary" });
        }

        const qrCodeUrl = cloudinaryResponse.url;

        // Generate shortId
        let shortId = generate().replace(/[^a-zA-Z]/g, '').toLowerCase().slice(0, 4);

        const link = await Url.create({
            shortId,
            redirectUrl: url,
            visitHistory: [],
            createdBy: userId,
            urlTitle: urlTitle || "",
            qrCode: qrCodeUrl,
            customUrl: customUrl || ""
        });

        if (!link) {
            return res.status(408).json({
                message: "Internal Server Error",
                success: false
            });
        }

        console.log(link);

        return res.json({
            link,
            success: true,
            message: "URL created successfully"
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const handleFetchUserSingleLink = async (req:CustomRequest,res:Response) => {

    const {urlTitle, userId} = req.body;

    if(!userId) return res.status(400).json({
        message: "User Id is required",
        success: false
    })

    if(!urlTitle) return res.status(400).json({
        message: "Url Title is required",
        success: false
    })


        let link;

        if(myCache.has(`${userId}-${urlTitle}`)){
            link = JSON.parse(myCache.get(`${userId}-${urlTitle}`) as string );
        }else{
             link = await Url.find({
            createdBy : userId,
            urlTitle
            })

            if(!link) return res.status(500).json({
                message: "Internal Server Error",
                success: false
            })

            myCache.set(`${userId}-${urlTitle}`,JSON.stringify(link));
        }    

    return res.status(200).json({
        link,
        message : "Link Found Successfully",
        success: true
    })

    
}


export const handleFetchUserLinks = async (req:CustomRequest,res:Response) => {

    const {userId} = req.body;

    if(!userId) return res.status(400).json({
        message: "User Id is Required"
        ,success:false
    })


    let links;

  if (myCache.has(userId)) {
    links = myCache.get(userId);
  } else {
    links = await Url.find({ createdBy: userId });

    if (!links) return res.status(404).json({
      message: "Links Not Found",
      success: false
    });

    myCache.set(userId, links);
  }  



    return res.status(200).json({
        links,
        message : "Link Found Successfully",
        success: true
    })

    
}

export const handleDeleteLink = async (req:CustomRequest, res:Response) => {
    const { urlTitle, userId } = req.query;
  
    if (!urlTitle || !userId) return res.status(400).json({
      message: "Url Title & User Id is Required",
      success: false
    });
  
    try {
      const result = await Url.deleteOne({ urlTitle, createdBy: userId });
  
      if (result.deletedCount > 0) {
        // Invalidate the cache for the user

        myCache.del(`${userId}`);
  
        res.status(200).json({
          message: "Link Deleted Successfully",
          success: true
        });
      } else {
        res.status(404).json({ 
          message: "Resource not found",
          success: false 
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
        success: false
      });
    }
  };


export const handleRedirection = async (req: Request, res: Response) => {
    const { link } = req.query;

    if (!link) {
        return res.status(400).json({
            message: "redirectUrl is required",
            success: false
        });
    }

    try {
        const shortUrl = await Url.findOne({ shortId: link });

        if (!shortUrl) {
            return res.status(404).json({
                message: "Link not found",
                success: false
            });
        }
        const parser = new UAParser();
        const response = parser.getResult();
        const device = response.device || "desktop"

       



        // Fetch location data
        const locationResponse = await fetch("https://ipapi.co/json");
        
        const { city,country_name:country } = await locationResponse.json();


        // Save visit data
        shortUrl.visitHistory.push({
            device: JSON.stringify(device),
            city,
            country,
        });

        await shortUrl.save();

        res.redirect(`${shortUrl.redirectUrl}`)


    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

