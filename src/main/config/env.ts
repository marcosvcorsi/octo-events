export const env = {
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
  port: process.env.PORT ?? 3000,
};
