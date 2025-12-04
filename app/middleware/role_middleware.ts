// app/middleware/role_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  /**
   * options bisa:
   * - 'admin'
   * - ['admin', 'super']
   * - { roles: ['admin'] }
   */
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options?: string | string[] | { roles?: string[] }
  ) {
    // Normalize options menjadi array string
    let allowedRoles: string[] = []

    if (!options) {
      allowedRoles = []
    } else if (typeof options === 'string') {
      allowedRoles = [options]
    } else if (Array.isArray(options)) {
      allowedRoles = options
    } else if ('roles' in options && Array.isArray(options.roles)) {
      allowedRoles = options.roles
    }

    const user = ctx.auth?.user   // gunakan auth.user (auth middleware harus sudah dijalankan)

    if (!user) {
      return ctx.response.unauthorized({ message: 'Unauthorized' })
    }

    console.log('Middleware executed for user:', (user as any).id ?? 'unknown')
    console.log('Allowed roles:', allowedRoles)

    if (allowedRoles.length > 0 && !allowedRoles.includes((user as any).role)) {
      return ctx.response.forbidden({ message: 'Forbidden: Role tidak diizinkan' })
    }

    await next()
  }
}
