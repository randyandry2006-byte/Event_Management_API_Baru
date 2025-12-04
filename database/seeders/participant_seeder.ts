import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Participant from '#models/participant'

export default class extends BaseSeeder {
  async run() {
    console.log('👤 Running participant seeder...')
    
    // CEK dulu apakah sudah ada data
    const existingParticipants = await Participant.all()
    
    if (existingParticipants.length > 0) {
      console.log(`⚠️ Participants table already has ${existingParticipants.length} records`)
      console.log('ℹ️ Skipping participant seeding to avoid foreign key constraint errors')
      console.log('✅ Participant seeder completed (skipped)')
      return // Stop eksekusi seeder ini
    }
    
    // Hanya jalankan jika tabel kosong
    console.log('📝 Creating participant data...')
    await Participant.createMany([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
      },
      {
        name: 'Bob Williams',
        email: 'bob@example.com',
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
      },
      {
        name: 'Diana Prince',
        email: 'diana@example.com',
      },
      {
        name: 'Edward Lee',
        email: 'edward@example.com',
      }
    ])

    console.log(`✅ Participant seeder completed - added 5 records`)
  }
}