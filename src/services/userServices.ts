import { GEN_URL, headers } from "../common/config";

/**
 * * Get user_id by email
 * @param email
 * @return {
 * category,
 * }
 */
const getUserIdByEmail = async (email: string): Promise<any> => {
    return await fetch(GEN_URL(`/api/user_email/${email}`), {
        method: "GET",
        headers: headers,
    }).then((res) => {
        return res.json();
    });
};

export default {
    getUserIdByEmail,
};
