import { Request,NextFunction } from "express"
import { CustomError } from "../error/custom-error"

export const errorHandler=(err:Error,req:Request,res:any,next:NextFunction)=>{
 if(err instanceof CustomError){  
  return res.status(err.statusCode).send({
    errors:err.serializeError()
  })
 }
  return res.status(400).send({
    error:[{message:"Something went wrong"}]
  })
}