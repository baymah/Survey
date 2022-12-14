import express from 'express'
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../../error/bad-request-error';
import { validateRequest } from '../../middleware/validate-request';
import { User } from '../../models/user';
import { Password } from '../../services/password';

import jwt from 'jsonwebtoken';
import { UserRole } from '../../models/user-role';
import { Role } from '../../models/role';

const router= express.Router();

router.post('/api/users/signin',
[
  body('email').isEmail().withMessage("Email must be valid"),
  body('password').trim().notEmpty().withMessage("Password must be supplied")
],
validateRequest,
async(req:any,res:any)=>{
  
  const {email,password} = req.body;
  const existingUser = await User.findOne({email});

  if(!existingUser){
      throw new BadRequestError('Invalid credential');
  }
  
  const passwordMatch= Password.compare(existingUser.password,password);

  if(!passwordMatch){
    throw new BadRequestError('Invalid credentials');
  }

    const userRoles = await UserRole.find({user_id:existingUser.id});
    if(!userRoles.length){
        throw new BadRequestError('User has no role');
    }
      const roleResult = await Promise.all(userRoles.map(async(userRole)=>{
        return await Role.findById(userRole.roles_id);
      }
    ));

    const roleR =roleResult?roleResult.map((rr)=>{
      return rr?.name
    }):[]
   

  //Generate JWT
  const userJwt= jwt.sign({
    id:existingUser.id,
    email:existingUser.email,
    roles:roleR
  },process.env.JWT_SECRET!);


  console.log(roleR,"ROLERR")
  req.session={
    jwt:userJwt
  }

  return res.status(200).send(existingUser);

})

export {router as signinRouter}