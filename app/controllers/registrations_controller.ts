import Registration from '#models/registration'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegistrationsController {
  // METHOD STANDARD CRUD
  async index({ response }: HttpContext) {
    const registrations = await Registration.all()
    return response.ok(registrations)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['event_id', 'participant_id', 'status'])
    const registration = await Registration.create(data)
    return response.created(registration)
  }

   async destroy({ params, response }: HttpContext) {
    try {
      // GUNAKAN find() DENGAN HANDLING MANUAL
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

  // GET BY ID 
  async show({ params, response }: HttpContext) {
    try {
      const registration = await Registration.findOrFail(params.id)
      return response.ok(registration)
    } catch (error) {
      return response.notFound({ message: 'Registration tidak ditemukan' })
    }
  }

  // CUSTOM METHODS
  
  // GET /registrations/event/:eventId
  async byEvent({ params, response }: HttpContext) {
    const registrations = await Registration.query()
      .where('event_id', params.eventId)
      .preload('event')
      .preload('participant')
    
    return response.ok(registrations)
  }

  // GET /registrations/participant/:participantId
  async byParticipant({ params, response }: HttpContext) {
    const registrations = await Registration.query()
      .where('participant_id', params.participantId)
      .preload('event')
      .preload('participant')
    
    return response.ok(registrations)
  }

  // GET /registrations/event/:eventId/status/:status
  async byEventAndStatus({ params, response }: HttpContext) {
    const registrations = await Registration.query()
      .where('event_id', params.eventId)
      .where('status', params.status)
      .preload('event')
      .preload('participant')
    
    return response.ok(registrations)
  }
}