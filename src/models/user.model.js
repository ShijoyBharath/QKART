const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const config = require("../config/config");
const bcrypt = require("bcryptjs");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Complete userSchema, a Mongoose schema for "users" collection
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      // trim: true,
      // lowercase: true,
      // vaildate: validator.isEmail,

    },
    password: {
      type: String,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      // required: true,
      // trim: true,
      // minLength: 8,
    },
    walletMoney: {
      type: Number,
      // required: true,
      default: 500,
    },
    address: {
      type: String,
      default: config.default_address,
    },

    createdAt:{
      type: Date,
      default:Date.now
    },
    updatedAt:{
      type: Date,
      default:Date.now
    }
  },
  // Create createdAt and updatedAt fields automatically
  {
    timestamps: true,
  }
);

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement the isEmailTaken() static method
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email) {
  // try{
  //   // let res = await userSchema.find({email: email})
  //   let x = mongoose.model("users", userSchema)

  //   let res = await x.find({email: email})
  //   if(res.length===0){
  //     console.log("isEmailTaken False : ", res)
  //     return false
  //   } else {
  //     console.log("isEmailTaken True : ", res)
  //     return true
  //   }
  // }catch(err){
  //   console.log("Error isEmailTaken False : ", err.message)
  //   // return false
  // }
  console.log("isEmailTaken email, User: ", email)
  const isUserExist=await this.findOne({email:email})
  if(isUserExist){
    return true
  }
  return false
};


/**
 * Check if entered password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
 userSchema.methods.isPasswordMatch = async function (password) {
  // try{
  //   let x = mongoose.model("users", userSchema)
  //   let data = await x .findOne({email: this.email})
  //   console.log("isPasswordMatch() data : ", data)
  //   if(data===null){
  //     return null
  //   }
  //   console.log("isPasswordMatch() - password, data.password : ", password, data.password)
  //   let valid = await bcrypt.compare(password, data.password);
  //   console.log("isPasswordMatch() - valid : ", valid)
  //   if(valid){
  //     return true
  //   } else{
  //     return false
  //   }
  // }catch(err){
  //   console.log("isPasswordMatch() - error : ", err.message)
  // }


  const isMatch=await bcrypt.compare(password,this.password)

  return isMatch
  };


userSchema.pre('save', function(next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(12, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});
});

userSchema.methods.hasSetNonDefaultAddress = async function () {
  const user = this;
   return user.address !== config.default_address;
};

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS
/*
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const User = require("<user.model file path>").User;
 */
/**
 * @typedef User
 */
// module.exports.User = mongoose.model("User",userSchema)

const User=new mongoose.Schema(userSchema)



module.exports={User:mongoose.model("User",User)}

