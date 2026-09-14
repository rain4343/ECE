import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { sql, eq } from "drizzle-orm";
import { users, userSiteAssignments } from "../../../src/db/schema";
import { DatabaseService } from "../database.service";
import { actorFromRequest } from "./actor";
import {
  clearSessionCookie,
  createSession,
  hashPassword,
  sessionCookie,
  verifyPassword,
} from "./session";
import { IsString, MinLength } from "class-validator";

class LoginDto {
  @IsString()
  username!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly database: DatabaseService) {}

  @Post("login")
  @HttpCode(204)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    if (!this.database.isConfigured()) {
      throw new ServiceUnavailableException("DATABASE_URL is not set");
    }
    const [user] = await this.database.client
      .select()
      .from(users)
      .where(sql`lower(${users.email}) = lower(${dto.username})`)
      .limit(1);
    if (!user || !user.isActive || !verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const assignments = await this.database.client
      .select({ kindergartenId: userSiteAssignments.kindergartenId })
      .from(userSiteAssignments)
      .where(eq(userSiteAssignments.userId, user.id));
    const secure = process.env.NODE_ENV === "production";
    response.setHeader(
      "Set-Cookie",
      sessionCookie(
        createSession({
          sub: user.id,
          role: user.role,
          homeKindergartenId: user.kindergartenId,
          assignedKindergartenIds: assignments.map((row) => row.kindergartenId),
          educationDirectorateId: user.educationDirectorateId,
        }),
        secure,
      ),
    );
  }

  @Post("logout")
  @HttpCode(204)
  logout(@Res({ passthrough: true }) response: Response) {
    response.setHeader("Set-Cookie", clearSessionCookie(process.env.NODE_ENV === "production"));
  }

  @Get("me")
  me(@Req() request: Request) {
    const actor = actorFromRequest(request);
    if (!actor) throw new UnauthorizedException();
    return actor;
  }

  static hash(password: string) {
    return hashPassword(password);
  }
}
