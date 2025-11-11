import { executeQuery, QueryBuilder } from "./db";

import {
  SearchQueryProps,
  SiteUpdateFormData,
  SiteAddFormData,
} from "../validations/sites";
import { Site, PaginatedSites, SiteWithFeedback } from "../types/sites";

export const getSitesPaginated = async (
  data: SearchQueryProps
): Promise<PaginatedSites> => {
  const qb = new QueryBuilder();
  qb.query = `SELECT 
                    s.site_id, 
                    s.name, 
                    s.url, 
                    s.owner_id, 
                    s.created_on, 
                    s.updated_on, 
                    s.description,
                    COUNT(f.feedback_id) AS feedback_count,
                    COUNT(*) OVER() AS total_count
                  FROM sites s`;

  qb.query += ` LEFT JOIN feedback f ON s.site_id = f.site_id `;
  if (!data.is_admin) {
    qb.query += ` AND f.public IS TRUE `;
  }

  const conditions: string[] = [];

  if (data.owner_id) {
    conditions.push(`s.owner_id = ${qb.addParam(data.owner_id)}`);
  }

  conditions.push(
    `s.name ILIKE '%' || ${qb.addParam(data.searchText || "")}::text || '%'`
  );

  if (conditions.length > 0) {
    qb.query += ` WHERE ${conditions.join(" AND ")} `;
  }

  qb.query += `
    GROUP BY s.site_id
    ORDER BY s.created_on DESC 
    LIMIT ${qb.addParam(data.limit || 10)}::int OFFSET ${qb.addParam(data.offset || 0)}::int;
  `;

  const result = await executeQuery(qb.query, qb.params);
  const sites: SiteWithFeedback[] = result.rows.map((row) => ({
    site_id: row.site_id,
    name: row.name,
    url: row.url,
    owner_id: row.owner_id,
    description: row.description,
    created_on: row.created_on,
    updated_on: row.updated_on,
    feedback_count: Number(row.feedback_count) || 0,
  }));

  const totalCount =
    result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;

  return { sites, totalCount };
};

export const findSiteById = async (id: string) => {
  const query = `SELECT 
                  s.site_id, 
                  s.name, 
                  s.url, 
                  s.owner_id, 
                  s.created_on, 
                  s.updated_on, 
                  s.description,
                  f.summary,
                  f.started_on as summary_started_on,
                  f.updated_on as summary_updated_on,
                  f.error as summary_error
                  FROM sites s
                  LEFT JOIN feedback_summary f ON s.site_id = f.site_id
                  WHERE s.site_id=$1::uuid`;
  const parameters = [id];

  const result = await executeQuery(query, parameters);
  return result.rows.length > 0 ? (result.rows[0] as Site) : null;
};

export const createSite = async (site: SiteAddFormData) => {
  const query = `INSERT INTO sites (name, url, owner_id, description) 
                  VALUES ($1::text, $2::text, $3::uuid, $4::text)
                  ON CONFLICT (name) 
                  DO UPDATE
                  SET 
                      url = EXCLUDED.url,
                      description = EXCLUDED.description,
                      updated_on = now()
                  RETURNING *`;

  const parameters = [site.name, site.url, site.owner_id, site.description];

  const result = await executeQuery(query, parameters);
  if (!result.rows.length) {
    throw new Error("Failed to create or update site");
  }

  return result.rows[0] as Site;
};

export const deleteSite = async (id: string) => {
  const query = `DELETE FROM sites WHERE site_id = $1::uuid RETURNING *`;
  const parameters = [id];
  const result = await executeQuery(query, parameters);
  return result.rows[0] as Site | null;
};

export const updateSite = async ({
  name,
  url,
  description,
  site_id,
}: SiteUpdateFormData) => {
  const query = `UPDATE sites
                    SET 
                      name = COALESCE($1::text, name),
                      url = CASE
                              WHEN $2::text IS NULL THEN NULL
                              ELSE COALESCE($2::text, url)
                            END,
                      description = CASE
                                      WHEN $3::text IS NULL THEN NULL
                                      ELSE COALESCE($3::text, description)
                                    END,
                      updated_on = now()
                    WHERE site_id = $4
                    RETURNING *;
                    `;

  const result = await executeQuery(query, [name, url, description, site_id]);

  if (!result.rows.length) {
    throw new Error("Site name already exists for this user");
  }
  return result.rows[0] as Site;
};
