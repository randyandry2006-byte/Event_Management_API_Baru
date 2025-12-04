import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SessionsMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      // const user = ctx.session.get('user')
    console.log(ctx)

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
    } catch (error) {
      // Handle the error or rethrow
      console.error(error)
      throw error
    }
  }
}