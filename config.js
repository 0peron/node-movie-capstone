exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    (process.env.NODE_ENV === 'production' ?
        'mongodb://localhost/node-movie-capstone' :
        'mongodb://localhost/node-movie-capstone');
exports.PORT = process.env.PORT || 3000;
