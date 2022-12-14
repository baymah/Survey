import mongoose from 'mongoose'

interface SurveyAnswerAttrs{
  question_id:string;
  value:string[]
  timestamp?:any
}

interface SurveyAnswerModel extends mongoose.Model<SurveyAnswerDoc>{
  build(attrs:SurveyAnswerAttrs):SurveyAnswerDoc
}

interface SurveyAnswerDoc extends mongoose.Document{
  question_id:string;
  value:string[]
  timestamp?:any
}

const surveyAnswerSchema = new mongoose.Schema({

  question_id: {type: mongoose.Schema.Types.ObjectId,ref: 'SurveyQuestion'},
  value: [{type:String}],
  number: {type:Number, require:true}
}, { timestamps: { createdAt: 'created_at' },toJSON:{
        transform(doc:any,ret:any){
          ret.id=ret._id
          delete ret._id
          delete ret.__v
          delete ret.question_id
          delete ret.created_at
          delete ret.updatedAt
        } 
      }
  });

surveyAnswerSchema.statics.build = (attrs:SurveyAnswerAttrs)=>{
  return new SurveyAnswer(attrs);
}

const SurveyAnswer = mongoose.model<SurveyAnswerDoc,SurveyAnswerModel>('SurveyAnswer',surveyAnswerSchema);
export {SurveyAnswer};