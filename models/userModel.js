const mongooese = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongooese.Schema({
    name : {
        type : String,
        required : [true,'Please tell us your name'],
        trim : true
    },
    email : {
        type : String,
        required : [true, 'Please provide an email'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail, 'Please provide a valid email']
    },
    role :{
        type : String,
        enum : {
            values : ['user','admin','lead-guide'],
        },
        default : "user"
        
    },
    photo : {
        type : String,
        default: 'default.jpg'
    },
    password : {
        type : String,
        required : [true, 'Please provide a pasword'],
        minlength :  8,
        select : false  
    },
    passwordConfirm : {
        type : String,
        required : [true, 'Please confirm your pasword'],
        validate : {
            validator : function(val){
                return val === this.password;
            },
            message : 'Passwords don\'t match'
        }
    },
    passwordChangeAt : {
        type : Date
    },
    passwordResetToken : {
        type : String,
    },
    passwordResetExpire : Date,
    active : {
        type : Boolean,
        default : true,
        select : false
    }
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    //hash password
    this.password = await bcrypt.hash(this.password, 12);

    //delete passwordConfirm
    this.passwordConfirm = undefined;
    next();
});
userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangeAt = Date.now() - 1000;
    next();
});
userSchema.pre(/^find/, function(next){
    this.find({active : { $ne : false }});
    next();
});
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordafter = function(JWTTimestamp){
    if(this.passwordChangeAt){
        const changedTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }

    //Password is not changed
    return false;
}

userSchema.methods.createResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpire = Date.now() + 1000 * 60 * 60;

    

    return resetToken;
}

const User = mongooese.model('User',userSchema);

module.exports = User;