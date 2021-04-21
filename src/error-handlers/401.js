'use strict';

module.exports = (err, req, res, next) => {
    let error = { error: err.message || err };
    res.statusCode = err.status || 401;
    res.statusMessage = err.statusMessage || 'Unauthorized';
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(error));
    res.end();
};