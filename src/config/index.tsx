const ENV = process.env.NODE_ENV || 'production'

const PATH = {
  // production: '/app/logs/relay/prod',
  production: `${process.cwd()}/logs`,
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
    server: 'localhost',
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
  production: 'eifl3738EIDD0927lsne7103KENK0817',
  development: 'eifl3738EIDD0927lsne7103KENK0817',
  test: 'eifl3738EIDD0927lsne7103KENK0817'
}

const cfgServer = {
  env: ENV,
  path: PATH[ENV],
  db: DB[ENV],
  key: KEYS[ENV]
}
export { cfgServer }
