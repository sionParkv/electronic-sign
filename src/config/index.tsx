const ENV = process.env.NODE_ENV || 'production'

const PATH = {
  production: '/app/logs/relay/prod',
  development: `${process.cwd()}/logs`,
  test: `${process.cwd()}/logs`
}

const DB = {
  production: {
    user: 'mobile_base',
    password: 'mobile_!jj1m',
    server: '210.107.85.113',
    database: 'MEDIPLUS_MEDIYIN',
    steram: true,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  },
  development: {
    user: 'mobile_base',
    password: 'mobile_!jj1m',
    server: '210.107.85.113',
    database: 'MEDIPLUS_MEDIYIN',
    steram: true,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  },
  test: {
    user: 'mobile_base',
    password: 'mobile_!jj1m',
    server: '210.107.85.113',
    database: 'MEDIPLUS_MEDIYIN',
    steram: true,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  }
}
const KEYS = {
  production: '/app/logs/relay/prod',
  development: `${process.cwd()}/logs`,
  test: `${process.cwd()}/logs`
}

const cfgServer = {
  env: ENV,
  path: PATH[ENV],
  db: DB[ENV]
}
export { cfgServer }
