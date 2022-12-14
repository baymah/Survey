import mongoose from 'mongoose';
import { Password } from '../services/password';

interface RoleAttrs{
  name:string;
  timestamp?:any
}

interface RoleModel extends mongoose.Model<RoleDoc>{
  build(attrs:RoleAttrs):RoleDoc
}


interface RoleDoc extends mongoose.Document{
  name:string;
  timestamp?:any
}

const roleSchema = new mongoose.Schema({
    name:{
      type:String,
      required:true
    },
},
{
  timestamps: { createdAt: 'created_at' },
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

roleSchema.statics.build = (attrs:RoleAttrs)=>{
  return new Role(attrs);
}

const Role = mongoose.model<RoleDoc,RoleModel>('Role',roleSchema);
export {Role};

