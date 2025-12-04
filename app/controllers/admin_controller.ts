// app/controllers/admin_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AdminController {
  async listUsers({ response }: HttpContext) {
    const users = await User.all()
    return response.ok(users)
  }

  async deleteUser({ params, response }: HttpContext) {
    const id = Number(params.id)

    if (Number.isNaN(id)) {
      return response.badRequest({
        message: 'Invalid ID format'
      })
    }

    const user = await User.find(id)
    if (!user) {
      return response.notFound({
        message: 'User not found'
      })
    }

    await user.delete()

    return response.ok({
      message: 'User deleted successfully'
    })
  }
}
