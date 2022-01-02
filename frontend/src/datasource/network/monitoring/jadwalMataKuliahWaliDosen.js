import axios from "axios"
import errorHandler
  from "@/datasource/network/errorHandler"

const NETWORK_TIMEOUT = 10000
const AUTH_URL = process.env.VUE_APP_AKUN_API_URL
const baseHttp = axios.create({
  baseURL: AUTH_URL,
  timeout: NETWORK_TIMEOUT
})

const MONITORING_URL_1 = "/jadwal/kelas"
const MONITORING_URL_2 = "/mata-kuliah"
const MONITORING_URL_3 = "/dosen/get-one"

const getJadwalMataKuliah = (hari) => {
  return new Promise((resolve) => {
    try {
      const monitoringURL = MONITORING_URL_1 + `/1803?hari=` + hari
      baseHttp.get(monitoringURL).then((result) => {
        resolve(result.data.data)
      })
    } catch (e) {
      errorHandler(e)
    }
  })
}

const getNamaMataKuliah = async (kode) => {
  return new Promise((resolve) => {
    try {
      const monitoringURL = MONITORING_URL_2 + `/` + kode
      baseHttp.get(monitoringURL).then((result) => {
        resolve(result.data.data)
      })
    } catch (e) {
      errorHandler(e)
    }
  })
}

const getNamaDosen = async (nip) => {
  return new Promise((resolve) => {
    try {
      const monitoringURL = MONITORING_URL_3 + `/` + nip
      baseHttp.get(monitoringURL).then((result) => {
        resolve(result.data.data)
      })
    } catch (e) {
      errorHandler(e)
    }
  })
}

export default {
  getJadwalMataKuliah,
  getNamaMataKuliah,
  getNamaDosen
}
