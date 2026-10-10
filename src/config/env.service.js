
export const env = {
    nodeEnv: "development",
    port: 3000,
    dbUri: "mongodb://127.0.0.1:27017/sara7aDB",
    saltRounds: 10,
    encryptionKey: "sara7a_encryption_key_change_me",
    userAccessSecret: "sara7a_user_access_secret",
    userRefreshSecret: "sara7a_user_refresh_secret",
    adminAccessSecret: "sara7a_admin_access_secret",
    adminRefreshSecret: "sara7a_admin_refresh_secret",
    accessExpiresIn: "1h",
    refreshExpiresIn: "7d",
    uploadsDir: "uploads",
    maxFileSize: 5 * 1024 * 1024,
};
