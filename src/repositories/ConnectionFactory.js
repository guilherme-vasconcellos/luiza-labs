import mongoose from 'mongoose';

const {
    DB_CONNECTION
} = process.env;

let connected = false;

/**
 * @author Guilherme Vasconcellos <guiyllw@hotmail.com>
 */
export default class ConnectionFactory {
    static connect() {
        if (!connected) {
            mongoose.connect(DB_CONNECTION, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false
            });

            connected = true;
        }
    }
}
