import express from 'express'
import {body,validationResult} from 'express-validator';
import { BadRequestError } from '../../error/bad-request-error';
import { RequestValidationError } from '../../error/request-validatio-error';
import { User } from '../../models/user';

import jwt from 'jsonwebtoken';
import { validateRequest } from '../../middleware/validate-request';
import { Role } from '../../models/role';

const router= express.Router();

router.post('/api/role',[
  body('name').trim().notEmpty().withMessage("Name must be valid"),
],validateRequest,async(req:any,res:any)=>{
   const {name} = req.body;

   const existingRole = await Role.findOne({name});
   if(existingRole) {
     throw new BadRequestError('Role name already created')
   }

  const role  = Role.build({name});
  await role.save();

  return res.status(201).send({message:"Role created"});
})

export {router as createRoleRouter}