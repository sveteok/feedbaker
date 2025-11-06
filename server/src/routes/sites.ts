import express from "express";
import { z } from "zod";
import { DatabaseError } from 'pg';

import MESSAGES from "../constants/messages";
import {
  SiteNotFoundError,
  InvalidSiteIdError,
  ForbiddenError,
} from "../constants/errors";

import {
  getSitesPaginated,
  findSiteById,
  createSite,
  updateSite,
  deleteSite,
} from "../models/sites";

import { authenticateOwnerOrAdmin, optionalAuth } from "../middleware/auth";

import {
  siteUpdateInputSchema,
  siteCreateSchema,
  searchQueryProps,
  siteGetByIdSchema,
} from "../validations/sites";
import { AuthenticateRequest } from "../types/users";

const router = express.Router();

router.get(
  "/",
  optionalAuth,
  async (req: AuthenticateRequest, res: express.Response) => {
    try {
      const { searchText = "", limit = 10, offset = 0 } = req.query;

      console.log("Is Admin: ",req.user?.is_admin === true);
      if (!req.user) {
        console.log("SITES: NOO USER");
      }
      //await new Promise((resolve) => setTimeout(resolve, 5000));

      const parsed = searchQueryProps.safeParse({
        limit: Number(limit),
        offset: Number(offset),
        searchText: String(searchText),
        is_admin: req.user?.is_admin || false,
      });

      if (!parsed.success) {
        console.error(z.treeifyError(parsed.error));
        return res.status(400).json({ error: MESSAGES.INVALID_SITE_DATA });
      }

      const sites = await getSitesPaginated(parsed.data);
      res.status(200).json(sites);
    } catch (error) {
      console.error(`${MESSAGES.ERROR_FETCHING_SITES}:`, error);
      res.status(500).send({ error: MESSAGES.DATABASE_ERROR });
    }
  }
);

router.get("/:site_id", async (req: express.Request, res: express.Response) => {
  try {
    const parsed = siteGetByIdSchema.safeParse(req.params);

    if (!parsed.success) {
      console.error(z.treeifyError(parsed.error));
      return res.status(400).json({ error: MESSAGES.INVALID_SITE_DATA });
    }

    const { site_id } = parsed.data;
    const site = await findSiteById(site_id);
    if (!site) {
      throw new SiteNotFoundError(site_id);
    }

    res.status(200).json(site);
  } catch (error) {
    if (error instanceof SiteNotFoundError) {
      res.status(404).send({ error: error.message });
      return;
    }
    if (error instanceof InvalidSiteIdError) {
      res.status(400).send({ error: error.message });
      return;
    }
    console.error(`${MESSAGES.ERROR_FETCHING_SITES}`, error);
    res.status(500).send({ error: MESSAGES.INTERNAL_SERVER_ERROR });
  }
});

router.post(
  "/",
  authenticateOwnerOrAdmin,
  async (req: AuthenticateRequest, res: express.Response) => {
    try {
      const owner_id = req.user!.user_id;

      const parsed = siteCreateSchema.safeParse({ ...req.body, owner_id });
      if (!parsed.success) {
        console.error(z.treeifyError(parsed.error));
        return res.status(400).json({ error: MESSAGES.INVALID_SITE_DATA });
      }

      const createdSite = await createSite({
        name: parsed.data.name,
        url: parsed.data.url,
        description: parsed.data.description,
        owner_id,
      });

      res.status(201).send(createdSite);
    } catch (err: unknown) {
      const error = err as DatabaseError;
      if (error.code === "23505") {
        return res.status(409).json({ error: MESSAGES.ERROR_SITE_NAME_ALREADY_EXITS });
      }

      console.error(`${MESSAGES.ERROR_CREATING_SITE}:`, error);
      res.status(500).send({ error: MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
);

router.put(
  "/:site_id",
  authenticateOwnerOrAdmin,
  async (req: AuthenticateRequest, res: express.Response) => {
    try {
      const parsed = siteUpdateInputSchema.safeParse({
        ...req.body,
        site_id: req.params.site_id,
      });
      if (!parsed.success) {
        console.error(z.treeifyError(parsed.error));
        return res.status(400).json({ error: MESSAGES.INVALID_SITE_DATA });
      }

      const { site_id } = parsed.data;
      const existingSite = await findSiteById(site_id);
      if (existingSite === null) {
        throw new SiteNotFoundError(site_id);
      }

      const ownerId = existingSite.owner_id;
      if (
        req.user === undefined ||
        (req.user.user_id !== ownerId && !req.user.is_admin)
      ) {
        throw new ForbiddenError();
      }

      const updatedProduct = await updateSite(parsed.data);
      if (updatedProduct === null) {
        throw new SiteNotFoundError(site_id);
      }

      res.status(200).send(updatedProduct);
    } catch (error) {
      if (error instanceof SiteNotFoundError) {
        res.status(404).send({ error: error.message });
        return;
      }
      if (error instanceof ForbiddenError) {
        res.status(403).json({ error: error.message });
        return;
      }
      console.error(`${MESSAGES.ERROR_UPDATING_SITE}:`, error);
      res.status(500).send({ error: MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
);

router.delete(
  "/:site_id",
  authenticateOwnerOrAdmin,
  async (req: AuthenticateRequest, res: express.Response) => {
    try {
      const parsed = siteGetByIdSchema.safeParse(req.params);

      if (!parsed.success) {
        console.error(z.treeifyError(parsed.error));
        return res.status(400).json({ error: MESSAGES.INVALID_SITE_DATA });
      }

      const { site_id } = parsed.data;
      const existingSite = await findSiteById(site_id);
      if (existingSite === null) {
        throw new SiteNotFoundError(site_id);
      }

      const ownerId = existingSite.owner_id;
      if (
        req.user === undefined ||
        (req.user.user_id !== ownerId && !req.user.is_admin)
      ) {
        throw new ForbiddenError();
      }

      const deletedSite = await deleteSite(site_id);

      if (deletedSite === null) {
        throw new SiteNotFoundError(site_id);
      }

      res.status(200).send(deletedSite);
    } catch (error) {
      if (error instanceof SiteNotFoundError) {
        res.status(404).send({ error: error.message });
        return;
      }
      if (error instanceof ForbiddenError) {
        res.status(403).json({ error: error.message });
        return;
      }
      if (error instanceof InvalidSiteIdError || error instanceof Error) {
        res.status(400).send({ error: error.message });
        return;
      }
      console.error(`${MESSAGES.ERROR_DELETING_SITE}:`, error);
      res.status(500).send({ error: MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
);

export default router;
