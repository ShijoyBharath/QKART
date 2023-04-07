const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");
// const {User} = require("../models")

/**
 * Login with username and password
 * - Utilize userService method to fetch user object corresponding to the email provided
 * - Use the User schema's "isPasswordMatch" method to check if input password matches the one user registered with (i.e, hash stored in MongoDB)
 * - If user doesn't exist or incorrect password,
 * throw an ApiError with "401 Unauthorized" status code and message, "Incorrect email or password"
 * - Else, return the user object
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  // try{
  //   let user = new User({email : email, password: password})
  //   console.log("loginUserWithEmailAndPassword() - params - email, password : ", email, password)
  //   console.log("loginUserWithEmailAndPassword() - user model : ", user)
  //   let res = await user.isPasswordMatch(password) 
  //   if (res===null){
  //     return (new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password"))
  //   }
  //   let data = await userService.getUserByEmail(email)
  //   console.log("Auth service loginUserWithEmailAndPassword() : data,  res : ", data, res)
  //   if(data.length===0 || !res){
  //     return(new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password"))
  //     // return data
  //     }else{
  //       return data
  //     }
    
  // }catch(err){
  //     console.log(err.message)
  // }


  const user=await userService.getUserByEmail(email)

  if(!user){
    throw new ApiError(httpStatus.UNAUTHORIZED,"Incorrect email or password")
  }
  const isPasswordTrue=await user.isPasswordMatch(password)

  if(!isPasswordTrue){
    throw new ApiError(httpStatus.UNAUTHORIZED,"Incorrect email or password")
  }

  return user
};

module.exports = {
  loginUserWithEmailAndPassword,
};
