import express from "express";
import { DatabaseError } from "pg";

import { authenticateOwnerOrAdmin, optionalAuth } from "../middleware/auth";
import { publicCors, restrictedCors } from "../middleware/cors";
import { AuthenticateRequest } from "../types/users";
import { asyncHandler } from "../utils/asyncHandler";

import MESSAGES from "../constants/messages";

import {
  SiteNotFoundError,
  ForbiddenError,
  InvalidSiteDataError,
} from "../constants/errors";

import {
  siteUpdateInputSchema,
  siteCreateSchema,
  searchQueryProps,
  siteGetByIdSchema,
} from "../validations/sites";

import {
  getSitesPaginated,
  findSiteById,
  createSite,
  updateSite,
  deleteSite,
} from "../models/sites";

const router = express.Router();

router.get(
  "/",
  publicCors,
  optionalAuth,
  asyncHandler(async (req: AuthenticateRequest, res: express.Response) => {
    // console.log("Is Admin: ", req.user?.is_admin === true);
    // if (!req.user) {
    //   console.log("SITES: NOO USER");
    // }
    //await new Promise((resolve) => setTimeout(resolve, 5000));

    const parsed = searchQueryProps.parse({
      limit: Number(req.query.limit ?? 10),
      offset: Number(req.query.offset ?? 0),
      searchText: String(req.query.searchText ?? ""),
      is_admin: req.user?.is_admin ?? false,
    });

    const sites = await getSitesPaginated(parsed);
    res.status(200).json(sites);
  })
);

router.get(
  "/:site_id",
  publicCors,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const parsed = siteGetByIdSchema.parse(req.params);

    const site = await findSiteById(parsed.site_id);
    if (!site) {
      throw new SiteNotFoundError(parsed.site_id);
    }

    res.status(200).json(site);
  })
);

router.post(
  "/",
  restrictedCors,
  authenticateOwnerOrAdmin,
  asyncHandler(async (req: AuthenticateRequest, res: express.Response) => {
    const owner_id = req.user!.user_id;

    const parsed = siteCreateSchema.parse({ ...req.body, owner_id });

    try {
      const createdSite = await createSite(parsed);
      res.status(201).send(createdSite);
    } catch (error: unknown) {
      if ((error as DatabaseError).code === "23505") {
        throw new InvalidSiteDataError(MESSAGES.ERROR_SITE_NAME_ALREADY_EXITS);
      }
      throw error;
    }
  })
);

router.put(
  "/:site_id",
  restrictedCors,
  authenticateOwnerOrAdmin,
  asyncHandler(async (req: AuthenticateRequest, res: express.Response) => {
    const parsed = siteUpdateInputSchema.parse({
      ...req.body,
      site_id: req.params.site_id,
    });

    const existingSite = await findSiteById(parsed.site_id);
    if (!existingSite) throw new SiteNotFoundError(parsed.site_id);

    const isOwnerOrAdmin =
      req.user &&
      (req.user.user_id === existingSite.owner_id || req.user.is_admin);

    if (!isOwnerOrAdmin) throw new ForbiddenError();

    const updatedSite = await updateSite(parsed);
    if (!updatedSite) throw new SiteNotFoundError(parsed.site_id);

    res.status(200).send(updatedSite);
  })
);

router.delete(
  "/:site_id",
  restrictedCors,
  authenticateOwnerOrAdmin,
  asyncHandler(async (req: AuthenticateRequest, res: express.Response) => {
    const parsed = siteGetByIdSchema.parse(req.params);

    const existingSite = await findSiteById(parsed.site_id);
    if (!existingSite) throw new SiteNotFoundError(parsed.site_id);

    const isOwnerOrAdmin =
      req.user &&
      (req.user.user_id === existingSite.owner_id || req.user.is_admin);

    if (!isOwnerOrAdmin) throw new ForbiddenError();

    const deletedSite = await deleteSite(parsed.site_id);

    if (!deletedSite) throw new SiteNotFoundError(parsed.site_id);

    res.status(200).send(deletedSite);
  })
);

export default router;
