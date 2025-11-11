import { executeQuery, QueryBuilder } from "./db";
import { User, GoogleUser } from "../validations/users";
import { PaginatedUsers, UserPayload } from "../types/users";
import { SearchQueryProps } from "../validations/sites";

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

export const findOrCreateUser = async (
  googleUser: GoogleUser
): Promise<User> => {
  const query = `
    INSERT INTO users (provider, provider_id, email, name, picture, is_admin)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (provider, provider_id)
    DO UPDATE SET
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      picture = EXCLUDED.picture,
      is_admin = EXCLUDED.is_admin,
      updated_on = now()
    RETURNING *;
  `;
  const params = [
    googleUser.provider,
    googleUser.provider_id,
    googleUser.email,
    googleUser.name,
    googleUser.picture,
    googleUser.is_admin,
  ];

  const result = await executeQuery(query, params);
  return result.rows[0];
};

export const deleteUser = async (id: string) => {
  const query = `DELETE FROM users WHERE user_id = $1::uuid RETURNING *`;
  const parameters = [id];
  const result = await executeQuery(query, parameters);
  return result.rows[0] as User | null;
};

export const getUsersPaginated = async (
  data: SearchQueryProps
): Promise<PaginatedUsers> => {
  const qb = new QueryBuilder();
  qb.query = `SELECT 
                    user_id,
                    provider,
                    provider_id,
                    user_id, 
                    name,
                    email,
                    picture,
                    is_admin,
                    created_on,
                    updated_on,
                    COUNT(*) OVER() AS total_count
                  FROM users s
                  `;

  const conditions: string[] = [];

  conditions.push(
    `s.name ILIKE '%' || ${qb.addParam(data.searchText || "")}::text || '%'`
  );

  if (conditions.length > 0) {
    qb.query += ` WHERE ${conditions.join(" AND ")} `;
  }

  qb.query += `
    ORDER BY s.created_on DESC, s.user_id
    LIMIT ${qb.addParam(data.limit || 10)}::int OFFSET ${qb.addParam(data.offset || 0)}::int;
  `;

  const result = await executeQuery(qb.query, qb.params);
  const users: UserPayload[] = result.rows;

  const totalCount =
    result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;

  return { users, totalCount };
};
