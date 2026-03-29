import "express-async-errors"

import cors from "cors"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

import { prisma } from "./config/database"
import { env } from "./config/env"
import { redis } from "./config/redis"
import { errorHandler, notFoundHandler } from "./middleware/errorHandler"
import { appointmentsRouter } from "./modules/appointments/appointments.router"
import { authRouter } from "./modules/auth/auth.router"
import { analyticsRouter } from "./modules/analytics/analytics.router"
import { noShowRouter } from "./modules/noshow/noshow.router"
import { notificationsRouter } from "./modules/notifications/notifications.router"
import { startNotificationScheduler } from "./modules/notifications/scheduler"
import { patientsRouter } from "./modules/patients/patients.router"
import { timelineRouter } from "./modules/timeline/timeline.router"

const app = express()

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  })
)
app.use(helmet())
app.use(express.json({ limit: "1mb" }))
app.use(morgan("dev"))

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NimittHIS API",
      version: "1.0.0",
      description: "Hospital appointment tracking system API"
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api`
      }
    ]
  },
  apis: []
})

app.get("/health", async (_request, response) => {
  await prisma.$queryRaw`SELECT 1`
  await redis.ping()

  response.json({
    data: {
      status: "ok",
      timestamp: new Date().toISOString()
    }
  })
})

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use("/api/auth", authRouter)
app.use("/api/patients", patientsRouter)
app.use("/api/appointments", appointmentsRouter)
app.use("/api/timeline", timelineRouter)
app.use("/api/noshow", noShowRouter)
app.use("/api/analytics", analyticsRouter)
app.use("/api/notifications", notificationsRouter)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(env.PORT, () => {
  startNotificationScheduler()
  console.log(`NimittHIS backend running on http://localhost:${env.PORT}`)
})
