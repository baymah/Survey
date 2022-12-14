import express from 'express'
import { body } from 'express-validator';
import { BadRequestError } from '../../error/bad-request-error';
import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { validateRequest } from '../../middleware/validate-request';
import { UserSurveyAnswer, UserSurveyAttrs } from '../../models/user-answer';

const router= express.Router();

router.post('/api/survey/userSurvey',
[
  body('question_id').trim().notEmpty().withMessage("question id must be provided"),
],
validateRequest,
currentUser,
requireAuth,
async(req:any,res:any)=>{
  const {surveys} = req.body;
try{
  const user_id:any = req.currentUser?.id;

  surveys.map(async(survey:UserSurveyAttrs)=>{
    const userSurveyAnswer=UserSurveyAnswer.build({question_id:survey.question_id,answer:survey.answer,user_id});
    await userSurveyAnswer.save();
  })

  return res.status(200).send({message:"User survey created successfully"});
}
catch(err){
  console.log(err);
  throw new BadRequestError("Error creating survey");
}
})

export {router as createUserSurveyRouter}