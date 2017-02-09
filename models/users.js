var mongoose = require('mongoose');
//var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    }

});

//UserSchema.methods.validatePassword = function (password) {
//    return bcrypt
//        .compare(password, this.password)
//        .then(isValid => isValid);
//}
//
//UserSchema.statics.hashPassword = function (password) {
//    return bcrypt
//        .hash(password, 8)
//        .then(hash => hash);
//}
//
//userSchema.methods.apiRepr = function () {
//    return {
//        id: this._id,
//        userName: this.userName,
//        password: this.password,
//        zipCode: this.zipCode
//    };
//}
//
//};

var Users = mongoose.model('User', userSchema);

module.exports = {
    Users
};
