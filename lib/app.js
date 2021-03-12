import express from "express";
import {userRoutes} from "./routes/user"

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use('/api/v1/users', userRoutes);

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})