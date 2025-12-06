import axios from 'axios'
import type { HttpContext } from '@adonisjs/core/http'

export default class HolidayController {
  async getHolidays({ params, response }: HttpContext) {
    const { year, country } = params

    if (!year || !country) {
      return response.badRequest({
        message: 'Parameter "year" dan "country" diperlukan',
      })
    }

    try {
      const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`

      const result = await axios.get(url)

      return response.ok({
        year,
        country,
        holidays: result.data,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Gagal mengambil data public holidays',
        error: error.message,
      })
    }
  }
}
