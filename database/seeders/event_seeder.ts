import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Event from '#models/event'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {

    await Event.createMany([
      {
        title: 'Tech Conference 2024',
        description: 'Annual technology conference with latest innovations',
        location: 'Jakarta Convention Center',
        date: DateTime.fromISO('2024-12-15'),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      },
      {
        title: 'Music Festival',
        description: 'International music festival with top artists',
        location: 'Bali Beach',
        date: DateTime.fromISO('2024-11-20'),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      },
      {
        title: 'Startup Workshop',
        description: 'Workshop for aspiring entrepreneurs',
        location: 'Online',
        date: DateTime.fromISO('2024-10-25'),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      },
      {
        title: 'Charity Gala',
        description: 'Annual charity event for children education',
        location: 'Sultan Hotel',
        date: DateTime.fromISO('2024-12-05'),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      },
      {
        title: 'Sports Competition',
        description: 'Inter-company sports competition',
        location: 'Gelora Bung Karno Stadium',
        date: DateTime.fromISO('2024-11-10'),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      }
    ])
 const existingEvents = await Event.all()
    if (existingEvents.length === 0) {
      // Hanya buat data jika tabel kosong
      await Event.createMany([
        // ... data events
      ])
    } else {
      console.log('⚠️  Events table already has data, skipping...')
    }
  }
}