import express from 'express';
import { BadRequestError } from '../../error/bad-request-error';
import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { Role } from '../../models/role';
import { Survey } from '../../models/survey';
import { SurveyAnswer } from '../../models/survey-answer';
import { SurveyQuestion } from '../../models/survey-question';

const router= express.Router();

router.get('/api/roles',async(req:any,res:any)=>{
  const roles = await Role.find({});
  if(!roles.length) {
    throw new BadRequestError("Roles not yet created")
  };

  return res.status(200).send({message:"Roles fetched",data:roles});
});

export {router as getRolesRouter}