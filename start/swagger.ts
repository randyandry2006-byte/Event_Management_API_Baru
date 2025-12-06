import router from '@adonisjs/core/services/router'
import { join } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'

// Folder dist Swagger UI
const SWAGGER_UI_PATH = join(process.cwd(), 'node_modules/swagger-ui-dist')

// ===============================
// 1) Serve static Swagger UI
// ===============================
router.get('/swagger-ui/*', async ({ request, response }) => {
  let wildcard = request.param('*')

  // Jika tidak ada param → pakai index.html
  if (!wildcard) {
    wildcard = 'index.html'
  }

  // Jika array → gabungkan
  if (Array.isArray(wildcard)) {
    wildcard = wildcard.join('/')
  }

  // Pastikan string
  wildcard = String(wildcard)

  const filePath = join(SWAGGER_UI_PATH, wildcard)

  // Jika file tidak ada → 404
  if (!existsSync(filePath)) {
    return response.notFound({ message: `File not found: ${wildcard}` })
  }

  return response.download(filePath)
})


// ===============================
// 2) Serve OpenAPI JSON
// ===============================
router.get('/openapi.json', async ({ response }) => {
  const filePath = join(process.cwd(), 'docs', 'openapi.json')

  if (!existsSync(filePath)) {
    return response.internalServerError({
      message: 'openapi.json tidak ditemukan. Pastikan file ada di folder /docs'
    })
  }

  const json = readFileSync(filePath, 'utf8')
  return response.header('content-type', 'application/json').send(json)
})


// ===============================
// 3) Redirect ke UI utama
// ===============================
router.get('/docs', ({ response }) => {
  return response.redirect('/swagger-ui/index.html')
})
