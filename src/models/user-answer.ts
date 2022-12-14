import mongoose, { Schema } from 'mongoose'

interface Answer {
  [index: number]: any;
}
export interface UserSurveyAttrs{
  question_id:mongoose.Schema.Types.ObjectId
  answer:Answer
  user_id:mongoose.Schema.Types.ObjectId
  timestamp?:any
}

interface UserSurveyModel extends mongoose.Model<UserSurveyDoc>{
  build(attrs:UserSurveyAttrs):UserSurveyDoc
}


interface UserSurveyDoc extends mongoose.Document{
  question_id:mongoose.Schema.Types.ObjectId
  answer:Answer
  user_id:mongoose.Schema.Types.ObjectId
  timestamp?:any
}

var userSurveyAnswerSchema = new Schema({
  question_id: {
    type: Schema.Types.ObjectId,
    ref: 'SurveyQuestion'
  },
  answer : {
    type: Schema.Types.Array,
    // ref: 'SurveyAnswer' 
  },
  user_id : {
    type: Schema.Types.ObjectId,
    ref: 'User' 
  }
}, { timestamps: { createdAt: 'created_at' },
    toJSON:{
        transform(doc:any,ret:any){
          ret.id=ret._id
          delete ret._id
          delete ret.__v
          delete ret.created_at
          delete ret.updatedAt
        }
  }
});


userSurveyAnswerSchema.statics.build = (attrs:UserSurveyAttrs)=>{
  return new UserSurveyAnswer(attrs);
}

const UserSurveyAnswer = mongoose.model<UserSurveyDoc,UserSurveyModel>('UserSurveyAnswer',userSurveyAnswerSchema);
export {UserSurveyAnswer};