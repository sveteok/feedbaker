import { executeQuery, QueryBuilder } from "./db";
import {
  FeedbackUpdateFormData,
  FeedbackAddFormData,
  FeedbackSearchQueryProps,
  FeedbackDeleteFormData,
  SummarizeFeedbackProps,
  FeedbackSummarizeUpdateData,
} from "../validations/feedback";
import {
  Feedback,
  FeedbackOwnerDetail,
  FeedbackSummarize,
  PaginatedFeedback,
} from "../types/feedback";

export const getFeedbackPaginated = async (
  data: FeedbackSearchQueryProps
): Promise<PaginatedFeedback> => {
  const { site_id, is_admin, search, limit = 10, offset = 0, owner_id } = data;

  const qb = new QueryBuilder();
  qb.query = `SELECT 
                  f.feedback_id, 
                  f.author,
                  f.body, 
                  f.created_on,
                  f.updated_on,
                  f.comment,
                  f.public,
                  f.site_id,
                  s.owner_id as site_owner_id,
                  COUNT(*) OVER() AS total_count
                FROM feedback f
                JOIN sites s ON s.site_id = f.site_id `;

  const conditions: string[] = [];
  if (site_id) {
    conditions.push(`f.site_id = ${qb.addParam(site_id)}`);
  }

  conditions.push(
    ` (f.public IS TRUE OR (s.owner_id = ${qb.addParam(owner_id)} OR ${qb.addParam(is_admin)})) `
  );

  conditions.push(
    `f.body ILIKE '%' || ${qb.addParam(search || "")}::text || '%'`
  );

  if (conditions.length > 0) {
    qb.query += ` WHERE ${conditions.join(" AND ")} `;
  }

  qb.query += `
    ORDER BY f.created_on DESC, f.feedback_id 
    LIMIT ${qb.addParam(limit)}::int OFFSET ${qb.addParam(offset)}::int;
  `;

  const result = await executeQuery(qb.query, qb.params);
  const feedback: Feedback[] = result.rows;

  const totalCount =
    result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;

  return { feedback, totalCount };
};

export const findFeedbackById = async (
  feedback_id: string
): Promise<Feedback | null> => {
  const query = `SELECT 
                  feedback.feedback_id, 
                  feedback.author,
                  feedback.body, 
                  feedback.created_on,
                  feedback.updated_on,
                  feedback.comment,
                  feedback.public,
                  sites.name as site_name,
                  sites.url as site_url
                  FROM feedback 
                  JOIN sites ON sites.site_id = feedback.site_id
                  WHERE feedback.feedback_id=$1::uuid`;
  const parameters = [feedback_id];
  const result = await executeQuery(query, parameters);

  if (result.rows.length === 0) return null;
  return result.rows[0] as Feedback;
};

export const findFeedbackOwnerId = async (
  feedback_id: string
): Promise<FeedbackOwnerDetail | null> => {
  const query = `SELECT 
                  sites.owner_id, feedback.feedback_id, feedback.site_id  
                  FROM feedback 
                  JOIN sites ON sites.site_id = feedback.site_id
                  WHERE feedback_id=$1::uuid`;
  const parameters = [feedback_id];
  const result = await executeQuery(query, parameters);

  return result.rows.length > 0
    ? (result.rows[0] as FeedbackOwnerDetail)
    : null;
};

export const createFeedback = async ({
  site_id,
  author,
  body,
}: FeedbackAddFormData): Promise<Feedback> => {
  const query = `INSERT INTO feedback (site_id, author, body) 
                VALUES ($1::uuid, $2::text, $3::text) 
                RETURNING *`;
  const parameters = [site_id, author, body];
  const result = await executeQuery(query, parameters);
  return result.rows[0] as Feedback;
};

export const updateFeedback = async (
  data: FeedbackUpdateFormData
): Promise<Feedback> => {
  const query = `UPDATE feedback SET comment=$1::text, updated_on=now(), public=$2::boolean
                  WHERE feedback_id=$3::uuid
                  RETURNING *`;
  const parameters = [data.comment, data.public, data.feedback_id];
  const result = await executeQuery(query, parameters);
  return result.rows[0] as Feedback;
};

export const deleteFeedback = async ({
  feedback_id,
  site_id,
}: FeedbackDeleteFormData): Promise<Feedback | null> => {
  const query = `DELETE FROM feedback 
                    WHERE feedback_id=$1::uuid AND site_id=$2::uuid 
                    RETURNING *`;
  const parameters = [feedback_id, site_id];
  const result = await executeQuery(query, parameters);

  return result.rows.length > 0 ? (result.rows[0] as Feedback) : null;
};

export const getFeedbackSummarizeInProgress = async (
  site_id: string
): Promise<FeedbackSummarize | null> => {
  const query = `SELECT *
                  FROM feedback_summary
                  WHERE site_id = $1
                    AND started_on > now() - interval '5 minutes';`;

  const parameters = [site_id];
  const result = await executeQuery(query, parameters);

  return result.rows.length > 0 ? (result.rows[0] as FeedbackSummarize) : null;
};

export const getFeedbackBody = async (
  data: SummarizeFeedbackProps
): Promise<{ body: string; feedback_id: string; site_id: string }[]> => {
  const { site_id, is_admin, owner_id } = data;

  const qb = new QueryBuilder();
  qb.query = `SELECT 
                  f.body,
                  f.feedback_id,
                  s.site_id
                FROM feedback f
                JOIN sites s ON s.site_id = f.site_id `;

  const conditions: string[] = [];
  if (site_id) {
    conditions.push(`f.site_id = ${qb.addParam(site_id)}`);
  }

  conditions.push(` f.public IS TRUE  `);

  if (!is_admin && owner_id) {
    conditions.push(`s.owner_id = ${qb.addParam(owner_id)}`);
  }

  if (conditions.length > 0) {
    qb.query += ` WHERE ${conditions.join(" AND ")} ;`;
  }

  const result = await executeQuery(qb.query, qb.params);

  return result.rows as {
    body: string;
    feedback_id: string;
    site_id: string;
  }[];
};

export const createFeedbackSummarize = async (
  site_id: string
): Promise<FeedbackSummarize> => {
  const query = `INSERT INTO feedback_summary (site_id, started_on)
                  VALUES($1::uuid, now())
                  ON CONFLICT(site_id)
                      DO UPDATE SET
                          started_on = now()
                  RETURNING *;`;
  const parameters = [site_id];
  const result = await executeQuery(query, parameters);
  return result.rows[0] as FeedbackSummarize;
};

export const updateFeedbackSummarize = async ({
  site_id,
  summary,
  error,
}: FeedbackSummarizeUpdateData) => {
  const query = `UPDATE feedback_summary
                    SET 
                      summary = CASE
                                  WHEN $1::text IS NULL THEN NULL
                                  ELSE COALESCE($1::text, summary)
                                END,
                      error = CASE
                              WHEN $2::text IS NULL THEN NULL
                              ELSE COALESCE($2::text, error)
                            END,
                      updated_on = now()
                    WHERE site_id = $3
                    RETURNING *;
                    `;

  const result = await executeQuery(query, [summary, error, site_id]);

  return result.rows[0] as FeedbackSummarize;
};
