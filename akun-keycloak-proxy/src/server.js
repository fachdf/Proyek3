import connectRedis from 'connect-redis'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import httpProxy from 'http-proxy-middleware'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import htmlParser from 'node-html-parser'
import pug from 'pug'
import redis from 'redis'
import { URL } from 'url'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'

import {
  JWT_SECRET,
  KEYCLOAK_BASE_URL,
  KEYCLOAK_LOGIN_PATTERN,
  KEYCLOAK_LOGIN_URL,
  REDIS_HOSTNAME,
  SESSION_PREFIX,
  FRONTEND_URL
} from './config.js'

const { omit, trim } = _
const { parse: parseHTML } = htmlParser


const app = express()

if (process.env.NODE_ENV === 'production') {
  const redisClient = redis.createClient({
    host: REDIS_HOSTNAME
  })
  const RedisStore = connectRedis(session)

  app.set('trust proxy', 1)
  app.use(session({
    store: new RedisStore({
      client: redisClient,
      prefix: `${SESSION_PREFIX}:`
    }),
    name: `${SESSION_PREFIX}`,
    saveUninitialized: false,
    secret: uuidv4(),
    resave: false
  }))
} else {
  app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
  }))

  app.use(session({
    name: 'akun-keycloak-proxy_session',
    saveUninitialized: false,
    secret: uuidv4(),
    resave: false
  }))
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(httpProxy.createProxyMiddleware({
  selfHandleResponse: true,
  target: KEYCLOAK_BASE_URL,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    if (req.path.match(KEYCLOAK_LOGIN_PATTERN)) {
      handleLoginRequest(req, res)
    }

    /* Fix body-parser issue by re-streaming the body
     * https://github.com/chimurai/http-proxy-middleware/issues/320
     */
    if (!req.body || !Object.keys(req.body).length) {
      return
    }

    const contentType = proxyReq.getHeader('Content-Type')

    let body
    if (contentType.startsWith('application/json')) {
      body = JSON.stringify(req.body)
    } else if (contentType.startsWith('application/x-www-form-urlencoded')) {
      // qs is used instead of querystring and URLSearchParams because
      // extended option is set to true for express.urlencoded
      body = qs.stringify(req.body)
    }

    if (body) {
      proxyReq.setHeader('Content-Length', Buffer.byteLength(body))
      proxyReq.write(body)
    }
  },
  onProxyRes: httpProxy.responseInterceptor(
    async (responseBuffer, proxyRes, req, res) => {
      if (req.path.match(KEYCLOAK_LOGIN_PATTERN)) {
        return handleLoginResponse(responseBuffer, proxyRes, req, res)
      }

      return responseBuffer
    })
}))

const renderLoginPage = pug.compileFile('resources/pug/login.pug')

const handleLoginRequest = (req, res) => {
  req.login = {
    locationHref: req.body.locationHref
  }

  if (req.login.locationHref) {
    const queryString = Object.fromEntries(
      new URL(req.login.locationHref).searchParams
    )

    if (queryString.get('method') === 'token') {
      try {
        const decoded = jwt.verify(queryString.value, JWT_SECRET)

        req.body.username = decoded.username
        req.body.password = decoded.password
      } catch (err) {
        console.log(err)

        req.body.username = ''
        req.body.password = ''
      }
    }
  }

  req.body = omit(req.body, ['locationHref'])
}

const handleLoginResponse = async (responseBuffer, proxyRes, req, res) => {
  const root = parseHTML(responseBuffer.toString('utf8'))
  const loginForm = root.querySelector('#kc-form-login')

  if (loginForm) {
    const action = loginForm.attributes.action
    const errors = []
    const loginUrl = new URL(req.login.locationHref || KEYCLOAK_LOGIN_URL)

    const error = root.querySelector('#input-error')
    if (error) {
      errors.push(trim(error.innerHTML))
    }

    return renderLoginPage({
      action,
      errors,
      loginUrl: loginUrl.href,
      username: req.body.username
    })
  }

  return responseBuffer
}

export default app
