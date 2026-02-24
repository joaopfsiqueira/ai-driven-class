import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET ?? "mvp-secret-change-in-production";
const PORT = parseInt(process.env.PORT ?? "3001", 10);

export const config = {
  JWT_SECRET,
  PORT,
};
