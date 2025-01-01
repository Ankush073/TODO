import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import user_router from './routes/users.routes.js'
import task_router from './routes/tasks.routes.js'
const app =express();
app.use(cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true
  }))
  
  app.use(express.json({limit: "16kb"}))
  app.use(express.urlencoded({extended: true, limit: "16kb"}))
  app.use(express.static("public"))
  app.use(cookieParser())
  app.use("/api/v1/users",user_router)
  app.use("/api/v1/tasks",task_router)
export {app}