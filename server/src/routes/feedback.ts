import express from "express";

import {
  authenticateOwnerOrAdmin,
  optionalAuth,
  verifyCsrfToken,
} from "../middleware/auth";
import { restrictedCors } from "../middleware/cors";
import { AuthenticateRequest } from "../types/users";
import { asyncHandler } from "../utils/asyncHandler";
import { FeedbackNotFoundError, ForbiddenError } from "../constants/errors";
import { createRateLimiter } from "../middleware/rateLimit";

import {
  feedbackGetByIdSchema,
  feedbackCreateSchema,
  feedbackUpdateSchema,
  feedbackSearchQueryProps,
  summarizeFeedbackProps,
} from "../validations/feedback";

import {
  createFeedback,
  createFeedbackSummarize,
  deleteFeedback,
  findFeedbackById,
  findFeedbackOwnerId,
  getFeedbackBody,
  getFeedbackPaginated,
  getFeedbackSummarizeInProgress,
  updateFeedback,
} from "../models/feedback";
import { summarizeFeedback } from "../models/summarizeFeedback";

const router = express.Router();
const publicFeedbackRateLimit = createRateLimiter({
  maxRequests: 30,
  windowMs: 10 * 60 * 1000,
  message: "Too many feedback submissions. Try again later.",
  keyPrefix: "feedback-create",
});
const summarizeFeedbackRateLimit = createRateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000,
  message: "Too many summarize requests. Try again later.",
  keyPrefix: "feedback-summarize",
});

router.get(
  "/",
  restrictedCors,
  optionalAuth,
  asyncHandler(async (req: AuthenticateRequest, res: express.Response) => {
    const parsed = feedbackSearchQueryProps.parse({
      limit: Number(req.query.limit ?? 10),
      offset: Number(req.query.offset ?? 0),
      search: String(req.query.searchText ?? ""),
      site_id: req.query.site_id,
      is_admin: req.user?.is_admin || false,
      owner_id: req.user && req.user.user_id,
    });

    const feedbacks = await getFeedbackPaginated(parsed);
    res.status(200).json(feedbacks);
  })
);

router.post(
  "/summarize",
  restrictedCors,
  authenticateOwnerOrAdmin,
  verifyCsrfToken,
  summarizeFeedbackRateLimit,
  asyncHandler(async (req: AuthenticateRequest, res: express.Response) => {
    const parsed = summarizeFeedbackProps.parse({
      site_id: req.body.site_id,
      is_admin: req.user?.is_admin || false,
      owner_id: req.user && req.user.user_id,
    });

    const feedbackSummarizeInProgress = await getFeedbackSummarizeInProgress(
      parsed.site_id
    );

    if (feedbackSummarizeInProgress !== null) {
      res.status(200).json(feedbackSummarizeInProgress);
      return;
    }
    const feedbackSummarize = await createFeedbackSummarize(parsed.site_id);
    const feedback = await getFeedbackBody(parsed);
    summarizeFeedback(feedback, parsed.site_id);
    res.status(200).json(feedbackSummarize);
  })
);

router.get(
  "/:feedback_id",
  optionalAuth,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthenticateRequest;
    const parsed = feedbackGetByIdSchema.parse(req.params);

    const feedback = await findFeedbackById(parsed.feedback_id);
    if (!feedback) throw new FeedbackNotFoundError(parsed.feedback_id);

    const isOwnerOrAdmin =
      authReq.user &&
      (authReq.user.user_id === feedback.site_owner_id || authReq.user.is_admin);

    if (!feedback.public && !isOwnerOrAdmin) {
      throw new ForbiddenError();
    }

    res.status(200).json(feedback);
  })
);

router.post(
  "/",
  publicFeedbackRateLimit,
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
  verifyCsrfToken,
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
  verifyCsrfToken,
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
