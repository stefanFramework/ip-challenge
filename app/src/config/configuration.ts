export default () => ({
  port: parseInt(process.env.APP_PORT) || 3000,
  database: {
    connString: process.env.DATABASE_CONNSTRING,
    name: process.env.DATABASE_NAME,
  },
  ipApi: {
    url: process.env.IP_API_URL,
  },
  currencyApi: {
    apiKey: process.env.CURRENCY_API_KEY,
    url: process.env.CURRENCY_API_URL,
  },
});
