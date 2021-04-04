import express from 'express';
import { userRoutes } from './routes/user';

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.json());
app.use('/api/v1/users', userRoutes);
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);

    console.error(err.stack);
    res.status(500).json({
        status: 'failed',
        error: 'Internal Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
