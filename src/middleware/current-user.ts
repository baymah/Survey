import {NextFunction } from "express"
import jwt from 'jsonwebtoken'
import { RequestValidationError } from "../error/request-validatio-error"

export interface userPayload{
  id:string;
  email:string;
  roles:string[]
}

declare global{
  namespace Express{
    interface Request{
      currentUser?:userPayload
    }
  }
}
export const currentUser=(req:any,res:any,next:NextFunction)=>{
  if(!req.session?.jwt){
    return next()
  }
 try{
  const payload = jwt.verify(req.session?.jwt,process.env.JWT_SECRET!)as userPayload;
  req.currentUser = payload;
 }
 catch(err){}
  next()
}