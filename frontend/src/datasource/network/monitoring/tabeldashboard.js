import baseHttp from "./http"
import errorHandler
  from "@/datasource/network/errorHandler"

const MAHASISWA_URL = "/mahasiswa"

const getProgressSubtugasByNIM = async (NIM, startDur, endDur) => {
  return new Promise((resolve) => {
    try {
      const mahasiswaURL = MAHASISWA_URL + `/getProgressSubtugasMahasiswaByNIM/${NIM}?start=${startDur}&end=${endDur}`
      // const result = await baseHttp.get(mahasiswaURL)
      // return result.data.data.progressSubtugas
      baseHttp.get(mahasiswaURL).then((result) => {
        resolve(result.data.data.progressSubtugas)
      })
    } catch (e) {
      errorHandler(e)
    }
  })
}

const getMahasiswa = async () => {
  return new Promise((resolve) => {
    try {
      const mahasiswaURL = MAHASISWA_URL + `/AllMahasiswa`
      baseHttp.get(mahasiswaURL).then((result) => {
        resolve(result.data.data.mahasiswa)
      })
    } catch (e) {
      errorHandler(e)
    }
  })
}

export default {
  getProgressSubtugasByNIM,
  getMahasiswa
}
