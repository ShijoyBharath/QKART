const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserById(id)
/**
 * Get User by id
 * - Fetch user object from Mongo using the "_id" field and return user object
 * @param {String} id
 * @returns {Promise<User>}
 */
// async function getUserById(id){
//     // try{
//     //     console.log("getUserById service id : ", id)
//     //     // req.headers.authorization.split(' ')[0] === 'Bearer'
//     //     let res = await User.findById({_id: id})
//     //     console.log("getUserById  service data : ", res)
//     //     return res
          
//     // }catch(err){
//     //     console.log("Error getUserById service : ",err.message)
//     //     // return res
//     // }


//     const user=await User.findOne({"_id":id})

//     if(user){
//         return user
//     }
//     return null
//  }

const getUserById=async (id)=>{
    console.log("getUserById - id, user : ", id, User)
    const user=await User.findById({_id:id})

    if(user){
        return user
    }
    return null
}




// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserByEmail(email)
/**
 * Get user by email
 * - Fetch user object from Mongo using the "email" field and return user object
 * @param {string} email
 * @returns {Promise<User>}
 */
//  async function getUserByEmail(email){
//     // try{
//     //         let res = await User.findOne({email: email})
//     //         console.log("getUserByEmail : ", res)
//     //         return res
//     // }catch(err){
//     //     console.log("Error getUserByEmail service : ",err.message)
//     //     // return res
//     // }

//     const user=await User.findOne({"email":email})

//     if(user){
//         return user
//     }
//     return null

//  }
const getUserByEmail=async (email)=>{
    console.log("getUserByemail  email, user: ", email, User)
    const user=await User.findOne({email:email})

    if(user){
        return user
    }
    return null
}


// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement createUser(user)
/**
 * Create a user
 *  - check if the user with the email already exists using `User.isEmailTaken()` method
 *  - If so throw an error using the `ApiError` class. Pass two arguments to the constructor,
 *    1. “200 OK status code using `http-status` library
 *    2. An error message, “Email already taken”
 *  - Otherwise, create and return a new User object
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 * @throws {ApiError}
 *
 * userBody example:
 * {
 *  "name": "crio-users",
 *  "email": "crio-user@gmail.com",
 *  "password": "usersPasswordHashed"
 * }
 *
 * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
 */
//  async function createUser(user){
//     // try{
//     //     let res = await User.isEmailTaken(user.email)
//     //         if(res){
//     //             console.log("createUser - if(isEmailTaken) is true ")
//     //             // return(new ApiError(httpStatus.OK,"Email already taken"))
//     //             return false
                
//     //         }else {
//     //             // let x = new User(user)
//     //             // let data = await x.save()
//     //             let data = await User.create(user)
//     //             console.log("createUser saved : ", data)
//     //             return data
//     //         }
             
//     // }catch(err){
//     //     console.log("Error createUser service : ",err.message)
//     // throw new ApiError(httpStatus.OK,"Email already taken")
//     // }

//     const isTaken=await User.isEmailTaken(user.email)

//     if(isTaken){
//         throw new ApiError(200,"Email already taken")
//     }
    
//     const newUser=User.create(user)
    
//     return newUser
//  }
createUser=async (user)=>{

    const isTaken=await User.isEmailTaken(user.email)

    if(isTaken){
        throw new ApiError(200,"Email already taken")
    }
    
    const newUser=User.create(user)
    
    return newUser
}


const getUserAddressById = async (id) => {
    const user=await User.findOne({"_id":id},{"address":1,"email":1})
    return user
};



const setAddress = async (user, newAddress) => {
    user.address = newAddress;
    await user.save();
  
    return user.address;
  };
  

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,getUserAddressById,setAddress
}
