import express from 'express'
import * as DosenController from '../controller/Dosen'
import * as ValidatorSanitizer from '../middleware/InputValidatorSanitizer'

const router = express.Router()

router.get('/get-one/:NIP', DosenController.getDosenByNIP)
router.get('/all-dosen', DosenController.getAllDosen)
router.get('', DosenController.getDosenByJabatan)
router.post('/new-dosen', ValidatorSanitizer.postNewDosen, DosenController.postNewDosen)
router.delete('/delete/:NIP', DosenController.deleteDosenByNIP)
// New Router From 19
router.get('/get/:NIP', DosenController.getDosenTertentu)
//
export default router
