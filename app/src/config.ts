export const config = () => ({
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION,
    DATABASE_URI: process.env.DATABASE_URI

})