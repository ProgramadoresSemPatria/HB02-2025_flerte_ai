import { apiInstance } from "../lib/axios";
import { User } from "../types/user";

type CreateSessionResponse = {
    token: string;
    user: User
}

const createSession = async (email:string, password:string) => {
    const res = await apiInstance.post<CreateSessionResponse>("/auth/login", {email, password})
    return res.data
}

export default createSession