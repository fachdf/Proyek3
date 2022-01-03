import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'

// import keycloak from './middleware/keycloak'
import dosenRouter from './routes/Dosen'
import mahasiswaRouter from './routes/Mahasiswa'
import userRouter from './routes/User'
import kategoriNilaiRouter from './routes/Kategori_Nilai'
import penilaianRouter from './routes/Penilaian'
import kelasRouter from './routes/Kelas'
import matkulRouter from './routes/Mata Kuliah'

const app = express()
app.use(cors())
// Nonaktifkan dahulu Keycloak agar tidak ada validasi token
// app.use(keycloak.middleware())
// app.use(keycloak.protect())
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/dosen', dosenRouter)
app.use('/mahasiswa', mahasiswaRouter)
app.use('/user', userRouter)
app.use('/kategori-nilai', kategoriNilaiRouter)
app.use('/penilaian', penilaianRouter)
app.use('/kelas', kelasRouter)
app.use('/matkul', matkulRouter)

// error handling
app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500
  const message = error.message
  const cause = error.cause || 'Internal Server Error'
  res.status(status).json({
    message: message,
    error: status,
    cause: cause
  })
})

export default app