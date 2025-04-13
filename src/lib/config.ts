interface Config {
  api: {
    baseUrl: string;
    timeout: number;
  };
  auth: {
    tokenKey: string;
  };
}

const config: Config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
  },
  auth: {
    tokenKey: 'auth_token',
  },
};

export default config; 