import UserController from '../../src/controllers/user.controller';

jest.mock('../../src/loaders/database.js');
jest.mock('../../src/services/user.service', () => {
    return {
        findById: (id) => {
            if (id === 'error') throw new Error('findById');
            return id ? { id } : undefined;
        },
        getAutoSuggestUsers: (loginSubstring, limit) => {
            if (loginSubstring === 'error' || limit === 'error') throw new Error('getAutoSuggestUsers');
            return [{ id: 'SuggestedUser1' }, { id: 'SuggestedUser2' }];
        },
        findAll: () => {
            return [{ id: 'userA' }, { id: 'userB' }];
        },
        create: (user) => {
            if (user.id === 'error') throw new Error('create');
            return user.id;
        },
        update: (target, source) => {
            if (target === 'error' || source === 'error') throw new Error('update');
            return { success: true };
        },
        delete: (user) => {
            if (user === 'error') throw new Error('delete');
            return { success: true };
        }
    };
});

const userController = new UserController();

describe('UserController', () => {
    it('findById should call next() when user is found', async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const findById = userController.findById();

        await findById(mockReq, mockRes, mockNext, 'user_id');

        expect(mockReq.user).toMatchObject({ id: 'user_id' });
        expect(mockNext).toBeCalledWith();
        expect(mockRes.status).not.toBeCalled();
        expect(mockRes.json).not.toBeCalled();
    });

    it('findById should 404 when user not found', async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const findById = userController.findById();

        await findById(mockReq, mockRes, mockNext, undefined);

        expect(mockReq.user).toBeUndefined();
        expect(mockNext).not.toBeCalled();
        expect(mockRes.status).toBeCalledWith(404);
        expect(mockRes.json).toBeCalledWith({ message: 'User with id undefined not found' });
    });

    it('findById should call next(e) when error', async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const findById = userController.findById();

        await findById(mockReq, mockRes, mockNext, 'error');

        expect(mockReq.user).toBeUndefined();
        expect(mockNext).toBeCalledWith(new Error('findById'));
        expect(mockRes.status).not.toBeCalled();
        expect(mockRes.json).not.toBeCalled();
    });

    it('getUser', async () => {
        const mockReq = {
            user: { id: 'user_id' }
        };
        const mockRes = {
            json: jest.fn()
        };
        const getUser = userController.getUser();

        getUser(mockReq, mockRes);

        expect(mockRes.json).toBeCalledWith({ id: 'user_id' });
    });

    it('getUsers should getAutoSuggestUsers when loginSubstring and limit are provided', async () => {
        const mockReq = {
            query: { loginSubstring: 'user', limit: 1 }
        };
        const mockRes = {
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const getUsers = userController.getUsers();

        await getUsers(mockReq, mockRes, mockNext);

        expect(mockRes.json).toBeCalledWith([{ id: 'SuggestedUser1' }, { id: 'SuggestedUser2' }]);
        expect(mockNext).not.toBeCalled();
    });

    it('getUsers should findAll when loginSubstring and limit are not provided', async () => {
        const mockReq = {
            query: {}
        };
        const mockRes = {
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const getUsers = userController.getUsers();

        await getUsers(mockReq, mockRes, mockNext);

        expect(mockRes.json).toBeCalledWith([{ id: 'userA' }, { id: 'userB' }]);
        expect(mockNext).not.toBeCalled();
    });

    it('getUsers should call next(e) when error', async () => {
        const mockReq = {
            query: { loginSubstring: 'error', limit: 'error' }
        };
        const mockRes = {
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const getUsers = userController.getUsers();

        await getUsers(mockReq, mockRes, mockNext);

        expect(mockNext).toBeCalledWith(new Error('getAutoSuggestUsers'));
        expect(mockRes.json).not.toBeCalled();
    });

    it('create should create a new user and return id', async () => {
        const mockReq = {
            body: { id: 'new user' }
        };
        const mockRes = {
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const create = userController.create();

        await create(mockReq, mockRes, mockNext);

        expect(mockRes.json).toBeCalledWith({ id: 'new user' });
        expect(mockNext).not.toBeCalled();
    });

    it('create should call next(e) when error', async () => {
        const mockReq = {
            body: { id: 'error' }
        };
        const mockRes = {
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const create = userController.create();

        await create(mockReq, mockRes, mockNext);

        expect(mockNext).toBeCalledWith(new Error('create'));
        expect(mockRes.json).not.toBeCalled();
    });

    it('update should update a user', async () => {
        const mockReq = {
            user: { id: 'target' },
            body: { id: 'source' }
        };
        const mockRes = {
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const update = userController.update();

        await update(mockReq, mockRes, mockNext);

        expect(mockRes.json).toBeCalledWith({ success: true });
        expect(mockNext).not.toBeCalled();
    });

    it('update should call next(e) when error', async () => {
        const mockReq = {
            user: 'error',
            body: 'error'
        };
        const mockRes = {
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const update = userController.update();

        await update(mockReq, mockRes, mockNext);

        expect(mockNext).toBeCalledWith(new Error('update'));
        expect(mockRes.json).not.toBeCalled();
    });

    it('delete should delete a user', async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn(() => mockRes),
            end: jest.fn()
        };
        const mockNext = jest.fn();
        const deleteFn = userController.delete();

        await deleteFn(mockReq, mockRes, mockNext);

        expect(mockRes.status).toBeCalledWith(204);
        expect(mockRes.end).toBeCalled();
        expect(mockNext).not.toBeCalled();
    });

    it('delete should call next(e) when error', async () => {
        const mockReq = {
            user: 'error'
        };
        const mockRes = {
            status: jest.fn(() => mockRes),
            end: jest.fn()
        };
        const mockNext = jest.fn();
        const deleteFn = userController.delete();

        await deleteFn(mockReq, mockRes, mockNext);

        expect(mockNext).toBeCalledWith(new Error('delete'));
        expect(mockRes.status).not.toBeCalled();
        expect(mockRes.end).not.toBeCalled();
    });
});
