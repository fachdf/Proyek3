import baseHttp from "./http"
import errorHandler
  from "@/datasource/network/errorHandler"

const MONITORING_URL = "/mahasiswa"

const getMahasiswa = async () => {
  try {
    const monitoringURL = MONITORING_URL + `/AllMahasiswa`
    const result = await baseHttp.get(monitoringURL)
    return result.data.data.mahasiswa
  } catch (e) {
    return await errorHandler(e)
  }
}

export default {
  getMahasiswa
}
