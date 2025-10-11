import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));

app.get("/api", (req,res) => {
    res.json({"fruits": ["apple"]});
});

app.listen(3000, () => {
    console.log("server started");
})