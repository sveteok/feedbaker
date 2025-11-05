import { executeQuery, QueryBuilder } from "./db";
import {
  FeedbackUpdateFormData,
  FeedbackAddFormData,
  FeedbackSearchQueryProps,
  FeedbackDeleteFormData,
} from "../validations/feedback";
import { Feedback, PaginatedFeedback } from "../types/feedback";

export const getFeedbackPaginated = async (
  data: FeedbackSearchQueryProps
): Promise<PaginatedFeedback> => {
  const {
    site_id,
    is_admin,
    search: search = "",
    limit = 10,
    offset = 0,
    owner_id,
  } = data;
  console.log(data);

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
                  COUNT(*) OVER() AS total_count
                FROM feedback f`;

  if (site_id || owner_id) {
    qb.query += ` JOIN sites s ON s.site_id = f.site_id `;
  }

  const conditions: string[] = [];
  if (site_id) {
    conditions.push(`f.site_id = ${qb.addParam(site_id)}`);
  }
  if (!is_admin) {
    conditions.push(`f.public IS TRUE`);
  }
  if (owner_id) {
    conditions.push(`s.owner_id = ${qb.addParam(owner_id)}`);
  }

  conditions.push(`f.body ILIKE '%' || ${qb.addParam(search)}::text || '%'`);

  if (conditions.length > 0) {
    qb.query += ` WHERE ${conditions.join(" AND ")} `;
  }

  qb.query += `
    ORDER BY f.created_on DESC
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
): Promise<Feedback | null> => {
  const query = `SELECT 
                  sites.owner_id, feedback.feedback_id, feedback.site_id  
                  FROM feedback 
                  JOIN sites ON sites.site_id = feedback.site_id
                  WHERE feedback_id=$1::uuid`;
  const parameters = [feedback_id];
  const result = await executeQuery(query, parameters);

  return result.rows.length > 0 ? (result.rows[0] as Feedback) : null;
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
