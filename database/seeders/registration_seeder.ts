import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Registration from '#models/registration'
import Event from '#models/event'
import Participant from '#models/participant'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await Registration.truncate()

    // Get some events and participants
    const events = await Event.all()
    const participants = await Participant.all()

    if (events.length > 0 && participants.length > 0) {
      const registrations = []
      
      // Create registrations
      for (let i = 0; i < Math.min(10, participants.length); i++) {
        const event = events[i % events.length]
        const participant = participants[i]
        
        registrations.push({
          eventId: event.id,
          participantId: participant.id,
          registered_At: DateTime.now().minus({ days: i }),
          status: i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'confirmed' : 'cancelled',
          createdAt: DateTime.now(),
          updatedAt: DateTime.now()
        })
      }

      await Registration.createMany(registrations)
    }

    console.log('✅ Registration seeder completed')
  }
}