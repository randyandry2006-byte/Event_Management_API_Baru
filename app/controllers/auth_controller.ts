import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register(ctx: HttpContext) {
    const data = ctx.request.only(['name', 'email', 'password'])

    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      return ctx.response.conflict({ message: 'Email sudah terdaftar' })
    }

    const user = await User.create(data)

    return ctx.response.created({
      message: 'User berhasil dibuat',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  }

  async login(ctx: HttpContext) {
    const { email, password } = ctx.request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)
    if (!user) {
      return ctx.response.unauthorized({ message: 'Email atau password salah' })
    }

    // FIX: abilities harus array[]
    const token = await User.accessTokens.create(user, ['api_token'], {
      expiresIn: '7 days',
    })

    return ctx.response.ok({
      message: 'Login berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: token.value!.release(),
    })
  }

  async logout(ctx: HttpContext) {
    return ctx.response.ok({ message: 'Logout berhasil' })
  }

  async profile(ctx: HttpContext) {
    return ctx.response.ok({ user: ctx.auth.user ?? null })
  }
}
