import express from 'express';
import { BadRequestError } from '../../error/bad-request-error';
import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { Survey } from '../../models/survey';
import { SurveyAnswer } from '../../models/survey-answer';
import { SurveyQuestion } from '../../models/survey-question';

const router= express.Router();

router.get('/api/surveys/:survey_name',currentUser,requireAuth,async(req:any,res:any)=>{
  const surveys = await Survey.find({published:false,name:req.params.survey_name});
  if(!surveys.length) {
    throw new BadRequestError("Surveys not yet published or empty")
  };
  const surveyResult = await Promise.all(surveys.map(async(survey:any)=>{

    // get the questions
    const questions= await Promise.all(survey.questions.map(async(question:any)=>{
      const questionResult= await SurveyQuestion.findById(question);
      const answerResult = await SurveyAnswer.find({question_id:question});

      return {
            text:questionResult?.text||null,
            id:questionResult?.id||null,
            answers:answerResult[0].value||null
      }
      
    }));
      return {
        survey_name:survey.name,
        questions
      }
  }))
  return res.status(200).send({message:"Surveys fetched",data:surveyResult});
});

export {router as getSurveysRouter}