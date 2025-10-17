import express from 'express'
import cors from 'cors'
import { createDatabase } from './createDatabase.js';
import router from './routes/router.js';
import session from 'express-session'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ 
    origin: "http://localhost:5173", 
    credentials: true,
    
}));
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));

createDatabase();

app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,  
    }
}));

app.use('/', router); 

app.listen(process.env.PORT, () => {
    console.log("server started");
})