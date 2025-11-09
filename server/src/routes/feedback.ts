import express from "express";

import { authenticateOwnerOrAdmin, optionalAuth } from "../middleware/auth";
import { publicCors, restrictedCors } from "../middleware/cors";
import { AuthenticateRequest } from "../types/users";
import { asyncHandler } from "../utils/asyncHandler";
import { FeedbackNotFoundError, ForbiddenError } from "../constants/errors";

import {
  feedbackGetByIdSchema,
  feedbackCreateSchema,
  feedbackUpdateSchema,
  feedbackSearchQueryProps,
} from "../validations/feedback";

import {
  createFeedback,
  deleteFeedback,
  findFeedbackById,
  findFeedbackOwnerId,
  getFeedbackPaginated,
  updateFeedback,
} from "../models/feedback";

const router = express.Router();

router.get(
  "/",
  publicCors,
  optionalAuth,
  asyncHandler(async (req: AuthenticateRequest, res: express.Response) => {
    const parsed = feedbackSearchQueryProps.parse({
      limit: Number(req.query.limit ?? 10),
      offset: Number(req.query.offset ?? 0),
      search: String(req.query.searchText ?? ""),
      site_id: req.query.site_id,
      is_admin: req.user?.is_admin || false,
    });

    const feedbacks = await getFeedbackPaginated(parsed);
    res.status(200).json(feedbacks);
  })
);

router.get(
  "/:feedback_id",
  publicCors,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const parsed = feedbackGetByIdSchema.parse(req.params);

    const feedback = await findFeedbackById(parsed.feedback_id);
    if (!feedback) throw new FeedbackNotFoundError(parsed.feedback_id);

    res.status(200).json(feedback);
  })
);

router.post(
  "/",
  publicCors,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const result = feedbackCreateSchema.parse(req.body);
    const createdFeedback = await createFeedback(result);
    res.status(201).json(createdFeedback);
  })
);

router.put(
  "/:feedback_id",
  restrictedCors,
  authenticateOwnerOrAdmin,
  asyncHandler(async (req: AuthenticateRequest, res: express.Response) => {
    const { feedback_id } = req.params;
    const { comment, feedback_public } = req.body;

    const result = feedbackUpdateSchema.parse({
      feedback_id,
      comment,
      public: feedback_public,
    });

    const feedbackDetail = await findFeedbackOwnerId(result.feedback_id);
    if (!feedbackDetail) throw new FeedbackNotFoundError(result.feedback_id);

    const isOwnerOrAdmin =
      req.user &&
      (req.user.user_id === feedbackDetail.owner_id || req.user.is_admin);

    if (!isOwnerOrAdmin) throw new ForbiddenError();

    const updatedFeedback = await updateFeedback(result);
    res.status(200).json(updatedFeedback);
  })
);

router.delete(
  "/:feedback_id",
  restrictedCors,
  authenticateOwnerOrAdmin,
  asyncHandler(async (req: AuthenticateRequest, res: express.Response) => {
    const parsed = feedbackGetByIdSchema.parse(req.params);

    const feedbackDetail = await findFeedbackOwnerId(parsed.feedback_id);
    if (!feedbackDetail) throw new FeedbackNotFoundError(parsed.feedback_id);

    const isOwnerOrAdmin =
      req.user &&
      (req.user.user_id === feedbackDetail.owner_id || req.user.is_admin);

    if (!isOwnerOrAdmin) throw new ForbiddenError();

    const deletedFeedback = await deleteFeedback({
      feedback_id: feedbackDetail.feedback_id,
      site_id: feedbackDetail.site_id,
    });

    if (!deletedFeedback)
      throw new FeedbackNotFoundError(feedbackDetail.feedback_id);

    res.status(200).json(deletedFeedback);
  })
);

export default router;
