import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      // GUNAKAN APPROACH YANG LEBIH AMAN
      const auth = ctx.auth
      
      // Check if user is authenticated
      if (!auth.isAuthenticated) {
        return ctx.response.unauthorized({ 
          message: 'Silakan login terlebih dahulu' 
        })
      }
      
      await next()
    } catch (error) {
      return ctx.response.unauthorized({ 
        message: 'Token tidak valid' 
      })
    }
  }
}