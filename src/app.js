import express from 'express';
import morgan from 'morgan';

import { userRoutes } from './routes/user';
import { groupRoutes } from './routes/group';
import db from './loaders/database';

const app = express();
const PORT = process.env.PORT || 3000;

process.on('uncaughtException', async err => {
    console.log(`Uncaught Exception: ${err.message}`);
    await db.sequelize.close();
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    await db.sequelize.close();
    process.exit(1);
});

app.disable('x-powered-by');
app.use(morgan('combined'));
app.use(express.json());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/groups', groupRoutes);

// Logs all unhandled errors and returns a standard message with HTTP code 500 (Internal Server Error)
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);

    console.error(err.stack);
    res.status(500).json({
        status: 'failed',
        error: 'Internal Server Error'
    });
});

db.sequelize
    .sync()
    .then(result => {
        console.log(result);
        app.listen(PORT, () => {
            console.log(`App listening at http://localhost:${PORT}`);
        });
    })
    .catch(error => console.log(error));
