<template>
  <div>
    <v-row
      :style="{color: currentTheme.onBackground}"
      v-if="!isMobile"
    >
      <v-col cols="12" class="pb-1">
        <breadcumbs :breadcrumb-items="breadcrumbItems"/>
      </v-col>
      <v-col cols="12" class="mb-1">
        <v-card elevation="0">
          <p class="text-md-h3 text-sm-h4 font-weight-bold">Jadwal Mata Kuliah</p>
          <p class="mb-6">
            <span class="text-md-h5 text-sm-h6 font-weight-bold">Kelas D4 - 3A Semester 5</span>
            <span class="text-md-h5 text-sm-h6 font-weight-regular"> Tahun ajaran 2021/2022</span>
          </p>
          <v-card-text class="text-h6 font-weight-regular pa-0 mb-md-4 mb-sm-2">Pilih hari:</v-card-text>
          <div class="v-item-group theme--light v-slide-group v-tabs-bar v-tabs-bar--is-mobile justify-space-between">
            <button @click="buttonTabEvent"
              v-for="(day, index) in days"
              :key="day"
              :id="index"
              class="v-btn v-btn--has-bg theme--light v-size--x-large rounded-lg font-weight-bold tab">
            {{ day }}
            </button>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" class="py-5">
        <v-tabs-items v-model="tab" class="overflow-visible">
          <v-tab-item
            v-for="(hari, index) in jadwals"
            :key="index"
          >
            <v-sheet v-for="(matkul, index) in hari" :key="index">
              <v-card class="pa-5 d-flex flex-no-wrap mb-3" v-for="(item, index) in matkul.Jadwals" :key="index">
                <v-sheet rounded="lg" :class="item.jenis === 'PR' ? 'orange lighten-4 green lighten-4': 'green lighten-4'" class="pa-3 col-md-2 col-sm-3">
                    <div class="rounded-lg px-md-6 px-sm-3 py-sm-1 py-md-7 text-h4 text-center white font-weight-bold">
                      {{item.ja}} - {{item.jb}}
                    </div>
                </v-sheet>
                <v-sheet class="col-md-10 col-sm-9 pl-5 pa-0">
                  <div class="d-flex flex-no-wrap mb-md-13 mb-sm-7">
                    <v-col class="pa-0 col-7">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on" class="text-truncate font-weight-bold mb-1" style="cursor:default" :style="[isMobile ? {'font-size':'1.125rem'} : isPad ? {'font-size':'1.5rem'} : {'font-size':'1.875rem'}]">{{ matkul.nama_mata_kuliah }}</div>
                        </template>
                        <span>{{ matkul.nama_mata_kuliah }}</span>
                      </v-tooltip>
                      <v-sheet class="d-flex flex-no-wrap align-center" style="gap:1rem">
                        <v-card-subtitle :style="[isMobile ? {'font-size':'0.75rem'} : isPad ? {'font-size':'0.875rem'} : {'font-size':'1.125rem'}]" style="padding:0">{{matkul.id_mata_kuliah}}</v-card-subtitle>
                        <v-card-subtitle class="font-weight-bold" :style="[isMobile ? {'font-size':'0.75rem'} : isPad ? {'font-size':'1rem'} : {'font-size':'1.125rem'}]" style="color:#232323; padding:0">{{item.jenis === "PR" ? matkul.sks_praktek: matkul.sks_teori}} SKS</v-card-subtitle>
                      </v-sheet>
                    </v-col>
                    <v-col class="pa-0 ">
                      <v-sheet class="d-flex justify-space-between flex-column align-end">
                        <v-sheet class="rounded-lg grey lighten-2 px-3 py-1">
                          <span class="font-weight-bold" :style="isPad?{'font-size':'1rem'}:{'font-size':'1.5rem'}">{{item.waktu_mulai.split(":")[0]+":"+item.waktu_mulai.split(":")[1]}} </span>
                          <span :style="isPad?{'font-size':'1rem'}:{'font-size':'1.5rem'}">- {{item.waktu_selesai.split(":")[0]+":"+item.waktu_selesai.split(":")[1]}} (WIB)</span>
                        </v-sheet>
                      </v-sheet>
                    </v-col>
                  </div>
                  <div class="d-flex flex-column">
                      <div class="mb-3" :style="[isMobile ? {'font-size':'0.875rem'} : {'font-size':'1.125rem'}]">Dosen Pengampu:</div>
                      <div class="d-flex flex-row-nowrap justify-space-between">
                        <v-sheet class="d-flex flex-wrap justify-start align-center" style="gap:1rem">
                          <div class="rounded-pill green grey lighten-2 px-4 py-2 text-truncate" :style="[isMobile ? {'font-size':'0.75rem'} : isPad ? {'font-size':'0.75rem'} : {'font-size':'1rem'}]">
                            {{item.nama_dosen}}
                          </div>
                        </v-sheet>
                        <div class="d-flex align-center rounded-lg px-4 text-center" :class="item.jenis === 'PR' ? 'orange lighten-4': 'green lighten-4'" style="font-weight:600" :style="[isMobile ? {'font-size':'1.125rem'} : isPad ? {'font-size':'1.125rem'} : {'font-size':'1.25rem'}]">{{item.jenis === "PR" ? "Praktek": "Teori"}}</div>
                      </div>
                  </div>
                </v-sheet>
              </v-card>
            </v-sheet>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" class="pb-1">
        <breadcumbs :breadcrumb-items="breadcrumbItems"/>
      </v-col>
      <v-col cols="12">
        <v-card elevation="0">
          <p class="mb-0 text-h4 font-weight-bold">Jadwal Mata Kuliah</p>
          <p class="mb-5">
            <span class="text-body-2 font-weight-bold">Kelas D4 - 3A Semester 5</span>
            <span class="text-body-2 font-weight-regular"> Tahun ajaran 2021/2022</span>
          </p>
          <mobile-tabs-mata-kuliah />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Breadcumbs from "@/views/shared/navigation/Breadcumbs"
import MobileTabsMataKuliah from "../../component/dosen-wali/MobileTabsMataKuliah.vue"
import JadwalMataKuliah from "../../../../datasource/network/monitoring/jadwalMataKuliahWaliDosen"

export default {
  name: "JadwalMataKuliah",
  components: { Breadcumbs, MobileTabsMataKuliah },
  data () {
    return {
      breadcrumbItems: [
        {
          text: "Monitoring",
          disabled: false,
          href: ""
        },
        {
          text: "Jadwal Mata Kuliah",
          disabled: true,
          href: ""
        }
      ],
      tab: 0,
      days: ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT"],
      jadwals: [],
      namaMatKul: []
    }
  },
  mounted () {
    this.days.forEach((hari, hariIndex) => {
      JadwalMataKuliah.getJadwalMataKuliah(hariIndex + 1).then((result) => {
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
  computed: {
    ...mapGetters({
      currentTheme: "theme/getCurrentColor",
      isDark: "theme/getIsDark"
    }),
    isMobile () {
      return this.$vuetify.breakpoint.xs
    },
    isPad () {
      return this.$vuetify.breakpoint.sm
    },
    identity: function () {
      return this.$store.getters.identity
    }
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
.tab {filter: drop-shadow(0px 7px 0px rgba(0, 0, 0, 0.25));background-color:white;}
.tab:hover{background-color:#525364;}
.tab:focus{background-color:#F7F7F7;filter: drop-shadow(0px 0px 0px rgba(0, 0, 0, 0))}
</style>
