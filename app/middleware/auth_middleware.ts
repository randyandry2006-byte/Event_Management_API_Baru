import { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { Secret } from '@adonisjs/core/helpers'
import User from '#models/user'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    authUser?: User
    authToken?: string
  }
}

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authorizationHeader = ctx.request.header('authorization')

    if (!authorizationHeader) {
      return ctx.response.unauthorized({
        message: 'Access denied. No token provided.',
      })
    }

    const token = authorizationHeader.replace('Bearer ', '')

    try {
      const accessToken = await User.accessTokens.verify(new Secret(token))

if (!accessToken) {
  return ctx.response.unauthorized({
    message: 'Invalid or expired token',
  })
}

// identifier = userId
const userId = accessToken.identifier

if (!userId) {
  return ctx.response.unauthorized({
    message: 'Token missing user reference',
  })
}

const user = await User.findOrFail(userId)

ctx.authUser = user
ctx.authToken = token

await next()

    } catch (error) {
      return ctx.response.unauthorized({
        message: 'Authentication failed',
        error: error.message,
      })
    }
  }
}
