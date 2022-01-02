import * as PengajarDAO from '../dao/Pengajar'
import * as PerkuliahaDAO from '../dao/Perkuliahan'
import * as KelasDAO from '../dao/Kelas'
import { validationResult } from 'express-validator/check'

export const getKelasAjarByDosen = async (req, res) => {
    try {
        const nip = req.params.nip
        const pengajar = await PengajarDAO.findPengajarByNIP(nip)
        var i
        var listIdPerkuliahan = []
        var listKelas = []
        for (i = 0; i < pengajar.length; i++){
            var idPerkuliahan = pengajar[i].id_perkuliahan
            listIdPerkuliahan.push(idPerkuliahan)
        }
        for (i = 0; i < listIdPerkuliahan.length; i++){
            var perkuliahan = await PerkuliahaDAO.findPerkuliahanById(listIdPerkuliahan[i])
            var kelas = await KelasDAO.findKelasByKodeKelas(perkuliahan.kode_kelas)
            listKelas.push(kelas)
        }

        const seen = new Set();

        const uniqueClass = listKelas.filter(data => {
            const duplicate = seen.has(data.kode_kelas);
            seen.add(data.kode_kelas);
            return !duplicate;
        });
        
        res.status(200).json({
            message: 'get matkul by dosen sukses',
            data: {
                uniqueClass
            }
        })
    }
    catch (error) {
        res.status(error.status || 500).json({ error })
    }
}