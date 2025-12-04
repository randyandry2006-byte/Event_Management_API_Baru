import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // Clear existing users
    await User.truncate()

    // Create users with roles
    await User.createMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin', // ✅ Role ditambahkan
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      },
      {
        name: 'Nabil Syahputra',
        email: 'nabil@gmail.com',
        password: 'password123',
        role: 'manager', // ✅ Role ditambahkan
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user', // ✅ Role ditambahkan
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user', // ✅ Role ditambahkan
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      }
    ])

    console.log('✅ User seeder completed with roles')
  }
}