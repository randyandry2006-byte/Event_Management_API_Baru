/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import EventsController from '#controllers/events_controller'
import ParticipantsController from '#controllers/participants_controller'
import RegistrationsController from '#controllers/registrations_controller'

// Default route
router.get('/', async () => {
  return { 
    message: 'Welcome to Event Management API!' 
  }
})

// Basic CRUD routes dengan import langsung
router.resource('events', EventsController).apiOnly()
router.resource('participants', ParticipantsController).apiOnly()
router.resource('registrations', RegistrationsController).apiOnly()

// CUSTOM ROUTES dengan import langsung
router.get('/events/location/:location', [EventsController, 'byLocation'])
router.get('/events/date/:startDate/:endDate', [EventsController, 'byDateRange'])
router.get('/participants/search/:name', [ParticipantsController, 'searchByName'])
router.get('/registrations/event/:eventId/status/:status', [RegistrationsController, 'byEventAndStatus'])
router.get('/registrations/event/:eventId', [RegistrationsController, 'byEvent'])
router.get('/registrations/participant/:participantId', [RegistrationsController, 'byParticipant'])

// Auth routes - GUNAKAN FORMAT YANG LEBIH SIMPLE
router.post('/register', async ({ request, response }) => {
  const User = (await import('#models/user')).default
  const data = request.only(['name', 'email', 'password'])
  
  const existingUser = await User.findBy('email', data.email)
  if (existingUser) {
    return response.conflict({ message: 'Email sudah terdaftar' })
  }

  const user = await User.create(data)
  return response.created({
    message: 'User berhasil dibuat',
    user: { id: user.id, name: user.name, email: user.email }
  })
})

router.post('/login', async ({ request, response }) => {
  const User = (await import('#models/user')).default
  const { email, password } = request.only(['email', 'password'])
  
  const user = await User.verifyCredentials(email, password)
  if (!user) {
    return response.unauthorized({ message: 'Email atau password salah' })
  }

  const token = await User.accessTokens.create(user)
  return response.ok({
    message: 'Login berhasil',
    user: { id: user.id, name: user.name, email: user.email },
    token: token
  })
})