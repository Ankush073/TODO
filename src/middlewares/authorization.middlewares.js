import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.models.js";

// Middleware to verify JWT (JSON Web Token) for authentication
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Retrieve the token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        // If no token is found, return unauthorized error
        if (!token) {
            throw new ApiError(401, "Unauthorized request"); // Custom error handling
        }

        // Verify the token using the secret stored in environment variables
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // If the token is invalid or expired, the decoding will fail, so check for this
        // The decoded token should contain the user's _id (subject) information
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken"); // Exclude password and refreshToken fields for security

        // If no user is found matching the decoded ID, it's an invalid token
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Attach the user object to the request for further use in other route handlers
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Catch any errors that occur during token verification or user fetching
        // Throw a customized ApiError with the message or a generic "Invalid access token" message
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
