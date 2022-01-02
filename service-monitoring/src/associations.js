import mataKuliah from './models/Mata_Kuliah'
import programStudi from './models/Program_Studi'
import mahasiswa from './models/Mahasiswa'
import kelas from './models/Kelas'
import perkuliahan from './models/Perkuliahan'
import dosen from './models/Dosen'
import jabatan from './models/Jabatan'
import jurusan from './models/Jurusan'
import tugas from './models/Tugas'
import subtugas from './models/Subtugas'
import studi from './models/Studi'

const setAssociations = () => {
  programStudi.hasMany(mataKuliah, {
    foreignKey: 'kode_program_studi'
  })
  // mahasiswa.belongsToMany(perkuliahan, {
  //   through: 'Studi'
  // })
  kelas.hasMany(mahasiswa, {
    foreignKey: 'kode_kelas'
  })
  kelas.hasMany(perkuliahan, {
    foreignKey: 'kode_kelas'
  })
  mataKuliah.hasMany(perkuliahan, {
    foreignKey: 'id'
  })
  perkuliahan.hasMany(studi, {
    foreignKey: 'id'
  })
  mahasiswa.hasMany(studi, {
    foreignKey: 'id_mahasiswa'
  })
  dosen.belongsToMany(perkuliahan, {
    through: 'Pengajar'
  })
  perkuliahan.belongsToMany(dosen, {
    through: 'Pengajar'
  })
  dosen.hasMany(kelas, {
    foreignKey: 'nip'
  })
  dosen.hasMany(programStudi, {
    foreignKey: 'nip'
  })
  dosen.hasMany(jurusan, {
    foreignKey: 'nip'
  })
  // dosen.hasMany(jabatan, {
  //   through: 'menjabat'
  // })
  // jabatan.hasOne(dosen, {
  //   foreignKey: 'id_jabatan'
  // })
  programStudi.hasMany(mataKuliah, {
    foreignKey: 'kode_program_studi'
  })
  programStudi.hasMany(kelas, {
    foreignKey: 'kode_program_studi'
  })
  jurusan.hasMany(programStudi, {
    foreignKey: 'kode_jurusan'
  })
  perkuliahan.hasMany(tugas, {
    foreignKey: 'id_perkuliahan'
  })
  studi.hasMany(subtugas, {
    foreignKey: 'id_studi'
  })
  tugas.hasMany(subtugas, {
    foreignKey: 'id_tugas'
  })
  // subtugas.belongsToMany(kriteria, {
  //   through: 'id_subtugas'
  // })
  // mahasiswa.belongsToMany(kriteria, {
  //   through: 'id_mahasiswa'
  // })
}

export default setAssociations