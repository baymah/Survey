import mongoose from 'mongoose'

interface SurveyAttrs{
  published:boolean;
  name:string;
  questions:mongoose.Schema.Types.ObjectId[]
  timestamp?:any
}

interface SurveyModel extends mongoose.Model<SurveyDoc>{
  build(attrs:SurveyAttrs):SurveyDoc
}


interface SurveyDoc extends mongoose.Document{
  published:boolean;
  name:string;
  questions:mongoose.Schema.Types.ObjectId[]
  timestamp?:any
}

const surveySchema = new mongoose.Schema({
  published: {type:Boolean,default:false},
  name: { type: String},
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
}, { timestamps: { createdAt: 'created_at' } });

surveySchema.statics = {
  populateFromLatest: function(name) {
    this.findOne({ name: name })
    .where({ published: true })
    .populate('questions')
    .exec(function(err:any, survey:any) {
      return survey
    });
  }
}

surveySchema.statics.build = (attrs:SurveyAttrs)=>{
  return new Survey(attrs);
}

const Survey = mongoose.model<SurveyDoc,SurveyModel>('Survey',surveySchema);
export {Survey};