<template>
  <div>
    <div class="v-item-group theme--light v-slide-group v-tabs-bar v-tabs-bar--is-mobile justify-space-between">
              <button @click="buttonTabEvent"
                v-for="(day, index) in days"
                :key="day"
                :id="index"
                class="v-btn v-btn--has-bg v-size--x-large rounded-lg font-weight-bold tab mr-2 mb-3 tab">
                {{ day }}
              </button>
    </div>
    <v-tabs-items v-model="tab" class="overflow-visible mt-10">
      <v-tab-item
        v-for="(hari, index) in jadwals"
        :key="index"
      >
        <v-sheet  v-for="(matkul, index) in hari" :key="index">
          <v-card class="pa-4 flex-no-wrap"  v-for="(item, index) in matkul.Jadwals" :key="index">
            <v-sheet rounded="lg" class="pa-4 col-12" :class="item.jenis === 'PR' ? 'orange lighten-4': 'green lighten-4'">
              <div class="rounded-lg text-h4 text-center white font-weight-bold mx-16">
                {{item.ja}} - {{item.jb}}
              </div>
            </v-sheet>
            <v-sheet class="col-12 pl-0 pa-0 pt-3">
              <div class="d-flex flex-no-wrap mb-md-13 mb-sm-7">
                <v-col class="pa-0 pe-3 col-6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on" class="text-h6 text-truncate font-weight-bold mb-1" style="cursor:default">{{ matkul.nama_mata_kuliah }}</div>
                    </template>
                    <span>{{ matkul.nama_mata_kuliah }}</span>
                  </v-tooltip>
                  <v-sheet class="d-flex flex-no-wrap align-center" style="gap:1rem">
                    <v-card-subtitle class="text-body-2" style="padding:0">{{matkul.id_mata_kuliah}}</v-card-subtitle>
                    <v-card-subtitle class="text-subtitle-2 font-weight-bold" style="color:#232323; padding:0">{{item.jenis === "PR" ? matkul.sks_praktek: matkul.sks_teori}} SKS</v-card-subtitle>
                  </v-sheet>
                </v-col>
                <v-col class="pa-0 pt-1">
                  <v-sheet class="d-flex justify-space-between flex-column align-end">
                    <v-sheet class="rounded-lg grey lighten-2 px-3 py-1">
                      <span class="text-caption font-weight-bold">{{item.waktu_mulai.split(":")[0]+":"+item.waktu_mulai.split(":")[1]}} </span>
                      <span class="text-caption">- {{item.waktu_selesai.split(":")[0]+":"+item.waktu_selesai.split(":")[1]}} (WIB)</span>
                    </v-sheet>
                  </v-sheet>
                </v-col>
              </div>
              <div class="d-flex flex-column">
                <div class="text-h6 mb-3 pt-5">Dosen Pengampu:</div>
                <div class="d-flex flex-row-nowrap justify-space-between mb-3">
                  <v-sheet class="d-flex flex-wrap justify-start align-center" style="gap:0.5rem">
                    <div class="rounded-pill green grey lighten-2 px-3 py-1 text-truncate">
                      {{item.nama_dosen}}
                    </div>
                  </v-sheet>
                </div>
                <v-layout align-end justify-end>
                  <div class="rounded-lg px-5 text-center text-h6" :class="item.jenis === 'PR' ? 'orange lighten-4': 'green lighten-4'">{{item.jenis === "PR" ? "Praktek": "Teori"}}</div>
                </v-layout>
              </div>
            </v-sheet>
          </v-card>
        </v-sheet>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import JadwalMataKuliah from "../../../../datasource/network/monitoring/jadwalMataKuliahWaliDosen"
export default {
  name: "MobileTabMataKuliah",
  data () {
    return {
      tab: 0,
      days: ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT"],
      jadwals: [],
      namaMatKul: []
    }
  },
  mounted () {
    this.days.forEach((hari, hariIndex) => {
      JadwalMataKuliah.getJadwalMataKuliah(hariIndex + 1).then((result) => {
        // this.jadwals.push(result)
        var temp = []
        result.forEach((matkul, matkulIndex) => {
          temp.push(JadwalMataKuliah.getNamaMataKuliah(matkul.id_mata_kuliah))
        })
        Promise.all(temp).then((res) => {
          res.forEach((infoMatkul, infoMatkulIndex) => {
            result[infoMatkulIndex].nama_mata_kuliah = res[infoMatkulIndex].nama_mata_kuliah
            result[infoMatkulIndex].sks_teori = res[infoMatkulIndex].sks_teori
            result[infoMatkulIndex].sks_praktek = res[infoMatkulIndex].sks_praktek
            result[infoMatkulIndex].Jadwals.forEach((jadwal, jadwalIndex) => {
              var temp2 = []
              temp2.push(JadwalMataKuliah.getNamaDosen(jadwal.nip))
              Promise.all(temp2).then((dosenRes) => {
                dosenRes.forEach((dosen) => {
                  jadwal.nama_dosen = dosen.nama_dosen
                })
              })
            })
          })
          this.jadwals.push(result)
        })
      })
    })
  },
  methods: {
    buttonTabEvent (event) {
      console.log(event.target.id)
      this.tab = parseInt(event.target.id)
    }
  }
}
</script>

<style scoped>
  .text-caption{font-size: 14px;}
  .v-slide-group{display: inline-block;}
  .tab {filter: drop-shadow(0px 4px 0px rgba(0, 0, 0, 0.25));background-color:#FFFFFF;}
  .tab:focus{color: #727272; background-color:#F7F7F7; filter: none;}
</style>
