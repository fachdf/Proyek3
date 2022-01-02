import * as MahasiswaDAO from '../dao/Mahasiswa'
import { validationResult } from 'express-validator/check'

export const postNewMahasiswa = async (req, res, next) => {
  try {
    const {
      NIM,
      namaMahasiswa,
      angkatan,
      tingkat,
      email,
      nomorHp,
      urlFoto,
      status,
      username
    } = req.body
    const error = validationResult(req)

    if (!error.isEmpty()) {
      error.status = 400
      throw error
    }

    const mahasiswa = await MahasiswaDAO.insertOneMahasiswa(
      NIM,
      namaMahasiswa,
      parseInt(angkatan),
      parseInt(tingkat),
      email,
      nomorHp,
      urlFoto,
      status,
      username
    )

    if (typeof mahasiswa === 'undefined') {
      error.status = 500
      error.message = 'Insert Mahasiswa gagal'
      throw error
    }

    res.status(200).json({
      message: 'insert mahasiswa sukses',
      data: {
        mahasiswa
      }
    })
  } catch (error) {
    next(error)
  }
}

export const updateNomorHpMahasiswa = async (req, res, next) => {
  try {
    const { NIM } = req.params
    const updateMahasiswa = await MahasiswaDAO.updateNomorHpMahasiswa(NIM, req.body.nomorHP)
    if (updateMahasiswa === 1) {
      const mahasiswa = await MahasiswaDAO.findMahasiswaByNIM(NIM)
      res.status(200).json({
        message: 'Update Nomor HP Mahasiswa berhasil',
        data: {
          mahasiswa
        }
      })
    } else {
      const error = new Error('Update Nomor HP gagal')
      error.statusCode = 500
      error.cause = 'Update Nomor HP gagal'
      throw error
    }
  } catch (error) {
    next(error)
  }
}

export const deleteMahasiswabyId = async (req, res, next) => {
  try {
    const mahasiswaId = req.params.id_mahasiswa
    const result = await MahasiswaDAO.deleteMahasiswabyId(mahasiswaId)
    if (result === 1) {
      res.status(200).json({
        message: 'Delete mahasiswa berhasil',
        data: {
          mahasiswaId
        }
      })
    } else {
      const error = new Error('Delete mahasiswa gagal')
      error.statusCode = 500
      throw error
    }
  } catch (error) {
    next(error)
  }
}

export const getAllMahasiswa = async (req, res, next) => {
  try {
    const mahasiswa = await MahasiswaDAO.findAllMahasiswa()
    res.status(200).json({
      message: 'get all mahasiswa success',
      data: {
        mahasiswa
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getOneMahasiswaByNIM = async (req, res, next) => {
  try {
    const { NIM } = req.params
    const mahasiswa = await MahasiswaDAO.findOneMahasiswaByNIM(NIM)
    res.status(200).json({
      message: 'get one Mahasiswa by NIM success',
      data: {
        mahasiswa
      }
    })
  } catch (error) {
    next(error)
  }
}

export const searchMahasiswaByName = async (req, res, next) => {
  try {
    const { nama } = req.params
    const mahasiswa = await MahasiswaDAO.findMahasiswaByName(nama)
    res.status(200).json({
      message: 'find Mahasiswa by name success',
      data: {
        mahasiswa
      }
    })
  } catch (error) {
    next(error)
  }
}

export const searchMahasiswaByNIM = async (req, res, next) => {
  try {
    const { NIM } = req.params
    const mahasiswa = await MahasiswaDAO.findMahasiswaByNIM(NIM)
    res.status(200).json({
      message: 'find Mahasiswa by NIM success',
      data: {
        mahasiswa
      }
    })
  } catch (error) {
    next(error)
  }
}

export const searchMahasiswaByClass = async (req, res, next) => {
  try {
    const { kode_kelas } = req.params
    const mahasiswa = await MahasiswaDAO.findMahasiswaByClass(kode_kelas)
    res.status(200).json({
      message: 'find Mahasiswa by class success',
      data: {
        mahasiswa
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getRekapSubtugasMahasiswaById = async (req, res, next) => {
  try {
    const { NIM } = req.params
    const rekapTugas = await MahasiswaDAO.getRekapSubtugasById(NIM)
    res.status(200).json({
      message: 'get rekap subtugas Mahasiswa by Id success',
      data: {
        rekapTugas
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getProgressSubtugasByNIM = async (req, res, next) => {
  try {
    const { NIM } = req.params;
    const startDuration = new Date(req.query.start);
    const endDuration = new Date(req.query.end);
    var progressSubtugas = [];

    var incrementDate = new Date(req.query.start)
    incrementDate.setDate(incrementDate.getDate() + 7);
    while (incrementDate.getTime() < endDuration.getTime()) {
      const tugasselesai = await MahasiswaDAO.getTugasSelesaiByNIM(NIM, startDuration, incrementDate);
      const alltugas = await MahasiswaDAO.getSemuaTugasByNIM(NIM, startDuration, incrementDate);

      const progress = tugasselesai[0] == undefined ? 0 : (tugasselesai[0].jml_tugas / alltugas[0].jml_tugas);
      progressSubtugas.push(progress);

      // add date to next week
      incrementDate.setDate(incrementDate.getDate() + 7);
    }
    
    res.status(200).json({
      message: 'get progress subtugas Mahasiswa by Id success',
      data: {
        progressSubtugas
      }
    })
  } catch (error) {
    next(error)
  }
}