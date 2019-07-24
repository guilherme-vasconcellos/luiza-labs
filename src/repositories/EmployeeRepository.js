import ConnectionFactory from './ConnectionFactory';
import Employee from '../models/Employee';

/**
 * @author Guilherme Vasconcellos <guiyllw@hotmail.com>
 */
export default class EmployeeRepository {
    constructor() {
        ConnectionFactory.connect();
    }

    /**
     * @author Guilherme Vasconcellos <guiyllw@hotmail.com>
     * @description Method to create an employee from javascript object
     *
     * @param employee Object containing employee data to create
     */
    async create(employee) {
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

    /**
     * @author Guilherme Vasconcellos <guiyllw@hotmail.com>
     * @description Method to list employees by filter
     *
     * @param where Object containing employee field and value to filter on database
     */
    async list(where = {}) {
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

    /**
     * @author Guilherme Vasconcellos <guiyllw@hotmail.com>
     * @description Method to get an employee by email
     *
     * @param email Employee email to find on database
     */
    async findByEmail(email) {
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

    /**
     * @author Guilherme Vasconcellos <guiyllw@hotmail.com>
     * @description Method to update an employee by email
     *
     * @param email Employee email to update on database
     * @param newEmployee Partial employee data to update on database
     */
    async updateByEmail(email, newEmployee) {
        const employee = await Employee.findOneAndUpdate({ email }, newEmployee);
        if (!employee) {
            throw new Error(`Employee with email: "${email}" not found`);
        }

        const updatedEmployee = await this.findByEmail(email);
        return updatedEmployee;
    }

    /**
     * @author Guilherme Vasconcellos <guiyllw@hotmail.com>
     * @description Method to delete an employee by email
     *
     * @param email Employee email to delete on database
     */
    async deleteByEmail(email) {
        const employee = await Employee.deleteOne({ email });
        if (!employee.deletedCount) {
            throw new Error(`Employee with email: "${email}" not found`);
        }
    }
}
