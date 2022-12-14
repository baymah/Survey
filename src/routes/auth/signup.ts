import express from 'express'
import {body,validationResult} from 'express-validator';
import { BadRequestError } from '../../error/bad-request-error';
import { RequestValidationError } from '../../error/request-validatio-error';
import { User } from '../../models/user';

import jwt from 'jsonwebtoken';
import { validateRequest } from '../../middleware/validate-request';
import { UserRole } from '../../models/user-role';
import { Role } from '../../models/role';

const router= express.Router();

router.post('/api/users/signup',[
  body('email').isEmail().withMessage("Email must be valid"),
  body('password').trim().isLength({min:4,max:20}).withMessage("Password must be between 4 and 20 character")
],validateRequest,async(req:any,res:any)=>{
   const {email,password} = req.body;

  //  const userRole=await Role.find({name:"User"});

  //  if(!userRole) {
  //    throw new BadRequestError('User Role doesnt exist wait for the admin to bootsrap the application')
  //  }

   const existingUser = await User.findOne({email});
   if(existingUser) {
     throw new BadRequestError('Email in use...')
   }

  const user  = User.build({email,password});
  await user.save();

  let roleArr=await Role.find({name:"User"});
  let role;
  // let userRoleResult;
  if(!role){
   role  = await Role.build({name:"User"}).save()
  }

  // await UserRole.build({roles_id:[role.id],user_id:user.id}).save();
     await UserRole.build({roles_id:role?[role.id]:[roleArr[0].id],user_id:user.id}).save();

  //Generate JWT
  const userJwt= jwt.sign({
    id:user.id,
    email:user.email,
    roles:["User"],
  },process.env.JWT_SECRET!);


  req.session={
    jwt:userJwt
  }

  return res.status(201).send(user);
})

export {router as signupRouter}