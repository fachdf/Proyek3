<template>
    <v-row :style="{color: currentTheme.onBackground}">
      <div v-if="!isMobile">
        <v-col cols="12">
          <p class="text-h4 font-weight-bold">List Mahasiswa</p>
          <p class="text-subtitle-1 font-weight-bold">Tahun ajaran 2019</p>
        </v-col>
        <v-col cols="12">
          <breadcumbs :breadcrumb-items="breadcrumbItems"/>
        </v-col>
      </div>
      <div v-else>
        <v-col cols="12">
          <breadcumbs :breadcrumb-items="breadcrumbItems"/>
        </v-col>
        <v-col cols="12">
          <p class="text-h4 font-weight-bold" style="margin-bottom: 0">List Mahasiswa</p>
          <p class="text-subtitle-1 font-weight-bold" style="margin-bottom: 0">Tahun ajaran 2019</p>
        </v-col>
      </div>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="listMahasiswa"
          :items-per-page="10"
          :style="{color: currentTheme.colorPrimary}"
          class="text-lg-subtitle-1 font-weight v-sheet--outlined rounded-lg"
          :custom-sort="sortAscending"
          :search="search"
          :custom-filter="searchMahasiswa"
          :id="[isMobile ? 'virtual-scroll-table' : {}]"
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
            <div
              :style="[isMobile ? {} : {'width': '22.375rem'}]"
            >
              <v-row
                :class="[!isMobile ? 'py-6' : '']"
                style="margin:0; gap:1.375rem"
                :justify="end">
                <v-avatar
                  v-if="!isMobile"
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
                        <div v-bind="attrs" v-on="on" class="text-truncate"
                        :style="isMobile ? {'font-size': '0.75rem'} : {}"
                        style="cursor:default; max-width: 200px;">
                          {{ item.nama }}
                        </div>
                      </template>
                      <span>{{ item.nama }}</span>
                    </v-tooltip>
                  </div>
                  <div class="text-caption">
                    {{ item.nim }}
                  </div>
                </v-col>
              </v-row>
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
    </v-row>
</template>

<script>
import { mapGetters } from "vuex"
import Breadcumbs from "@/views/shared/navigation/Breadcumbs"
import ListMahasiswa from "../../../../datasource/network/monitoring/listMahasiswa"

export default {
  name: "ListMahasiswa",
  components: { Breadcumbs },
  data () {
    return {
      search: "",
      breadcrumbItems: [
        {
          text: "Monitoring",
          disabled: false,
          href: ""
        },
        {
          text: "List Mahasiswa",
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
        { text: "EMAIL", value: "email", sortable: false },
        { text: "KONTAK(PHONE)", value: "nomor_ponsel", sortable: false }
      ],
      listMahasiswa: []
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
    identity: function () {
      return this.$store.getters.identity
    }
  },
  async mounted () {
    var mahasiswa = await ListMahasiswa.getMahasiswa()
    this.listMahasiswa = mahasiswa
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
    }
  }
}
</script>
<style scouped>
  .v-data-table-header-mobile{
    display : none;
  }
  .v-data-table__mobile-row__header{
    font-size: 0.75rem;
    color : #9FA2B4
  }
  div .text-truncate {
      color: #252733
  }
  .text-caption {
    color: #7b7b7b
  }
  #virtual-scroll-table {
    max-height: 625px;
    overflow: auto;
  }
  @media screen and (max-width: 600px) {
    div .v-data-footer__select, div .v-text-field__details{
      display: none;
    }
    div .text-truncate {
      padding-top: 20px;
      max-width: 60px;
    }
    .v-data-footer__pagination{
      margin: 0 5px 0 24px
    }
  }
</style>
