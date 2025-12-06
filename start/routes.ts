import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import LocationController from '#controllers/location_controller'
import HolidayController from '#controllers/holidays_controller'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'

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
  middleware.role(['admin'])
])

/*
|--------------------------------------------------------------------------
| PUBLIC APIs
|--------------------------------------------------------------------------
*/
router.get('/location/search', [LocationController, 'search'])
router.get('/holidays/:year/:country', [HolidayController, 'getHolidays'])


/*
|--------------------------------------------------------------------------
| CUSTOM EVENT ROUTES
|--------------------------------------------------------------------------
*/
router.get('/events/location/:location', '#controllers/events_controller.byLocation')
router.get('/events/date/:startDate/:endDate', '#controllers/events_controller.byDateRange')

// Path ke swagger-ui-dist
const SWAGGER_UI_DIST = join(process.cwd(), 'node_modules', 'swagger-ui-dist')

// 1️⃣ Serve swagger-ui index.html
router.get('/swagger-ui', async ({ response }) => {
  const indexPath = join(SWAGGER_UI_DIST, 'index.html')
  return response.download(indexPath)
})

// 2️⃣ Redirect /docs → swagger-ui
router.get('/docs', async ({ response }) => {
  return response.redirect('/swagger-ui')
})

// 3️⃣ Serve openapi.json
router.get('/openapi.json', async ({ response }) => {
  const jsonPath = join(process.cwd(), 'docs', 'openapi.json')
  const output = readFileSync(jsonPath, 'utf8')
  return response.header('content-type', 'application/json').send(output)
})