<template>
    <v-row :style="{color: currentTheme.onBackground}">
      <v-col cols="12">
        <breadcumbs :breadcrumb-items="breadcrumbItems"/>
      </v-col>
      <template>
        <v-col cols="12">
          <v-card
            color="#272343"
            class="mb-5 rounded-lg"
            width="100%"
          >
            <v-row
              class="justify-space-between"
            >
              <v-col
                :class="isPad? 'py-10 pl-10 white--text' : 'pa-10 white--text'"
                cols="8"
                :style="isPad? 'max-width: 440px' : ''"
              >
                <div>
                  <p :class="isPad? 'text-h4 font-weight-bold' : 'text-h3 font-weight-bold'">Hallo, {{ user.nama }}</p>
                  <p class="text-subtitle-1 mb-0 mt-5">Data di bawah ini merupakan data mahasiswa</p>
                  <p class="text-subtitle-1 ma-0"><b>Kelas D4-3A</b> Tahun Ajaran 2019</p>
                </div>
              </v-col>
              <div :class="isPad? 'mr-0' : 'mr-10'">
                <v-img :src="require('../../../../assets/vectorArt.png')" :height="isPad? 'auto' : '95%'" :width="isPad? '85%' : '95%'"/>
              </div>
            </v-row>
          </v-card>
        </v-col>
      </template>
      <v-col width="100%">
        <v-row>
          <!-- Table Section -->
          <v-col :cols="isPad? '12' : '8'" :style="isPad? 'max-width: 100%;' : 'max-width: 674px;'">
            <v-data-table
              :headers="headers"
              :items="listMahasiswa"
              :items-per-page="10"
              :style="{color: currentTheme.colorPrimary}"
              class="text-lg-subtitle-1 font-weight v-sheet--outlined rounded-lg"
              :custom-sort="sortAscending"
              :search="search"
              :custom-filter="searchMahasiswa"
            >
              <template v-slot:top>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  class="mx-4"
                ></v-text-field>
              </template>
              <template v-slot:[`item.basic_identity`]="{ item }">
                <v-row
                  class="py-6"
                  style="margin:0; gap:1.375rem"
                  justify="end">
                  <v-avatar
                    size="48">
                    <v-img
                      :src="item.url_foto"
                      position="start"
                    />
                  </v-avatar>
                  <v-col
                    style="padding:0">
                    <div>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on" class="text-truncate" style="cursor:default; max-width: 200px;">
                            {{ item.nama }}
                          </div>
                        </template>
                        <span>{{ item.nama }}</span>
                      </v-tooltip>
                    </div>
                    <div class="text-caption" style="color: #7B7B7B">
                      {{ item.nim }}
                    </div>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:[`item.graph_info`]="{item}">
                <v-col
                style="margin:0; padding:0"
                class="stackSheet"
                elevation="2"
                >
                  <v-sparkline
                    :fill="dataGraph.fill"
                    :gradient="dataGraph.positiveTugas"
                    :line-width="dataGraph.width"
                    :padding="dataGraph.padding"
                    :smooth="dataGraph.radius || false"
                    :value="item.graphTugas"
                    auto-draw
                  ></v-sparkline>
                  <v-sparkline
                    :fill="dataGraph.fill"
                    :gradient="dataGraph.negativePaham"
                    :line-width="dataGraph.width"
                    :padding="dataGraph.padding"
                    :smooth="dataGraph.radius || false"
                    :value="dataGraph.value1"
                    auto-draw
                    class="stackSpark"
                  ></v-sparkline>
                </v-col>
              </template>
              <template v-slot:[`item.tugasPersen`]="{ item }">
                <div v-if="isPositive(getPercentTugas(dataGraph.value1))">
                  <span style="color: #0FB551;">+{{ getPercentTugas(item.graphTugas) }}</span>
                </div>
                <div v-else>
                  <span style="color: #C42300;">{{ getPercentTugas(item.graphTugas) }}</span>
                </div>
              </template>
              <template v-slot:[`item.pahamPersen`]>
                <div v-if="isPositive(getPercentTugas(dataGraph.value1))">
                  <span style="color: #0FB551;">+{{ getPercentTugas(dataGraph.value1) }}</span>
                </div>
                <div v-else>
                  <span style="color: #C42300;">{{ getPercentTugas(dataGraph.value1) }}</span>
                </div>
              </template>
            </v-data-table>
            <template v-slot:no-data>
              <p
                :style="{color: currentTheme.colorPrimary}"
                class="text-lg-subtitle-1 font-weight-bold"
              >No Data Available
              </p>
            </template>
          </v-col>
          <v-col :cols="isPad? '12' : '5'" :style="!isPad? 'max-width: 380px' : ''">
            <!-- MATKUL SECTION -->
            <matkul/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
</template>

<script>
import { mapGetters } from "vuex"
import Breadcumbs from "@/views/shared/navigation/Breadcumbs"
import Matkul from "@/views/monitoring/component/dosen-wali/matkul"
import TabelDashboard from "../../../../datasource/network/monitoring/tabeldashboard"

const gradients = [
  ["#0FB551"],
  ["#C42300"],
  ["#39AEE0"],
  ["#FF922E"]
]

export default {
  name: "Dashboard",
  components: { Breadcumbs, Matkul },
  data () {
    return {
      user: {
        nama: "User",
        no_induk: "000",
        image: "#"
      },
      search: "",
      breadcrumbItems: [
        {
          text: "Monitoring",
          disabled: false,
          href: ""
        },
        {
          text: "Dashboard",
          disabled: true,
          href: ""
        }
      ],
      headers: [
        {
          text: "MAHASISWA",
          align: "start",
          value: "basic_identity",
          sortable: false
        },
        { text: "GRAPH", value: "graph_info", sortable: false },
        { text: "% TUGAS", align: "center", value: "tugasPersen", sortable: false },
        { text: "% PAHAM", align: "center", value: "pahamPersen", sortable: false }
      ],
      listMahasiswa: [
      ],
      dataGraph: {
        fill: false,
        positiveTugas: gradients[0],
        negativeTugas: gradients[1],
        positivePaham: gradients[2],
        negativePaham: gradients[3],
        gradients,
        padding: 0,
        radius: 0,
        value1: [],
        value2: [],
        width: 10
      }
    }
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
  created () {
    // this.user.nama = this.identity.given_name
    const tasks = []
    if (this.$route.meta.requiresAuth) {
      tasks.push(this.waitAuthenticated())
    }
    Promise.all(tasks).then(result => {
      this.isLoading = false
      this.user.nama = this.identity.given_name
      console.log("User logged: " + this.user.nama)
    })
  },
  async mounted () {
    TabelDashboard.getMahasiswa().then((result) => {
      const panjang = result.length
      var promises = []
      for (var i = 0; i < panjang; i++) {
        promises.push(TabelDashboard.getProgressSubtugasByNIM(result.nim, "2021-07-01", "2021-08-30"))
      }
      Promise.all(promises).then((res) => {
        res.forEach((value, index) => {
          result[index].graphTugas = value
        })
        this.listMahasiswa = result
      })
    })
  },
  methods: {
    sortAscending (items) {
      items.sort((a, b) => {
        if (a.nama >= b.nama) {
          return 1
        } else {
          return -1
        }
      })
      return items
    },
    searchMahasiswa (value, search, item) {
      return (item.nim != null || item.nama != null) &&
        (item.nim.indexOf(search) !== -1 || item.nama.toLowerCase().indexOf(search.toLowerCase()) !== -1)
    },
    getPercentTugas (dataTugas) {
      if (dataTugas.length <= 1) {
        return 0
      } else {
        const progress = dataTugas[dataTugas.length - 1] - dataTugas[dataTugas.length - 2]
        return progress
      }
    },
    isPositive (number) {
      if (number * -1 < 0) {
        return false
      } else {
        return true
      }
    },
    async waitAuthenticated () {
      return new Promise((resolve) => {
        const unwatch = this.$store.watch(state => {
          return this.$store.getters.identity
        }, value => {
          if (!value) {
            return
          }
          // if (!value.isActive) {
          //   this.$router.replace({ path: "/reset-password" })
          // }
          unwatch()
          resolve()
        }, {
          immediate: true
        })
      })
    }
  }
}
</script>
<style scoped>
.stackSheet {
    position: relative;
}
.stackSpark {
    position: absolute;
    top: 0;
    left: 0;
}
</style>
