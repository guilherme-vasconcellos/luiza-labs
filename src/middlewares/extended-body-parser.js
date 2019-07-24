import bodyParser from 'body-parser';

/**
 * @author Guilherme Vasconcellos <guiyllw@hotmail.com>
 * @description Middleware function to convert buffer to javascript object
 */
function bufferParser(req, res, next) {
    try {
        if (Buffer.isBuffer(req.body)) {
            const json = req.body.toString('utf8');
            req.body = JSON.parse(json);
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

    return next();
}

/**
 * @author Guilherme Vasconcellos <guiyllw@hotmail.com>
 * @description Middleware function to accept application/javascript content type
 */
function javascript() {
    const options = {
        inflate: true,
        type: 'application/javascript'
    };

    return [bodyParser.raw(options), bufferParser];
}

export default {
    javascript
};
