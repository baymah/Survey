import mongoose from 'mongoose'

interface UserRoleAttrs{
  user_id:string;
  roles_id:any[]
  timestamp?:any
}

interface UserRoleModel extends mongoose.Model<UserRoleDoc>{
  build(attrs:UserRoleAttrs):UserRoleDoc
}

interface UserRoleDoc extends mongoose.Document{
  user_id:string;
  roles_id:any[]
  timestamp?:any
}

const userRoleSchema = new mongoose.Schema({

  user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  roles_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
}, { timestamps: { createdAt: 'created_at' },
     toJSON:{
        transform(doc:any,ret:any){
          ret.id=ret._id
          delete ret._id
          delete ret.__v
          delete ret.created_at
          delete ret.updatedAt
        }
  } });

userRoleSchema.statics.build = (attrs:UserRoleAttrs)=>{
  return new UserRole(attrs);
}

const UserRole = mongoose.model<UserRoleDoc,UserRoleModel>('UserRole',userRoleSchema);
export {UserRole};