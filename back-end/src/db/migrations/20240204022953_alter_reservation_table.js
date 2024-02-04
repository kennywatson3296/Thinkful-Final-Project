
exports.up = function(knex) {
   return knex.transaction(async (trx)=>{
    try{
        await knex.schema.alterTable('reservations', (table)=>{
            table.string('status').notNullable().defaultTo('booked')
        }).transacting(trx)

        await trx.commit()
        console.log('Transaction committed successfully')
    }catch (error){
        await trx.rollback()
        console.error('Transaction rolled back due to error:', error)
    }
   })
};

exports.down = function(knex) {
  return knex.transaction(async (trx)=>{
    try {
        await knex.schema.alterTable('reservations', (table)=>{
            table.dropColumn('status')
        }).transacting(trx)

        await trx.commit()
        console.log('Rollback transaction committed successfully')
    }catch (error){
        await trx.rollback()
        console.error('Rollback transaction rolled back due to error:', error)
    }
  })
};
