import express from "express";

import { authenticateOwnerOrAdmin } from "../middleware/auth";
import { restrictedCors } from "../middleware/cors";
import { AuthenticateRequest, UserPayload } from "../types/users";
import { asyncHandler } from "../utils/asyncHandler";

import { ForbiddenError, UserNotFoundError } from "../constants/errors";
import { userGetByIdSchema } from "../validations/users";
import { executeQuery } from "../models/db";
import { deleteUser } from "../models/users";

const router = express.Router();

export const findUserById = async (id: string) => {
  const query = `SELECT 
                    user_id, 
                    name,
                    email,
                    picture,
                    is_admin
                  FROM users WHERE user_id=$1::uuid`;
  const parameters = [id];

  const result = await executeQuery(query, parameters);
  return result.rows.length > 0 ? (result.rows[0] as UserPayload) : null;
};

router.delete(
  "/:user_id",
  restrictedCors,
  authenticateOwnerOrAdmin,
  asyncHandler(async (req: AuthenticateRequest, res: express.Response) => {
    const parsed = userGetByIdSchema.parse(req.params);
    console.log(parsed.user_id);
    const existingUser = await findUserById(parsed.user_id);
    if (!existingUser) throw new UserNotFoundError(parsed.user_id);

    const isOwnerOrAdmin =
      req.user &&
      (req.user.user_id === existingUser.user_id || req.user.is_admin);

    if (!isOwnerOrAdmin) throw new ForbiddenError();

    const deletedSite = await deleteUser(parsed.user_id);

    if (!deletedSite) throw new UserNotFoundError(parsed.user_id);

    const COOKIE_NAME = process.env.COOKIE_NAME!;
    res.clearCookie(COOKIE_NAME, { httpOnly: true });

    res.status(200).send(deletedSite);
  })
);

export default router;
