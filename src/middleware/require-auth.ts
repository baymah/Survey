import {NextFunction } from "express"
import { NotAuthorizedError } from "../error/not-authorized-error";
import { userPayload } from "./current-user";

declare global{
  namespace Express{
    interface Request{
      currentUser?:userPayload
    }
  }
}
export const requireAuth=(req:any,res:any,next:NextFunction)=>{
 
 if(!req.currentUser){
    throw new NotAuthorizedError();
 }
 next()
}