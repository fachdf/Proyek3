import axios from "axios"
import errorHandler
  from "@/datasource/network/errorHandler"

const NETWORK_TIMEOUT = 10000
const AUTH_URL = "http://localhost:14418/"
const instance = axios.create({
  baseURL: AUTH_URL,
  timeout: NETWORK_TIMEOUT
})
const getJadwalMatakuliah = async () => {
  try {
    const monitoringUrl = "/jadwal/kelas/1803?hari=" + new Date().getDay()
    const result = await instance.get(monitoringUrl)
    return result.data.data
  } catch (e) {
    return await errorHandler(e)
  }
}
const getNamaMataKuliah = async (kodeMataKuliah) => {
  try {
    const monitoringUrl = `mata-kuliah/${kodeMataKuliah}`
    const result = await instance.get(monitoringUrl)
    return result.data.data.nama_mata_kuliah
  } catch (e) {
    return await errorHandler(e)
  }
}
const getNamaDosen = async (nip) => {
  try {
    const monitoringUrl = `dosen/get-one/${nip}`
    const result = await instance.get(monitoringUrl)
    return result.data.data.nama_dosen
  } catch (e) {
    return await errorHandler(e)
  }
}

export default {
  getJadwalMatakuliah,
  getNamaMataKuliah,
  getNamaDosen
}
