export type Tokens = {
    access_token: string,
    refresh_token: string
}

export type JWTPayload = {
    userId: string,
    email: string
}