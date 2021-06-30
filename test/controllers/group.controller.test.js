import GroupController from '../../src/controllers/group.controller';

jest.mock('../../src/loaders/database.js');
jest.mock('../../src/services/group.service', () => {
    return {
        findById: (group_id) => {
            if (group_id === 'error') throw new Error('findById');
            return group_id ? { id: group_id } : undefined;
        },
        findAll: () => {
            return [{ id: 'groupA' }, { id: 'groupB' }];
        },
        create: (group) => {
            if (group.id === 'error') throw new Error('create');
            return group.id;
        },
        addUsersToGroup: (group, userIds) => {
            if (group === 'error' || userIds === 'error') throw new Error('addUsersToGroup');
            return { success: true };
        },
        update: (target, source) => {
            if (target === 'error' || source === 'error') throw new Error('update');
            return { success: true };
        },
        delete: (group) => {
            if (group === 'error') throw new Error('delete');
            return { success: true };
        }
    };
});

const groupController = new GroupController();

describe('GroupController', () => {
    it('findById should call next() when group is found', async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const findById = groupController.findById();

        await findById(mockReq, mockRes, mockNext, 'group_id');

        expect(mockReq.group).toMatchObject({ id: 'group_id' });
        expect(mockNext).toBeCalledWith();
        expect(mockRes.status).not.toBeCalled();
        expect(mockRes.json).not.toBeCalled();
    });

    it('findById should 404 when group not found', async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const findById = groupController.findById();

        await findById(mockReq, mockRes, mockNext, undefined);

        expect(mockReq.group).toBeUndefined();
        expect(mockNext).not.toBeCalled();
        expect(mockRes.status).toBeCalledWith(404);
        expect(mockRes.json).toBeCalledWith({ message: 'Group with id undefined not found' });
    });

    it('findById should call next(e) when error', async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const findById = groupController.findById();

        await findById(mockReq, mockRes, mockNext, 'error');

        expect(mockReq.group).toBeUndefined();
        expect(mockNext).toBeCalledWith(new Error('findById'));
        expect(mockRes.status).not.toBeCalled();
        expect(mockRes.json).not.toBeCalled();
    });

    it('getGroup', async () => {
        const mockReq = {
            group: { id: 'group_id' }
        };
        const mockRes = {
            json: jest.fn()
        };
        const getGroup = groupController.getGroup();

        getGroup(mockReq, mockRes);

        expect(mockRes.json).toBeCalledWith({ id: 'group_id' });
    });

    it('getGroups should findAll groups', async () => {
        const mockReq = {};
        const mockRes = {
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const getGroups = groupController.getGroups();

        await getGroups(mockReq, mockRes, mockNext);

        expect(mockRes.json).toBeCalledWith([{ id: 'groupA' }, { id: 'groupB' }]);
        expect(mockNext).not.toBeCalled();
    });

    it('getGroups should call next(e) when error', async () => {
        jest.doMock('../../src/services/group.service', () => {
            return {
                findAll: () => {
                    throw new Error('findAll');
                }
            };
        });
        const mockReq = {};
        const mockRes = {
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const getGroups = groupController.getGroups();

        await getGroups(mockReq, mockRes, mockNext);

        expect(mockNext).toBeCalledWith(new Error('findAll'));
        expect(mockRes.json).not.toBeCalled();
    });

    it('create should create a new group and return id', async () => {
        const mockReq = {
            body: { id: 'new group' }
        };
        const mockRes = {
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const create = groupController.create();

        await create(mockReq, mockRes, mockNext);

        expect(mockRes.json).toBeCalledWith({ id: 'new group' });
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
        const create = groupController.create();

        await create(mockReq, mockRes, mockNext);

        expect(mockNext).toBeCalledWith(new Error('create'));
        expect(mockRes.json).not.toBeCalled();
    });

    it('addUsersToGroup should add users to group', async () => {
        const mockReq = {
            group: {},
            body: []
        };
        const mockRes = {
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const addUsersToGroup = groupController.addUsersToGroup();

        await addUsersToGroup(mockReq, mockRes, mockNext);

        expect(mockRes.json).toBeCalledWith({ success: true });
        expect(mockNext).not.toBeCalled();
    });

    it('addUsersToGroup should call next(e) when error', async () => {
        const mockReq = {
            group: 'error',
            body: 'error'
        };
        const mockRes = {
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const addUsersToGroup = groupController.addUsersToGroup();

        await addUsersToGroup(mockReq, mockRes, mockNext);

        expect(mockNext).toBeCalledWith(new Error('addUsersToGroup'));
        expect(mockRes.json).not.toBeCalled();
    });

    it('update should update a group', async () => {
        const mockReq = {
            group: { id: 'target' },
            body: { id: 'source' }
        };
        const mockRes = {
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const update = groupController.update();

        await update(mockReq, mockRes, mockNext);

        expect(mockRes.json).toBeCalledWith({ success: true });
        expect(mockNext).not.toBeCalled();
    });

    it('update should call next(e) when error', async () => {
        const mockReq = {
            group: 'error',
            body: 'error'
        };
        const mockRes = {
            json: jest.fn()
        };
        const mockNext = jest.fn();
        const update = groupController.update();

        await update(mockReq, mockRes, mockNext);

        expect(mockNext).toBeCalledWith(new Error('update'));
        expect(mockRes.json).not.toBeCalled();
    });

    it('delete should delete a group', async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn(() => mockRes),
            end: jest.fn()
        };
        const mockNext = jest.fn();
        const deleteFn = groupController.delete();

        await deleteFn(mockReq, mockRes, mockNext);

        expect(mockRes.status).toBeCalledWith(204);
        expect(mockRes.end).toBeCalled();
        expect(mockNext).not.toBeCalled();
    });

    it('delete should call next(e) when error', async () => {
        const mockReq = {
            group: 'error'
        };
        const mockRes = {
            status: jest.fn(() => mockRes),
            end: jest.fn()
        };
        const mockNext = jest.fn();
        const deleteFn = groupController.delete();

        await deleteFn(mockReq, mockRes, mockNext);

        expect(mockNext).toBeCalledWith(new Error('delete'));
        expect(mockRes.status).not.toBeCalled();
        expect(mockRes.end).not.toBeCalled();
    });
});
