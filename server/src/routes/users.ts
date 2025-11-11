import express from "express";

import { authenticateOwnerOrAdmin } from "../middleware/auth";
import { restrictedCors } from "../middleware/cors";
import { AuthenticateRequest } from "../types/users";
import { asyncHandler } from "../utils/asyncHandler";

import { ForbiddenError, UserNotFoundError } from "../constants/errors";
import { userGetByIdSchema } from "../validations/users";
import { deleteUser, findUserById, getUsersPaginated } from "../models/users";
import { searchQueryProps } from "../validations/sites";

const router = express.Router();

router.get(
  "/",
  restrictedCors,
  authenticateOwnerOrAdmin,
  asyncHandler(async (req: AuthenticateRequest, res: express.Response) => {
    if (req.user?.is_admin !== true) {
      throw new ForbiddenError();
    }

    const parsed = searchQueryProps.parse({
      limit: Number(req.query.limit ?? 10),
      offset: Number(req.query.offset ?? 0),
      searchText: String(req.query.searchText ?? ""),
    });

    const sites = await getUsersPaginated(parsed);
    res.status(200).json(sites);
  })
);

router.delete(
  "/:user_id",
  restrictedCors,
  authenticateOwnerOrAdmin,
  asyncHandler(async (req: AuthenticateRequest, res: express.Response) => {
    const parsed = userGetByIdSchema.parse(req.params);

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
