import Event from '#models/event'
import type { HttpContext } from '@adonisjs/core/http'

export default class EventsController {
  async index({ response }: HttpContext) {
    const events = await Event.all()
    return response.ok(events)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'description', 'location', 'date'])
    const event = await Event.create(data)
    return response.created(event)
  }

  async show({ params, response }: HttpContext) {
    try {
      const event = await Event.findOrFail(params.id)
      return response.ok(event)
    } catch (error) {
      return response.notFound({ message: 'Event tidak ditemukan' })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    const data = request.only(['title', 'description', 'location', 'date'])
    event.merge(data)
    await event.save()
    return response.ok(event)
  }

  async destroy({ params, response }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    await event.delete()
    return response.ok({ message: 'Event deleted successfully' })
  }

  async byLocation({ params, response }: HttpContext) {
    const events = await Event.query()
      .where('location', params.location)
      .orderBy('date', 'desc')
    
    return response.ok(events)
  }

  async byDateRange({ params, response }: HttpContext) {
    const events = await Event.query()
      .whereBetween('date', [params.startDate, params.endDate])
      .orderBy('date', 'asc')
    
    return response.ok(events)
  }
}