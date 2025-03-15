import postgres from 'postgres';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (typeof process != 'undefined' ? process.env : {}) as any;
let dbConnectTo;
Object.keys(env).forEach((key) => {
  if (/* key.startsWith('POSTGRES_') || */ key.startsWith('DB_')) {
    const value: string = env[key] as string;
    console.log(`${key}: ${value}`);

    if (key.includes('DB_CONNECT_TO')) dbConnectTo = value;
  }
});

let sql: postgres.Sql;

console.log(
  '------ CONNCTED DB HOST IS: ',
  env.DB_HOST || env.POSTGRES_HOST,
  ' ------',
);

if (dbConnectTo === 'localhost') {
  console.log();
  sql = postgres(
    `postgres://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`,
    {
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
    },
  );
} else {
  sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
}

export { sql };
