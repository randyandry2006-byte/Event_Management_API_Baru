import router from '@adonisjs/core/services/router'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import YAML from 'yaml'

try {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const openApiPath = join(__dirname, '../docs/openapi.yaml')
  const file = readFileSync(openApiPath, 'utf8')
  const swaggerSpec = YAML.parse(file)

  // Serve the raw OpenAPI JSON at /docs/openapi.json
  router.get('/docs/openapi.json', async () => {
    return swaggerSpec
  })

  // Serve Swagger UI HTML at /docs
  router.get('/docs', async ({ response }) => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Swagger UI</title>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.54.0/swagger-ui.css">
          <style>
            html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.54.0/swagger-ui-bundle.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.54.0/swagger-ui-standalone-preset.js"></script>
          <script>
            const spec = ${JSON.stringify(swaggerSpec)};
            SwaggerUIBundle({
              spec: spec,
              dom_id: '#swagger-ui',
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              layout: 'BaseLayout',
              deepLinking: true
            });
          </script>
        </body>
      </html>
    `

    response.type('text/html')
    response.send(html)
  })
} catch (error) {
  console.warn('⚠️ Swagger routes failed to load:', error instanceof Error ? error.message : String(error))
}
