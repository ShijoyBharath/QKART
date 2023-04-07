const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const config = require("../config/config");
const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUser() function
/**
 * Get user details
 *  - Use service layer to get User data
 * 
 *  - If query param, "q" equals "address", return only the address field of the user
 *  - Else,
 *  - Return the whole user object fetched from Mongo

 *  - If data exists for the provided "userId", return 200 status code and the object
 *  - If data doesn't exist, throw an error using `ApiError` class
 *    - Status code should be "404 NOT FOUND"
 *    - Error message, "User not found"
 *  - If the user whose token is provided and user whose data to be fetched don't match, throw `ApiError`
 *    - Status code should be "403 FORBIDDEN"
 *    - Error message, "User not found"
 *
 * 
 * Request url - <workspace-ip>:8082/v1/users/6010008e6c3477697e8eaba3
 * Response - 
 * {
 *     "walletMoney": 500,
 *     "address": "ADDRESS_NOT_SET",
 *     "_id": "6010008e6c3477697e8eaba3",
 *     "name": "crio-users",
 *     "email": "crio-user@gmail.com",
 *     "password": "criouser123",
 *     "createdAt": "2021-01-26T11:44:14.544Z",
 *     "updatedAt": "2021-01-26T11:44:14.544Z",
 *     "__v": 0
 * }
 * 
 * Request url - <workspace-ip>:8082/v1/users/6010008e6c3477697e8eaba3?q=address
 * Response - 
 * {
 *   "address": "ADDRESS_NOT_SET"
 * }
 * 
 *
 * Example response status codes:
 * HTTP 200 - If request successfully completes
 * HTTP 403 - If request data doesn't match that of authenticated user
 * HTTP 404 - If user entity not found in DB
 * 
 * @returns {User | {address: String}}
 *
 */
const getUser = catchAsync(async (req, res) => {
  // try{
  //   console.log("getUser req.params.id ", req.params.userId)
  //   console.log("getUser Controller req.headers.authorization : ", req.headers.authorization)
  //   if(req.headers.authorization===undefined){
  //     res.status(httpStatus.UNAUTHORIZED).send({code: httpStatus.UNAUTHORIZED, message: "No authorization header"})
  //   }
  //   else{
  //     console.log("getUser Controller req.headers.authorization token value : ", req.headers.authorization.split(' ')[1])
  //     // let decoded = jwt.verify(req.headers.authorization.split(' ')[1], config.jwt.secret);
  //     try {
  //       var decoded = jwt.verify(req.headers.authorization.split(' ')[1], config.jwt.secret);
  //       console.log("getUser controller - decoded token : ", decoded)
  //       if(decoded.sub===req.params.userId){

  //             var data =await userService.getUserById(req.params.userId)
      
  //             if(data.length===0){
  //               res.status(httpStatus.NOT_FOUND).send({code: httpStatus.NOT_FOUND, message: "User not found"})
  //             }else {
  //               res.status(200)
  //               res.send(data)
  //             }
  //       }else{

  //       res.status(httpStatus.FORBIDDEN).send({code: httpStatus.FORBIDDEN, message: "Authorization header does not match"})
  //       }
  //     } catch(err) {
  //       // err
  //       res.status(httpStatus.FORBIDDEN).send({code: httpStatus.FORBIDDEN, message: "Authorization header does not match"})
  //     }

  //   }
    
  // }catch(err){
  //   console.log("Error getUser Controller : ",err.message)
  //   res.status(httpStatus.NOT_FOUND)
  //   res.send(new ApiError(statusCode="404 NOT FOUND",message="User not found"))
  // }



  const id=req.params.id;
    const address=req.query.q
    if(address){
      const d=await userService.getUserAddressById(id)
      const add={
        "address":d.address
      }
      return res.status(200).json(add)
    }  
    let user
    if(id){
      try{
        user=await userService.getUserById(id)
      }catch(err){
        throw new ApiError(400,err.message)
      }
      if(user){

        const obj={
          _id:user._id.toString(),
          email:user.email,
          name:user.name,
          walletMoney:user.walletMoney
        }
        return res.status(200).json(obj)
      }else{
        throw new ApiError(httpStatus.NOT_FOUND,"User not found")
      }
    }else{
      // const email=req.query.email
      try{
        user=await userService.getUserById(id)
      }catch(err){
        throw new ApiError(httpStatus.NOT_FOUND,err.message)
      }
      if(user){
        const obj={
          _id:user._id.toString(),
          email:user.email,
          name:user.name,
          walletMoney:user.walletMoney
        }
        return res.status(200).json(obj)
      }else{
        throw new ApiError(httpStatus.NOT_FOUND,"User not found")
      }
    }
});


const setAddress = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.email != req.user.email) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "User not authorized to access this resource"
    );
  }

  const address = await userService.setAddress(user, req.body.address);

  res.status(200).send({
    address: address,
  });
});


module.exports = {
  getUser,setAddress
};
