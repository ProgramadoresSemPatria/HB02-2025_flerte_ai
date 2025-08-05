export interface User {
    id: string;
    email: string;
    name: string
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserPreferencesDTO {
    personalityStyle: string;
    responseLength: string;
}