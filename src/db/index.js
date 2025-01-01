import mongoose from "mongoose"; // Import mongoose library to interact with MongoDB
import {DB_NAME} from "../constants.js"// Import database name constant

/**
 * Connects to the MongoDB database asynchronously.
 * The connection string is constructed using the MONGODB_URL from environment variables
 * and the DB_NAME constant.
 */
const connectDB = async () => {
    try {
        // Attempt to establish a connection to the MongoDB database
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        
        // Log a successful connection, including the host of the connection instance
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        // Log the error if the connection fails and exit the process with a failure code
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

// Export the connectDB function for use in other modules
export default connectDB;
