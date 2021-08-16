const config = {
  password: "root",
  host: "/var/run/postgresql",
  port: 5432,
  database: "test",
  max: 10,
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 60000
}

export default config;