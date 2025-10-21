import Participant from '#models/participant'
import type { HttpContext } from '@adonisjs/core/http'

export default class ParticipantsController {
  async index({ response }: HttpContext) {
    const participants = await Participant.all()
    return response.ok(participants)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'email'])
    const participant = await Participant.create(data)
    return response.created(participant)
  }

 async destroy({ params, response }: HttpContext) {
    try {
      const participant = await Participant.find(params.id)
      if (!participant) {
        return response.notFound({ message: 'Participant tidak ditemukan' })
      }
      
      await participant.delete()
      return response.ok({ message: 'Participant berhasil dihapus' })
    } catch (error) {
      return response.badRequest({ message: 'Gagal menghapus participant' })
    }
  }
  
  async show({ params, response }: HttpContext) {
    try {
      const participant = await Participant.findOrFail(params.id)
      return response.ok(participant)
    } catch (error) {
      return response.notFound({ message: 'Participant tidak ditemukan' })
    }
  }

  async searchByName({ params, response }: HttpContext) {
    const participants = await Participant.query()
      .where('name', 'like', `%${params.name}%`)
      .orderBy('name', 'asc')
    
    return response.ok(participants)
  }
}