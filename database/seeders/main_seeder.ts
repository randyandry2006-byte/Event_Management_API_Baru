import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Event from '#models/event'
import Participant from '#models/participant'
import Registration from '#models/registration'
import { DateTime } from 'luxon'

export default class MainSeeder extends BaseSeeder {
  async run() {
    console.log('🚀 Starting database seeding...')
    
    // 1. CLEAN UP: Hapus semua data dengan urutan yang benar
    console.log('🧹 Cleaning up old data...')
    await Registration.query().delete() // Hapus child table dulu
    await Event.query().delete()
    await Participant.query().delete()
    await User.query().delete()
    
    // 2. SEED USERS
    console.log('👥 Seeding users...')
    await User.createMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      },
      {
        name: 'Nabil Syahputra',
        email: 'nabil@gmail.com',
        password: 'password123',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      }
    ])
    
    // 3. SEED EVENTS
    console.log('🎪 Seeding events...')
    const events = await Event.createMany([
      {
        title: 'Tech Conference 2024',
        description: 'Annual technology conference',
        location: 'Jakarta Convention Center',
        date: DateTime.fromISO('2024-12-15'),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      },
      {
        title: 'Music Festival',
        description: 'International music festival',
        location: 'Bali Beach',
        date: DateTime.fromISO('2024-11-20'),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      }
    ])
    
    // 4. SEED PARTICIPANTS
    console.log('👤 Seeding participants...')
    const participants = await Participant.createMany([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      },
      {
        name: 'Bob Williams',
        email: 'bob@example.com',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      }
    ])
    
    // 5. SEED REGISTRATIONS
    console.log('📝 Seeding registrations...')
    if (events.length > 0 && participants.length > 0) {
      await Registration.createMany([
        {
          eventId: events[0].id,
          participantId: participants[0].id,
          registered_At: DateTime.now(),
          status: 'confirmed',
          createdAt: DateTime.now(),
          updatedAt: DateTime.now()
        },
        {
          eventId: events[1].id,
          participantId: participants[1].id,
          registered_At: DateTime.now(),
          status: 'pending',
          createdAt: DateTime.now(),
          updatedAt: DateTime.now()
        }
      ])
    }
    
    console.log('✅ Database seeding completed successfully!')
  }
}