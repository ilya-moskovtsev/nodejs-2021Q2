import express from 'express';

import { userRoutes } from './routes/user';
import { groupRoutes } from './routes/group';
import db from './loaders/database';
import logger from './loaders/logger';

const app = express();
const PORT = process.env.PORT || 3000;

process.on('uncaughtException', async err => {
    logger.error(`Uncaught Exception: ${err.message}`);
    await db.sequelize.close();
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await db.sequelize.close();
    process.exit(1);
});

app.disable('x-powered-by');
app.use((req, res, next) => {
    logger.info(req);
    next();
});
app.use(express.json());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/groups', groupRoutes);

// Logs all unhandled errors and returns a standard message with HTTP code 500 (Internal Server Error)
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);

    logger.error(err.stack);
    res.status(500).json({
        status: 'failed',
        error: 'Internal Server Error'
    });
});

db.sequelize
    .sync()
    .then(result => {
        logger.info(result);
        app.listen(PORT, () => {
            logger.info(`App listening at http://localhost:${PORT}`);
        });
    })
    .catch(error => logger.error(error));
