import db from '@proyek3/postgres-database/db'
import server from './server'
import { setAssociations } from "./associations"

db.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.')

    // NOTE : Set association between sequelize models to make association query works
    setAssociations()

    server.listen(process.env.SERVER_PORT, () =>
      console.log(`Server app listening on port ${process.env.SERVER_PORT}!`)
    )
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error)
  })
