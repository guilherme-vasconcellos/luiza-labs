import mongoose from 'mongoose';
import axios from 'axios';

import server from '../../src/server';

import Employee from '../../src/models/Employee';

const {
    PORT,
    DB_CONNECTION
} = process.env;

describe('/employee integration tests', () => {
    const endpoint = `http://localhost:${PORT}/employee`;

    let api;
    beforeAll(async done => {
        await mongoose.connect(DB_CONNECTION, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        await Employee.deleteMany({});

        api = server.listen(PORT, done);
    });

    afterAll(async done => {
        await Employee.deleteMany({});
        await mongoose.connection.close();

        if (!api) {
            return done();
        }

        api.close(done);
    });

    describe('POST /employee', () => {
        afterAll(async done => {
            await Employee.deleteOne({ email: 'johndoe@test.com' });
            done();
        });

        test('Should create an employee with success', async () => {
            const employee = {
                name: 'John Doe',
                email: 'johndoe@test.com',
                department: 'TI'
            };

            const params = {
                headers: {
                    'Content-Type': 'application/javascript'
                }
            };

            const response = await axios.post(endpoint, employee, params);

            expect(response.status).toEqual(201);
            expect(response.data).toEqual(expect.objectContaining(employee));
        });

        test('Should respond with error when try to create an employee without required fields', async () => {
            const employee = {
                name: 'John Doe',
                email: 'johndoe@test.com'
            };

            const params = {
                headers: {
                    'Content-Type': 'application/javascript'
                }
            };

            try {
                await axios.post(endpoint, employee, params);
                throw new Error('Unexpected result');
            } catch (err) {
                expect(err.response.status).toEqual(400);
                expect(err.response.data.error).toEqual(expect.stringContaining('Employee department is required'));
            }
        });
    });

    describe('GET /employee', () => {
        afterAll(async done => {
            await Employee.deleteMany({});
            done();
        });

        beforeAll(async done => {
            const employees = [
                {
                    name: 'John Doe 1',
                    email: 'johndoe1@test.com',
                    department: 'TI 1'
                },
                {
                    name: 'John Doe 2',
                    email: 'johndoe2@test.com',
                    department: 'TI 2'
                },
                {
                    name: 'John Doe 3',
                    email: 'johndoe3@test.com',
                    department: 'TI 3'
                }
            ];

            await Employee.insertMany(employees);
            done();
        });

        test('Should return list of employees', async () => {
            const response = await axios.get(endpoint);

            expect(response.status).toEqual(200);
            expect(response.data).toHaveLength(3);
        });
    });

    describe('GET /employee/email', () => {
        afterAll(async done => {
            await Employee.deleteOne({ email: 'johndoe@test.com' });
            done();
        });

        beforeAll(async done => {
            const employee = {
                name: 'John Doe',
                email: 'johndoe@test.com',
                department: 'TI'
            };

            await new Employee(employee).save();
            done();
        });

        test('Should return one employee', async () => {
            const email = 'johndoe@test.com';
            const response = await axios.get(`${endpoint}/${email}`);

            expect(response.status).toEqual(200);
            expect(response.data.email).toEqual(email);
        });

        test('Should return error when try to find inexistent employee', async () => {
            const email = 'johndoe@test.notexists.com';

            try {
                await axios.get(`${endpoint}/${email}`);
                throw new Error('Unexpected result');
            } catch (err) {
                expect(err.response.status).toEqual(404);
                expect(err.response.data.error).toEqual(expect.stringContaining(`Employee with email: "${email}" not found`));
            }
        });
    });

    describe('PUT /employee/email', () => {
        afterAll(async done => {
            await Employee.deleteOne({ email: 'johndoe@test.com' });
            done();
        });

        beforeAll(async done => {
            const employee = {
                name: 'John Doe',
                email: 'johndoe@test.com',
                department: 'TI'
            };

            await new Employee(employee).save();
            done();
        });

        test('Should update employee with success', async () => {
            const employee = {
                name: 'John Doe Harrison'
            };

            const params = {
                headers: {
                    'Content-Type': 'application/javascript'
                }
            };

            const email = 'johndoe@test.com';
            const response = await axios.put(`${endpoint}/${email}`, employee, params);

            expect(response.status).toEqual(200);
            expect(response.data.name).toEqual(employee.name);
            expect(response.data.email).toEqual(email);
        });

        test('Should return error when try to updated inexistent employee', async () => {
            const employee = {
                name: 'John Doe Harrison'
            };

            const params = {
                headers: {
                    'Content-Type': 'application/javascript'
                }
            };

            const email = 'johndoe@test.notexists.com';

            try {
                await axios.put(`${endpoint}/${email}`, employee, params);
                throw new Error('Unexpected result');
            } catch (err) {
                expect(err.response.status).toEqual(404);
                expect(err.response.data.error).toEqual(expect.stringContaining(`Employee with email: "${email}" not found`));
            }
        });
    });

    describe('DELETE /employee/email', () => {
        beforeAll(async done => {
            const employee = {
                name: 'John Doe',
                email: 'johndoe@test.com',
                department: 'TI'
            };

            await new Employee(employee).save();
            done();
        });

        test('Should delete employee with success', async () => {
            const email = 'johndoe@test.com';
            const response = await axios.delete(`${endpoint}/${email}`);

            expect(response.status).toEqual(204);
        });

        test('Should return error when try delete inexistent employee', async () => {
            const email = 'johndoe@test.notexists.com';

            try {
                await axios.delete(`${endpoint}/${email}`);
                throw new Error('Unexpected result');
            } catch (err) {
                expect(err.response.status).toEqual(404);
                expect(err.response.data.error).toEqual(expect.stringContaining(`Employee with email: "${email}" not found`));
            }
        });
    });
});
