import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import YAML from 'yaml'

// Setup Swagger documentation
let swaggerSpec: any = null
try {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const openApiPath = join(__dirname, '../docs/openapi.yaml')
  const file = readFileSync(openApiPath, 'utf8')
  swaggerSpec = YAML.parse(file)
  console.log('✅ Swagger documentation loaded successfully')
} catch (error) {
  console.warn('⚠️ Failed to load OpenAPI spec:', error instanceof Error ? error.message : String(error))
}

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
// Swagger UI Documentation
if (swaggerSpec) {
  router.get('/docs/openapi.json', async () => {
    return swaggerSpec
  })

  router.get('/docs', async ({ response }) => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Swagger UI</title>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui.css">
          <style>
            html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin: 0; padding: 0; }
            #error { padding: 16px; color: #a00; font-family: monospace; }
          </style>
        </head>
        <body>
          <div id="error" style="display:none"></div>
          <div id="swagger-ui"></div>
          <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui-bundle.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui-standalone-preset.js"></script>
          <script>
            function showError(msg) {
              const el = document.getElementById('error')
              el.style.display = 'block'
              el.textContent = msg
              console.error(msg)
            }

            fetch('/docs/openapi.json')
              .then(function(res) {
                if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + res.statusText)
                return res.json()
              })
              .then(function(spec) {
                if (!spec) throw new Error('Empty spec returned')
                SwaggerUIBundle({
                  spec: spec,
                  dom_id: '#swagger-ui',
                  presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
                  layout: 'BaseLayout',
                  deepLinking: true
                })
              })
              .catch(function(err) {
                showError('Failed to load OpenAPI spec: ' + (err && err.message ? err.message : err))
                document.getElementById('swagger-ui').innerHTML = '<p style="padding:16px">See console for details.</p>'
              })
          </script>
        </body>
      </html>
    `

    response.type('text/html')
    response.send(html)
  })
}

router.get('/', async () => {
  return {
    message: 'Event Management API',
    version: '1.0.0',
    status: 'running',
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
router
  .group(() => {
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
  })
  .use(middleware.auth())

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('/admin/users', '#controllers/admin_controller.listUsers')
    router.delete('/admin/users/:id', '#controllers/admin_controller.deleteUser')
  })
  .use([middleware.auth(), middleware.role({ roles: ['admin'] })])

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
    source: 'mock',
  }
})

router.get('/api/currency/rates', async () => {
  return {
    base: 'USD',
    rates: {
      IDR: 15500,
      EUR: 0.92,
      GBP: 0.79,
    },
    source: 'mock',
  }
})

/*
|--------------------------------------------------------------------------
| CUSTOM EVENT ROUTES
|--------------------------------------------------------------------------
*/
router.get('/events/location/:location', '#controllers/events_controller.byLocation')
router.get('/events/date/:startDate/:endDate', '#controllers/events_controller.byDateRange')
