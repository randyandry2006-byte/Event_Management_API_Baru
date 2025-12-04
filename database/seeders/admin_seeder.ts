import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class AdminSeeder extends BaseSeeder {
  async run() {
    await User.updateOrCreate(
      { email: 'admin@example.com' },
      {
        name: 'Andry',
        email: 'andry@example.com',
        password: 'andry123',
        role: 'admin',
      }
    )

    console.log('Admin created:')
    console.log('email: admin@example.com')
    console.log('password: admin123')
  }
}
