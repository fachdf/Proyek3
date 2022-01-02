<template>
  <v-card
    class="font-weight-bold rounded-lg px-1"
    outlined
  >
    <div class="text-right">
      <v-btn
        plain
        text
        class="text-caption-md font-weight-bold text-none pt-2"
        href="list-mahasiswa"
      >
        Lihat semua &#8594;
      </v-btn>
    </div>
    <v-list>
      <template
        v-for="(item, index) in matkul_today"
      >
        <v-list-item
          v-for="(detailMatkul, detailMatkulIndex) in item.Jadwals"
          :key="detailMatkul.id_jadwal"
          class="tile"
          :style="isMobile? 'max-height: 73px;' : 'max-height: 82px; max-width: 337px'"
        >
          <v-list-item-title class="text-h5 text-center font-weight-black" style="max-width: 70px;">
            {{ detailMatkul.ja }} - {{ detailMatkul.jb }}
          </v-list-item-title>
          <v-divider
            vertical
            class="mr-1"
          >
          </v-divider>
          <v-col :style="isMobile? 'color: #3A3A3A' : 'color: #3A3A3A; max-width: 170px'" class="text-lg-subtitle-1">
            <v-list-item-subtitle :class="isMobile? 'text-left font-weight-black' : 'text-left font-weight-black text-wrap'" :style="isMobile? '' : 'max-height: 34px; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow:hidden; text-overflow: ellipsis; display: -webkit-box;'">
              {{matkul_name[index][0]}}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="text-left" style="font-size: 13px">
              {{ matkul_name[index][1][detailMatkulIndex] }}
            </v-list-item-subtitle>
          </v-col>

          <v-list-item-subtitle class="text-right jamke-font-size pt-0">
            {{ detailMatkul.waktu_mulai }} - {{ detailMatkul.waktu_selesai }}
          </v-list-item-subtitle>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>
<script>
import JadwalMataKuliah from "../../../../datasource/network/monitoring/jadwal"
export default {
  data () {
    return {
      matkul_today: [],
      matkul_name: []
    }
  },
  computed: {
    isMobile () {
      return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs
    }
  },
  async mounted () {
    var matkul = await JadwalMataKuliah.getJadwalMatakuliah()
    this.matkul_today = matkul
    this.matkul_today.forEach(async (value, matkulIndex) => {
      var dosenName = []
      var namaMatkul = await JadwalMataKuliah.getNamaMataKuliah(value.id_mata_kuliah)
      value.Jadwals.forEach(async (matkul, index) => {
        var namaDosen = await JadwalMataKuliah.getNamaDosen(matkul.nip)
        dosenName.push(namaDosen)
      })
      this.matkul_name.push([namaMatkul, dosenName])
    })
  }
}
</script>
<style scoped>
  .tile {
    margin: 5px;
    border-radius: 10px;
    background: #E9E9E9;
    padding: 10px;
  }
  .tile:hover {
    background: #272343;
  }
  .tile:hover .text-left {
    color: #E9E9E9;
  }
  .tile:hover .text-right {
    color: #E9E9E9;
  }
  .tile:hover .text-center {
    color: #E9E9E9;
  }
  .jamke-font-size {
    font-size: 11px;
  }
</style>
