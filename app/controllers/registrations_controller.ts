import Registration from '#models/registration'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegistrationsController {
  async index({ response }: HttpContext) {
    const registrations = await Registration.all()
    return response.ok(registrations)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['eventId', 'participantId'])
    const registration = await Registration.create(data)
    return response.created(registration)
  }

   async destroy({ params, response }: HttpContext) {
    try {
      const registration = await Registration.find(params.id)
      if (!registration) {
        return response.notFound({ message: 'Registration tidak ditemukan' })
      }
      
      await registration.delete()
      return response.ok({ message: 'Registration berhasil dihapus' })
    } catch (error) {
      return response.badRequest({ message: 'Gagal menghapus Registration' })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const registration = await Registration.findOrFail(params.id)
      return response.ok(registration)
    } catch (error) {
      return response.notFound({ message: 'Registration tidak ditemukan' })
    }
  }
  
  async byEvent({ params, response }: HttpContext) {
    const registrations = await Registration.query()
      .where('event_id', params.eventId)
      .preload('event')
      .preload('participant')
    
    return response.ok(registrations)
  }

  async byParticipant({ params, response }: HttpContext) {
    const registrations = await Registration.query()
      .where('participant_id', params.participantId)
      .preload('event')
      .preload('participant')
    
    return response.ok(registrations)
  }

  async byEventAndStatus({ params, response }: HttpContext) {
    const registrations = await Registration.query()
      .where('event_id', params.eventId)
      .where('status', params.status)
      .preload('event')
      .preload('participant')
    
    return response.ok(registrations)
  }
}