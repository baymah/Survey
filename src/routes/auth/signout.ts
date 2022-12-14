import express from 'express'

const router= express.Router();

router.post('/api/users/signout',(req:any,res:any)=>{
  req.session=null;
  return res.send({});
})

export {router as signoutRouter}