import mongoose, { Schema } from 'mongoose';
import uuid4 from 'uuid/v4';

const definition = {
    _id: {
        type: String,
        default: () => uuid4()
    },
    name: {
        type: String,
        required: [true, 'Employee name is required']
    },
    email: {
        type: String,
        required: [true, 'Employee email is required'],
        index: {
            unique: true
        }
    },
    department: {
        type: String,
        required: [true, 'Employee department is required']
    }
};

const schema = new Schema(definition, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

export default mongoose.model('Employee', schema, 'Employee');
