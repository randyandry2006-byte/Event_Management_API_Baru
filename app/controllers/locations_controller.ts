import axios from 'axios'
import type { HttpContext } from '@adonisjs/core/http'

export default class LocationController {
  async search({ request, response }: HttpContext) {
    const query = request.input('q')

    if (!query) {
      return response.badRequest({
        message: 'Parameter "q" wajib diisi',
      })
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`

    const result = await axios.get(url, {
      headers: { 'User-Agent': 'EventManagementApp/1.0' },
    })

    return response.ok({
      query,
      results: result.data,
    })
  }
}
