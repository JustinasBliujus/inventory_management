
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import router from './routes/router.js';
import db from './db.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

 app.use(cors({ 
     origin: process.env.FRONTEND_URL, 
     credentials: true 
 }));

 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(cookieParser());

 db.sync()
   .then(() => console.log("All models synchronized successfully."))
   .catch(err => console.error("Error syncing models:", err));

 app.use(session({
     secret: process.env.SESSION_SECRET || 'sessionkey',
     resave: false,
     saveUninitialized: false,
     cookie: {
         httpOnly: true,
         sameSite: 'lax',
         secure: false
     }
 }));

app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
