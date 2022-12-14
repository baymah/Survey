import express from 'express'
import { body } from 'express-validator';
import { BadRequestError } from '../../error/bad-request-error';
import { NotAuthorizedError } from '../../error/not-authorized-error';
import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { validateRequest } from '../../middleware/validate-request';
import { Survey } from '../../models/survey';
import { SurveyAnswer } from '../../models/survey-answer';
import { SurveyQuestion } from '../../models/survey-question';

const router= express.Router();

router.post('/api/survey',
[
  body('surveyName').trim().notEmpty().withMessage("surveyName must be valid"),
],
validateRequest,
currentUser,
requireAuth,
async(req:any,res:any)=>{

  if(!req.currentUser.roles.includes("Admin")){
    throw new NotAuthorizedError();
  }
  const {surveyName,question,version} = req.body;
try{
  // createSurveyQuestion
  
  const surveyQuestion = SurveyQuestion.build({survey_name:surveyName,text:question.text,version,type:question.type});
  await surveyQuestion.save();

  // create survey
  const survey=Survey.build({name:surveyName,published:false,questions:[surveyQuestion._id]});
  await survey.save();

  //create surveyAnswers

  const surveyAnswer=SurveyAnswer.build({question_id:surveyQuestion._id,value:question.answers});
  await surveyAnswer.save();

  surveyQuestion.update({answers:[surveyAnswer]})



  return res.status(200).send({message:"Survey created successfully"});
}
catch(err){
  console.log(err);
  throw new BadRequestError("Error creating survey");
}
})

export {router as createSurveyRouter}