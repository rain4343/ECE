import "reflect-metadata";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

function loadEnvironment() {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "..", ".env"),
    path.resolve(__dirname, "../../../../.env"),
  ];
  const envPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (envPath) {
    dotenv.config({ path: envPath });
  }
}

loadEnvironment();

async function bootstrap() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required. Create .env from .env.example.");
  }
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters");
  }
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(Number(process.env.API_PORT ?? 4000));
}

void bootstrap();
