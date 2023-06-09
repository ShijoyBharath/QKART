const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../services");
const ApiError = require("../utils/ApiError");

/**
 * Perform the following steps:
 * -  Call the userService to create a new user
 * -  Generate auth tokens for the user
 * -  Send back
 * --- "201 Created" status code
 * --- response in the given format
 *
 * Example response:
 *
 * {
 *  "user": {
 *      "_id": "5f71b31888ba6b128ba16205",
 *      "name": "crio-user",
 *      "email": "crio-user@gmail.com",
 *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
 *      "createdAt": "2020-09-28T09:55:36.358Z",
 *      "updatedAt": "2020-09-28T09:55:36.358Z",
 *      "__v": 0
 *  },
 *  "tokens": {
 *      "access": {
 *          "token": "eyJhbGciOiJIUz....",
 *          "expires": "2020-10-22T09:29:01.745Z"
 *      }
 *  }
 *}
 *
 */
const register = catchAsync(async (req, res) => {
  // try{
  //   console.log("authController - register() ")
  //     let data = await userService.createUser(req.body)
  //     let token = await tokenService.generateAuthTokens(data)
  //     console.log("authController - register() - createUser data : ", data)
  //     // console.log("authController - register() - token : ", token)
  //     if(data===false){
  //       res.status(200)
  //       res.send("Email already taken")
  //     }else{
  //       const user={
  //             "_id":data._id,
  //             "email":data.email,
  //             "name":data.name,
  //             "walletMoney":data.walletMoney
  //           }
  //       let responseData = {user: user, tokens : token }
  //       res.status(201)
  //       res.send(responseData)
  //     }
  // }catch(err){
  //   console.log(err.message)
  // }


  const User=await userService.createUser(req.body)
    const token=await tokenService.generateAuthTokens(User)
    const user={
      "_id":User._id,
      "email":User.email,
      "name":User.name,
      "walletMoney":User.walletMoney
    }

   return res.status(httpStatus.CREATED).json({"user":user,"tokens":token})
});

/**
 * Perform the following steps:
 * -  Call the authservice to verify is password and email is valid
 * -  Generate auth tokens
 * -  Send back
 * --- "200 OK" status code
 * --- response in the given format
 *
 * Example response:
 *
 * {
 *  "user": {
 *      "_id": "5f71b31888ba6b128ba16205",
 *      "name": "crio-user",
 *      "email": "crio-user@gmail.com",
 *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
 *      "createdAt": "2020-09-28T09:55:36.358Z",
 *      "updatedAt": "2020-09-28T09:55:36.358Z",
 *      "__v": 0
 *  },
 *  "tokens": {
 *      "access": {
 *          "token": "eyJhbGciOiJIUz....",
 *          "expires": "2020-10-22T09:29:01.745Z"
 *      }
 *  }
 *}
 *
 */
const login = catchAsync(async (req, res) => {
//   try{
//     console.log("authController - login() ")
//     let data = await authService.loginUserWithEmailAndPassword(req.body.email, req.body.password)
//     if(data.statusCode===401){
//       // res.status(httpStatus.UNAUTHORIZED).send("Incorrect email or password")
//       res.status(httpStatus.UNAUTHORIZED).send({code: httpStatus.UNAUTHORIZED, message : "Incorrect email or password"})
//     } else{

//       let token = await tokenService.generateAuthTokens(data)
//       user={
//           "_id":data._id,
//           "name":data.name,
//           "email":data.email,
//           "walletMoney":data.walletMoney
//             }
//       let responseData = {user: user, tokens : token }
//       res.status(httpStatus.OK)
//       res.send(responseData)
//     }
// }catch(err){
//   console.log(err.message)
//   return res.status(err.statusCode).json({"code":err.statusCode,"message":err.message})
// }



let user,tokenData,object
  try{
    user=await authService.loginUserWithEmailAndPassword(req.body.email,req.body.password)
  }catch(err){
    console.log("authController error : ",err.message)
    return res.status(err.statusCode).json({"code":err.statusCode,"message":err.message})
  }
  if(user){
    tokenData=await tokenService.generateAuthTokens(user)
  object={
  "_id":user._id,
  "name":user.name,
  "email":user.email,
  "walletMoney":user.walletMoney
    }
  }
  return res.status(httpStatus.OK).json({"user":object,"tokens":tokenData})
});

module.exports = {
  register,
  login,
};
