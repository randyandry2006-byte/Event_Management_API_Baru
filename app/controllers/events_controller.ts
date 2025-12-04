import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'

export default class EventsController {
  async index({ request, response, authUser }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    
    let query = Event.query()
    
    // Basic users only see their own events
    if (authUser && authUser.role === 'user') {
      query = query.where('created_by', authUser.id)
    }
    
    const events = await query.paginate(page, limit)
    
    return response.ok({
      success: true,
      data: events,
      meta: {
        user_role: authUser?.role || 'guest',
        total: events.total
      }
    })
  }

  async store({ request, response, authUser }: HttpContext) {
    if (!authUser) {
      return response.unauthorized({ message: 'Authentication required' })
    }
    
    const data = request.only(['title', 'description', 'location', 'date', 'created_by'])
    
    // Attach user info
    data.created_by = authUser.id
    
    const event = await Event.create(data)
    
    return response.created({
      success: true,
      message: 'Event created successfully',
      data: event
    })
  }

  async update({ params, request, response, authUser }: HttpContext) {
    if (!authUser) {
      return response.unauthorized({ message: 'Authentication required' })
    }
    
    const event = await Event.findOrFail(params.id)
    
    // Check permission
    if (authUser.role === 'user' && event.createdBy !== authUser.id) {
      return response.forbidden({
        success: false,
        message: 'You can only edit your own events'
      })
    }
    
    const data = request.only(['title', 'description', 'location', 'date'])
    event.merge(data)
    await event.save()
    
    return response.ok({
      success: true,
      message: 'Event updated successfully',
      data: event
    })
  }

  async destroy({ params, response, authUser }: HttpContext) {
    if (!authUser) {
      return response.unauthorized({ message: 'Authentication required' })
    }
    
    const event = await Event.findOrFail(params.id)
    
    // Check permission
    if (authUser.role === 'user' && event.createdBy !== authUser.id) {
      return response.forbidden({
        success: false,
        message: 'You can only delete your own events'
      })
    }
    
    await event.delete()
    
    return response.ok({
      success: true,
      message: 'Event deleted successfully'
    })
  }

  // Additional methods
  async byLocation({ params, response, authUser }: HttpContext) {
    const { location } = params
    
    let query = Event.query().where('location', 'like', `%${location}%`)
    
    if (authUser?.role === 'user') {
      query = query.where('created_by', authUser.id)
    }
    
    const events = await query
    
    return response.ok({
      success: true,
      data: events,
      count: events.length
    })
  }

  async byDateRange({ params, response, authUser }: HttpContext) {
    const { startDate, endDate } = params
    
    let query = Event.query()
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
    
    if (authUser?.role === 'user') {
      query = query.where('created_by', authUser.id)
    }
    
    const events = await query
    
    return response.ok({
      success: true,
      data: events,
      count: events.length
    })
  }
}