import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
router.get('/', async () => {
  return { 
    message: 'Event Management API',
    version: '1.0.0',
    status: 'running'
  }
})

router.post('/register', '#controllers/auth_controller.register')
router.post('/login', '#controllers/auth_controller.login')
router.post('/logout', '#controllers/auth_controller.logout').use(middleware.auth())

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (AUTH ONLY)
|--------------------------------------------------------------------------
*/
router.group(() => {
  // Events CRUD
  router.get('/events', '#controllers/events_controller.index')
  router.post('/events', '#controllers/events_controller.store')
  router.get('/events/:id', '#controllers/events_controller.show')
  router.put('/events/:id', '#controllers/events_controller.update')
  router.delete('/events/:id', '#controllers/events_controller.destroy')
  
  // Participants CRUD
  router.get('/participants', '#controllers/participants_controller.index')
  router.post('/participants', '#controllers/participants_controller.store')
  router.get('/participants/:id', '#controllers/participants_controller.show')
  router.put('/participants/:id', '#controllers/participants_controller.update')
  router.delete('/participants/:id', '#controllers/participants_controller.destroy')
  
  // Registrations CRUD
  router.get('/registrations', '#controllers/registrations_controller.index')
  router.post('/registrations', '#controllers/registrations_controller.store')
  router.get('/registrations/:id', '#controllers/registrations_controller.show')
  router.put('/registrations/:id', '#controllers/registrations_controller.update')
  router.delete('/registrations/:id', '#controllers/registrations_controller.destroy')
  
}).use(middleware.auth())

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/
router.group(() => {
  router.get('/admin/users', '#controllers/admin_controller.listUsers')
  router.delete('/admin/users/:id', '#controllers/admin_controller.deleteUser')
  
}).use([
  middleware.auth(),
  middleware.role({ roles: ['admin'] })
])

/*
|--------------------------------------------------------------------------
| PUBLIC APIs
|--------------------------------------------------------------------------
*/
router.get('/api/weather/:city', async ({ params }) => {
  return {
    city: params.city,
    temperature: 28,
    condition: 'Sunny',
    source: 'mock'
  }
})

router.get('/api/currency/rates', async () => {
  return {
    base: 'USD',
    rates: {
      IDR: 15500,
      EUR: 0.92,
      GBP: 0.79
    },
    source: 'mock'
  }
})

/*
|--------------------------------------------------------------------------
| CUSTOM EVENT ROUTES
|--------------------------------------------------------------------------
*/
router.get('/events/location/:location', '#controllers/events_controller.byLocation')
router.get('/events/date/:startDate/:endDate', '#controllers/events_controller.byDateRange')
