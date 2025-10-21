import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned()
      
      // TAMBAHKAN KOLOM DATA EVENT
      table.string('title').notNullable()
      table.text('description').nullable()
      table.string('location').nullable()
      table.date('date').notNullable()
      
      // PERBAIKI TIMESTAMP
      table.datetime('created_at').notNullable().defaultTo(this.now())
      table.datetime('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}