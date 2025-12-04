import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare role: 'admin' | 'manager' | 'user'   // type union tetap aman

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  static async verifyCredentials(email: string, password: string) {
    const user = await this.findBy('email', email)
    if (!user) return null

    const isPasswordValid = await hash.verify(user.password, password)
    return isPasswordValid ? user : null
  }

  // TOKEN API (30 hari)
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: 1000 * 60 * 60 * 24 * 30   // 30 days in ms
  })
}
