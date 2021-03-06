import { insertOneDosen } from '../dao/Dosen'
import { insertOneMahasiswa } from '../dao/Mahasiswa'
import expressValidator from 'express-validator/check'
const { validationResult } = expressValidator
import { getAdminClient, adminAuth } from '../config/keycloak-admin'
import uuIdv4 from 'uuidv4';
const { uuid } = uuIdv4;

export const createUser = async (req, res, next) => {
  try {
    const kcAdminClient = getAdminClient()
    await adminAuth(kcAdminClient)

    const error = validationResult(req)
    if (!error.isEmpty()) {
      error.status = 400
      throw error
    }

    const { noInduk, jenisNoInduk, nama, email, role } = req.body
    let result

    if (jenisNoInduk === 'nim' && role === 'mahasiswa') {
      result = await insertOneMahasiswa(noInduk, nama, null, email, null, null)

      if (typeof result === 'undefined') {
        const error = new Error('Insert Mahasiswa ke pg gagal')
        error.statusCode = 500
        error.cause = 'Insert Mahasiswa ke pg gagal'
        throw error
      }
    } else if (jenisNoInduk === 'nip' && role === 'dosen') {
      result = await insertOneDosen(noInduk, nama)
      if (typeof result === 'undefined') {
        const error = new Error('Insert dosen ke pg gagal')
        error.statusCode = 500
        error.cause = 'Insert dosen ke pg gagal'
        throw error
      }
    }

    const tempPassword = uuid() // this is random password for keycloak

    const resultInsertToKc = await kcAdminClient.users.create({
      realm: 'Polban-Realm',
      username: noInduk,
      email: email,
      enabled: true,
      credentials: [
        {
          temporary: false,
          type: 'password',
          value: tempPassword
        }
      ],
      attributes: {
        noInduk: noInduk,
        mail: email,
        uname: noInduk,
        role: role,
        isActive: true
      }
    })
    result.dataValues.idUserKc = resultInsertToKc.id

    result.dataValues.tempPwdKc = tempPassword

    res.status(200).json({
      status: res.statusCode,
      message: 'insert user sukses',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const getAllUser = async (req, res, next) => {
  try {
    const kcAdminClient = getAdminClient()
    await adminAuth(kcAdminClient)

    const roleParams = req.query.role || ''
    const key = req.query.key || ''
    const page = req.query.page || 1
    const perPage = req.query.perpage || 10

    const result = await kcAdminClient.users.find({
      realm: 'Polban-Realm'
    })
    const resultFiltered = []

    for (const elementData of result) {
      const cond1 =
        elementData.attributes.role[0].toLowerCase() ===
        roleParams.toLowerCase()
      const cond2 = elementData.username
        .toLowerCase()
        .includes(key.toLowerCase())
      const cond3 = elementData.email.toLowerCase().includes(key.toLowerCase())
      if (cond1 && (cond2 || cond3)) {
        resultFiltered.push(elementData)
      }
    }

    res.status(200).json({
      status: res.statusCode,
      message: 'Success retrieve all user data',
      data: resultFiltered.slice((page - 1) * perPage, page * perPage)
    })
  } catch (error) {
    next(error)
  }
}

// export const deleteUserbyUsername = async (req, res, next) => {
//   try {
//     //  Disini ditulis kode hapus user pada data keycloak (Dikerjakan oleh tim framework)
//     //  Menghapus data akun di pg (backend)

//     const { username } = req.params
//     const resultDeleteAkun = await deleteAkunByUsername(username)
//     if (resultDeleteAkun === 1) {
//       res.status(200).json({
//         message: 'Delete akun berhasil',
//         data: {
//           username
//         }
//       })
//     } else {
//       const error = new Error('Delete akun dari pg gagal')
//       error.statusCode = 500
//       error.cause = 'Delete akun dari pg gagal'
//       throw error
//     }
//   } catch (error) {
//     next(error)
//   }
// }
