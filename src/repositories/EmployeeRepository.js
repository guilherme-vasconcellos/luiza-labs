import ConnectionFactory from './ConnectionFactory';
import Employee from '../models/Employee';

/**
 * @author Guilherme Vasconcellos <guiyllw@hotmail.com>
 */
export default class EmployeeRepository {
    static initialize() {
        ConnectionFactory.connect();
    }

    static async create(employee) {
        const created = await new Employee(employee).save();
        return {
            id: created._id,
            name: created.name,
            email: created.email,
            department: created.department,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt
        };
    }

    static async list(where = {}) {
        const employees = await Employee.find(where);

        return employees
            .map(e => ({
                id: e._id,
                name: e.name,
                email: e.email,
                department: e.department,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt
            }));
    }

    static async findByEmail(email) {
        const employee = await Employee.findOne({ email });
        if (!employee) {
            throw new Error(`Employee with email: "${email}" not found`);
        }

        return {
            id: employee._id,
            name: employee.name,
            email: employee.email,
            department: employee.department,
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt
        };
    }

    static async updateByEmail(email, newEmployee) {
        const employee = await Employee.findOneAndUpdate({ email }, newEmployee);
        if (!employee) {
            throw new Error(`Employee with email: "${email}" not found`);
        }

        const updatedEmployee = await EmployeeRepository.findByEmail(email);
        return updatedEmployee;
    }

    static async deleteByEmail(email) {
        const employee = await Employee.deleteOne({ email });
        if (!employee.deletedCount) {
            throw new Error(`Employee with email: "${email}" not found`);
        }
    }
}
