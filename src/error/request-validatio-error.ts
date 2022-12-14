import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";


export class RequestValidationError extends CustomError{
  statusCode =400
  constructor(public errors:ValidationError[]){
    super('Request validation error');

    Object.setPrototypeOf(this,RequestValidationError.prototype)
  }

  serializeError(){
    return this.errors.map((err:ValidationError)=>{
      return{message:err.msg,field:err.param}
    })
  }
}