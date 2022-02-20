export const env = {
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
  mail: {
    host: process.env.MAIL_HOST as string,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER as string,
      pass: process.env.MAIL_PASS as string,
    },
  },
  redis: {
    url: process.env.REDIS_URL as string,
  },
  port: process.env.PORT ?? 3000,
};
