import dotenv from "dotenv"

dotenv.config(
    {
        override: true,
        path:"./src/.env"
    }
)

export const config={
    PORT:process.env.PORT,
    SECRET:process.env.SECRET,
    MONGO_URL:process.env.MONGO_URL,
    DB_NAME:process.env.DB_NAME,
    PERSISTENCE:process.env.PERSISTENCE||"MONGO"
}