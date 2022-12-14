import express from 'express'
import {body,validationResult} from 'express-validator';
import { BadRequestError } from '../../error/bad-request-error';
import { RequestValidationError } from '../../error/request-validatio-error';
import { User } from '../../models/user';

import jwt from 'jsonwebtoken';
import { validateRequest } from '../../middleware/validate-request';
import { Role } from '../../models/role';
import { UserRole } from '../../models/user-role';

const router= express.Router();

router.post('/api/admin/signup',[
  body('email').isEmail().withMessage("Email must be valid"),
  body('password').trim().isLength({min:4,max:20}).withMessage("Password must be between 4 and 20 character"),
  body('roles').trim().withMessage("Supply role")
],validateRequest,async(req:any,res:any)=>{
   const {email,password,roles} = req.body;

  //  check if the roles exists
  roles.map(async(role:string)=>{
    const roleResult =await Role.findById(role);
    if(!roleResult) throw new BadRequestError('Role does not exist create the role')
  })

   const existingUser = await User.findOne({email});
   if(existingUser) {
     throw new BadRequestError('Email in use...')
   }

  const user  = User.build({email,password});
  await user.save();
  await UserRole.build({roles_id:roles,user_id:user.id}).save();
  return res.status(201).send(user);
})

export {router as signupRouter}