import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // console.log(req.headers.authorization)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1] // Cutting out Bearer
      const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decodeToken.id).select('-password') // minus password
      next()
    } catch(err) {
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

const isAdmin = (req, res, next) => {
  // Check is user exists AND that user is an ADMIN
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

export {
  protect,
  isAdmin
}