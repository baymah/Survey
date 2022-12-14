import { Request,NextFunction } from "express"
import {validationResult} from 'express-validator'
import { RequestValidationError } from "../error/request-validatio-error"

export const validateRequest=(req:any,res:any,next:NextFunction)=>{
 const errors = validationResult(req.body);
 
 if(!errors.isEmpty){
    throw new RequestValidationError(errors.array());
 }
 next();
}