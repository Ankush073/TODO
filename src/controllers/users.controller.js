import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
// Helper function to generate access and refresh tokens
const generateAccessAndRefereshTokens = async (userId) => {
    try {
        // Fetch user by ID
        const user = await User.findById(userId);

        // Generate access and refresh tokens for the user
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Store refresh token in the user's record
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Return the generated tokens
        return { accessToken, refreshToken };

    } catch (error) {
        // Handle any errors that occur during token generation
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    // Extract user details from the request body
    const { fullName, email, password, username } = req.body;
    console.log("Email:", email);

    // Validate that all required fields are provided
    if ([email, fullName, password, username].some(field => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if the user already exists by email or username
    const existingUser = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
    });
    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    // Create the new user in the database
    const user = await User.create({
        fullName,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password,
    });

    // Fetch the created user, excluding sensitive data (password and refreshToken)
    const createdUser = await User.findById(user.id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Return a successful response with the created user
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

// Log a user in
const loginUser = asyncHandler(async (req, res) => {
    // Extract credentials from request body
    const { email, username, password } = req.body;
    console.log(email);

    // Ensure that at least one credential (email or username) is provided
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    // Look for the user by either username or email
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    // If the user is not found, return an error
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Validate the provided password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Generate access and refresh tokens for the logged-in user
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    // Fetch user details excluding sensitive data (password and refreshToken)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Set cookie options for secure HTTP-only cookies
    const options = {
        httpOnly: true,
        secure: true
    };

    // Send the response with cookies and user data
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        );
});

// Log the user out by clearing cookies and removing the refresh token
const logoutUser = asyncHandler(async (req, res) => {
    try {
        // Ensure the user is authenticated
        if (!(req.user || req.user._id)) {
            throw new ApiError(400, "User is not authenticated");
        }

        // Log the user ID for debugging purposes
        console.log("Logging out user with ID:", req.user._id);

        // Update the user document to remove the refreshToken
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: { refreshToken: 1 } // This removes the refreshToken field
            },
            { new: true }
        );

        // Set cookie options for secure cookie clearing
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        };

        // Clear the accessToken and refreshToken cookies
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged out successfully"));
    } catch (error) {
        console.error("Error during logout:", error);
        // Handle any errors that occur during logout
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        return res.status(500).json(new ApiResponse(500, null, "An error occurred during logout"));
    }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};
