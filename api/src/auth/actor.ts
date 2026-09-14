import type { Request } from "express";
import type { AccessActor } from "../../../src/lib/rbac";
import type { AuthenticatedRequest } from "./roles.guard";
import { parseCookie, readSession, sessionCookieName } from "./session";

export function actorFromRequest(
  request: Request,
): (AccessActor & { id: string }) | undefined {
  const authed = request as AuthenticatedRequest;
  if (authed.user) {
    return authed.user;
  }

  const token = parseCookie(request.headers.cookie, sessionCookieName());
  const session = readSession(token);
  if (!session) return undefined;
  return {
    id: session.sub,
    role: session.role as AccessActor["role"],
    homeKindergartenId: session.homeKindergartenId,
    assignedKindergartenIds: session.assignedKindergartenIds,
    educationDirectorateId: session.educationDirectorateId,
  };
}
