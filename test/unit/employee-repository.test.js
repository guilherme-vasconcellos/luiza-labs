import EmployeeRepository from '../../src/repositories/EmployeeRepository';
import Employee from '../../src/models/Employee';

jest.mock('../../src/repositories/ConnectionFactory');

describe('Employee CRUD tests', () => {
    let employeeRepository;

    beforeAll(() => {
        employeeRepository = new EmployeeRepository();
    });

    describe('Create employee', () => {
        test('Should create an employee with success', async () => {
            const expectedEmployee = {
                _id: 'e0c50c8a-787e-43c7-9acd-08cf589d551e',
                name: 'John Doe',
                email: 'johndoe@test.com',
                department: 'TI',
                createdAt: '2019-07-22T22:08:21.196Z',
                updatedAt: '2019-07-22T22:08:21.196Z'
            };

            const saveSpy = jest.spyOn(Employee.prototype, 'save')
                .mockResolvedValue(expectedEmployee);

            const expectedCreated = { ...expectedEmployee, id: expectedEmployee._id };
            delete expectedCreated._id;

            const employee = {
                name: 'John Doe',
                email: 'johndoe@test.com',
                department: 'TI'
            };

            const created = await employeeRepository.create(employee);

            expect(saveSpy).toHaveBeenCalled();
            expect(created).toMatchObject(expectedCreated);
        });

        test('Should throw an exception when try to create an employee without required fields', async () => {
            const employee = {
                name: 'John Doe',
                email: 'johndoe@test.com'
            };

            const saveSpy = jest.spyOn(Employee.prototype, 'save')
                .mockImplementation(() => {
                    throw new Error('Employee department is required');
                });

            try {
                await employeeRepository.create(employee);
                throw new Error('Unexpected result');
            } catch (err) {
                expect(saveSpy).toHaveBeenCalled();
                expect(err.message).toEqual(expect.stringContaining('Employee department is required'));
            }
        });
    });

    describe('List and find employees', () => {
        test('Should return list of employees', async () => {
            const findSpy = jest.spyOn(Employee, 'find')
                .mockResolvedValue([
                    {
                        _id: 'e0c50c8a-787e-43c7-9acd-08cf589d551e',
                        name: 'John Doe 1',
                        email: 'johndoe1@test.com',
                        department: 'TI 1',
                        createdAt: '2019-07-22T22:08:21.196Z',
                        updatedAt: '2019-07-22T22:08:21.196Z'
                    },
                    {
                        _id: 'e0c50c8a-787e-43c7-9acd-08cf589d552e',
                        name: 'John Doe 2',
                        email: 'johndoe2@test.com',
                        department: 'TI 2',
                        createdAt: '2019-07-22T22:08:21.196Z',
                        updatedAt: '2019-07-22T22:08:21.196Z'
                    },
                    {
                        _id: 'e0c50c8a-787e-43c7-9acd-08cf589d553e',
                        name: 'John Doe 3',
                        email: 'johndoe3@test.com',
                        department: 'TI 3',
                        createdAt: '2019-07-22T22:08:21.196Z',
                        updatedAt: '2019-07-22T22:08:21.196Z'
                    }
                ]);

            const employees = await employeeRepository.list();

            expect(findSpy).toHaveBeenCalledWith({});
            expect(employees).toHaveLength(3);
        });

        test('Should return one employee', async () => {
            const expectedEmployee = {
                _id: 'e0c50c8a-787e-43c7-9acd-08cf589d551e',
                name: 'John Doe',
                email: 'johndoe@test.com',
                department: 'TI',
                createdAt: '2019-07-22T22:08:21.196Z',
                updatedAt: '2019-07-22T22:08:21.196Z'
            };

            const findOneSpy = jest.spyOn(Employee, 'findOne')
                .mockResolvedValue(expectedEmployee);

            const expectedFind = { ...expectedEmployee, id: expectedEmployee._id };
            delete expectedFind._id;

            const email = 'johndoe@test.com';
            const employee = await employeeRepository.findByEmail(email);

            expect(findOneSpy).toHaveBeenCalledWith({ email });
            expect(employee).toMatchObject(expectedFind);
        });

        test('Should throw an error when try to find inexistent employee', async () => {
            const email = 'johndoe@test.notexists.com';

            const findOneSpy = jest.spyOn(Employee, 'findOne')
                .mockImplementation(() => {
                    throw new Error(`Employee with email: "${email}" not found`);
                });

            try {
                await employeeRepository.findByEmail(email);
                throw new Error('Unexpected result');
            } catch (err) {
                expect(findOneSpy).toHaveBeenCalledWith({ email });
                expect(err.message).toEqual(expect.stringContaining(`Employee with email: "${email}" not found`));
            }
        });
    });

    describe('Update employee', () => {
        test('Should update employee with success', async () => {
            const expectedEmployee = {
                _id: 'e0c50c8a-787e-43c7-9acd-08cf589d551e',
                name: 'John Doe Harrison',
                email: 'johndoe@test.com',
                department: 'TI',
                createdAt: '2019-07-22T22:08:21.196Z',
                updatedAt: '2019-07-22T22:08:21.196Z'
            };

            const findOneAndUpdateSpy = jest.spyOn(Employee, 'findOneAndUpdate')
                .mockResolvedValue(expectedEmployee);

            const findOneSpy = jest.spyOn(Employee, 'findOne')
                .mockResolvedValue(expectedEmployee);

            const expectedUpdated = { ...expectedEmployee, id: expectedEmployee._id };
            delete expectedUpdated._id;

            const email = 'johndoe@test.com';
            const update = {
                name: 'John Doe Harrison'
            };

            const updated = await employeeRepository.updateByEmail(email, update);

            expect(findOneAndUpdateSpy).toHaveBeenCalledWith({ email }, update);
            expect(findOneSpy).toHaveBeenCalledWith({ email });
            expect(updated).toMatchObject(expectedUpdated);
        });

        test('Should throw an exception when try to updated inexistent employee', async () => {
            const email = 'johndoe@test.notexists.com';
            const update = {
                name: 'John Doe Harrison'
            };

            const findOneAndUpdateSpy = jest.spyOn(Employee, 'findOneAndUpdate')
                .mockImplementation(() => {
                    throw new Error(`Employee with email: "${email}" not found`);
                });

            const findOneSpy = jest.spyOn(Employee, 'findOne');

            try {
                await employeeRepository.updateByEmail(email, update);
                throw new Error('Unexpected result');
            } catch (err) {
                expect(findOneAndUpdateSpy).toHaveBeenCalledWith({ email }, update);
                expect(findOneSpy).not.toHaveBeenCalled();
                expect(err.message).toEqual(expect.stringContaining(`Employee with email: "${email}" not found`));
            }
        });
    });

    describe('Delete employee', () => {
        test('Should delete employee with success', async () => {
            const email = 'johndoe@test.com';

            const deleteOne = jest.spyOn(Employee, 'deleteOne')
                .mockResolvedValue({ deletedCount: 1 });

            await employeeRepository.deleteByEmail(email);

            expect(deleteOne).toHaveBeenCalledWith({ email });
        });

        test('Should throws an exception when try delete inexistent employee', async () => {
            const email = 'johndoe@test.notexists.com';

            const deleteOne = jest.spyOn(Employee, 'deleteOne')
                .mockResolvedValue({ deletedCount: 0 });

            try {
                await employeeRepository.deleteByEmail(email);
                throw new Error('Unexpected result');
            } catch (err) {
                expect(err.message).toEqual(expect.stringContaining(`Employee with email: "${email}" not found`));
                expect(deleteOne).toHaveBeenCalledWith({ email });
            }
        });
    });
});
