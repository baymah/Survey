import mongoose from 'mongoose'

interface SurveyQuestionAttrs{
  survey_name:string;
  text:string;
  type:string;
  answers?:any[]
  version:number
  timestamp?:any
}

interface SurveyQuestionModel extends mongoose.Model<SurveyQuestionDoc>{
  build(attrs:SurveyQuestionAttrs):SurveyQuestionDoc
}

interface SurveyQuestionDoc extends mongoose.Document{
  survey_name:string;
  text:string;
  type:string;
  answers:any[]
  version:number
  timestamp?:any
}

const surveyQuestionSchema = new mongoose.Schema({

  survey_name: { type: String, ref: 'Survey' },
  type: {type:String, required:true}, 
  text: {type:String, required:true},
  version: {type:Number, required:true},
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SurveyAnswer' }]
}, { timestamps: { createdAt: 'created_at' },
     toJSON:{
        transform(doc:any,ret:any){
          ret.id=ret._id
          delete ret._id
          delete ret.__v
          delete ret.version
          delete ret.type
          delete ret.created_at
          delete ret.updatedAt
        }
  } });

surveyQuestionSchema.statics.build = (attrs:SurveyQuestionAttrs)=>{
  return new SurveyQuestion(attrs);
}

const SurveyQuestion = mongoose.model<SurveyQuestionDoc,SurveyQuestionModel>('SurveyQuestion',surveyQuestionSchema);
export {SurveyQuestion};