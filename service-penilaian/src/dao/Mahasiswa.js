import Mahasiswa from '../models/Mahasiswa'
import sequelize from '../db.js'
import Subtugas from '../models/Subtugas'
import Studi from '../models/Studi'

import Sequelize from 'sequelize'

const Op = Sequelize.Op

export const findOneMahasiswaByNIM = async (nim) => {
  try {
    const mahasiswa = await Mahasiswa.findAll({
      where: {
        nim: nim
      }
    })
    return mahasiswa[0]
  } catch (error) {
    console.error(error)
  }
}

export const findAllMahasiswa = async () => {
  try {
    const mahasiswa = await Mahasiswa.findAll({
      order: [['nim', 'ASC']]
    })
    return mahasiswa
  } catch (error) {
    return Promise.reject(new Error('Get all mahasiswa'))
  }
}

export const findMahasiswaByName = async (nama) => {
  try {
    const mahasiswa = await Mahasiswa.findAll({
      where: {
        nama_mahasiswa: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('nama_mahasiswa')),
          'LIKE',
          '%' + nama.toLowerCase() + '%'
        )
      },
      order: [['nama_mahasiswa', 'ASC']]
    })
    return mahasiswa
  } catch (error) {
    console.error(error)
  }
}

export const findMahasiswaByNIM = async (NIM) => {
  try {
    const mahasiswa = await Mahasiswa.findAll({
      where: {
        NIM: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('NIM')),
          'LIKE',
          '%' + NIM.toLowerCase() + '%'
        )
      },
      order: [['NIM', 'ASC']]
    })
    return mahasiswa
  } catch (error) {
    console.error(error)
  }
}

export const insertOneMahasiswa = async (
  NIM,
  namaMahasiswa,
  kodeKelas,
  email,
  nomorHp,
  urlFoto
) => {
  try {
    const mahasiswa = await Mahasiswa.create({
      nim: NIM,
      nama: namaMahasiswa,
      kode_kelas: kodeKelas,
      email,
      nomor_ponsel: nomorHp,
      url_foto: urlFoto
    })
    return mahasiswa
  } catch (error) {
    console.error(error)
  }
}

export const updateNomorHpMahasiswa = async (NIM, nomorHP) => {
  try {
    const mahasiswa = await Mahasiswa.update(
      {
        nomor_hp: nomorHP
      },
      {
        where: {
          NIM
        },
        silent: true
      }
    )
    return mahasiswa[0]
  } catch (error) {
    console.error(error)
  }
}

export const deleteMahasiswabyId = async (mahasiswaId) => {
  try {
    const result = await Mahasiswa.destroy({
      where: {
        id_mahasiswa: mahasiswaId
      }
    })
    return result
  } catch (error) {
    console.log(error)
  }
}

export const findMahasiswaByClass = async (kode_kelas) => {
  try {
    const mahasiswa = await Mahasiswa.findAll({
      where: {
        kode_kelas
      },
      order: [['nama_mahasiswa', 'ASC']]
    })
    return mahasiswa
  } catch (error) {
    console.error(error)
  }
}

export const getRekapSubtugasById = async (nim) => {
  try {
    const tugastelat = await Mahasiswa.findAndCountAll({
      include: [{
        model: Studi,
        include: [{
          model: Subtugas,
          where: { status_subtugas: 'f', tenggat: { [Op.lt]: new Date() } }
        }]
      }],
      where: {
        nim: nim.toString()
      }
    })

    const alltugas = await Mahasiswa.findAndCountAll({
      include: [{
        model: Studi,
        include: [{
          model: Subtugas,
          where: { tenggat: { [Op.lt]: new Date() } }
        }]
      }],
      where: {
        nim: nim.toString()
      }
    })

    const rekap = { 'tugas_telat': tugastelat.count, 'semua_tugas': alltugas.count, 'persentase': ((alltugas.count - tugastelat.count) / alltugas.count) * 100 }

    return rekap
  } catch (error) {
    console.error(error)
  }
}

export const getTugasSelesaiByNIM = async (nim, startDuration, endDuration) => {
  try {
    const tugasselesai = await sequelize.query(
      ' SELECT mhs.nim, count(sub_tgs.status_subtugas) "jml_tugas" FROM "Mahasiswa" mhs LEFT JOIN "Studi" std ON (mhs.nim = std.id_mahasiswa) LEFT JOIN "Subtugas" sub_tgs ON (sub_tgs.id_studi = std.id) WHERE mhs.nim = ? AND sub_tgs.status_subtugas = \'t\' AND sub_tgs.tenggat > ? AND sub_tgs.tenggat  < ? GROUP BY mhs.nim',
      {
        replacements: [nim, startDuration, endDuration],
        type: sequelize.QueryTypes.SELECT
      }
    );

    return tugasselesai
  } catch (error) {
    console.error(error)
  }
}

export const getSemuaTugasByNIM = async (nim, startDuration, endDuration) => {
  try {
    const alltugas = await sequelize.query(
      ' SELECT mhs.nim, count(sub_tgs.status_subtugas) "jml_tugas" FROM "Mahasiswa" mhs LEFT JOIN "Studi" std ON (mhs.nim = std.id_mahasiswa) LEFT JOIN "Subtugas" sub_tgs ON (sub_tgs.id_studi = std.id) WHERE mhs.nim = ? AND sub_tgs.tenggat > ? AND sub_tgs.tenggat  < ? GROUP BY mhs.nim',
      {
        replacements: [nim, startDuration, endDuration],
        type: sequelize.QueryTypes.SELECT
      }
    );

    return alltugas
  } catch (error) {
    console.error(error)
  }
}