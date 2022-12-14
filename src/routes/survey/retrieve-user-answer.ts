import express from 'express';
import { BadRequestError } from '../../error/bad-request-error';
import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { SurveyQuestion } from '../../models/survey-question';
import { User } from '../../models/user';
import { UserSurveyAnswer, UserSurveyAttrs } from '../../models/user-answer';

const router= express.Router();

router.get('/api/survey/userSurvey/:user_id',currentUser,requireAuth,async(req:any,res:any)=>{

  const user = await User.findById(req.params.user_id);
  if(!user) throw new BadRequestError("User found");
  
  const userSurvey = await UserSurveyAnswer.find({user_id:req.params.user_id});
  if(!userSurvey.length) throw new BadRequestError("user survey not found");
  
  const userSurveyTransform = await Promise.all(userSurvey.map(async(userServey:UserSurveyAttrs)=>{
      const surveyQuestion = await SurveyQuestion.findById(userServey.question_id);
      return{
          question:surveyQuestion?.text,
          answer:userServey.answer,
      }
  }))

  return res.send({message:"User Survey fetched",data:{email:user?.email,surveys:userSurveyTransform}});
})

export {router as retrieveUserAnswer}