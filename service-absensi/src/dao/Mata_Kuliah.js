import MataKuliah from '../models/mata_kuliah'

export const findMataKuliahByIdMatkul = async (idMataKuliah) => {
  try {
    const mataKuliah = await MataKuliah.findByPk(idMataKuliah)
    return mataKuliah
  } catch (error) {
    return Promise.reject(error)
  }
}
