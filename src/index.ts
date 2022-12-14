require("dotenv").config()
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose'
import cookieSession from 'cookie-session';


// import { currentUserRouter } from './auth/';
import { signinRouter } from './routes/auth/signin';
import { signoutRouter } from './routes/auth/signout';
import { signupRouter } from './routes/auth/signup';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './error/not-found-error';
import { createSurveyRouter } from './routes/survey/create-survey';
import { retrieveUserAnswer } from './routes/survey/retrieve-user-answer';
import { createUserSurveyRouter } from './routes/survey/create-user-survey';
import { getSurveysRouter } from './routes/survey/get-survey';
import { currentUserRouter } from './routes/auth/current-user';
import { getRolesRouter } from './routes/role/get-roles';
import { createRoleRouter } from './routes/role/create-role';
import { Role } from './models/role';


const app = express();
app.set('trust proxy',true);
app.use(json());
app.use(cookieSession({
  signed:false,
  secure:false
}))

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(createSurveyRouter);
app.use(retrieveUserAnswer);
app.use(createUserSurveyRouter);
app.use(getSurveysRouter);
app.use(getRolesRouter);
app.use(createRoleRouter)


app.all("*",(req:any,res:any,next:any)=>{
  next(new NotFoundError())
});
app.use(errorHandler)


const start = async () => {

  if(!process.env.JWT_SECRET){
    throw new Error('JWT_SECRET KEY REQUIRED');
  }
  try {
      await mongoose.connect('mongodb+srv://dataCloud:mongodb@surveycluster.lnd3bnb.mongodb.net/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);

  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
