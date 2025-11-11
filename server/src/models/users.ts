import { executeQuery } from "./db";
import { User, GoogleUser } from "../validations/users";

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
