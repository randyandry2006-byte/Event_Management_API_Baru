import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = request.only(['name', 'email', 'password'])
    
    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      return response.conflict({ message: 'Email sudah terdaftar' })
    }

    const user = await User.create(data)
    
    return response.created({
      message: 'User berhasil dibuat',
      user: { id: user.id, name: user.name, email: user.email }
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    
    const user = await User.verifyCredentials(email, password)
    if (!user) {
      return response.unauthorized({ message: 'Email atau password salah' })
    }

    const token = await User.accessTokens.create(user)
    
    return response.ok({
      message: 'Login berhasil',
      user: { id: user.id, name: user.name, email: user.email },
      token: token
    })
  }

  async logout({ response }: HttpContext) {
    // Simple logout tanpa auth object
    return response.ok({ message: 'Logout berhasil' })
  }

  async profile({ response }: HttpContext) {
    // Simple profile tanpa auth
    return response.ok({ message: 'Profile endpoint' })
  }
}