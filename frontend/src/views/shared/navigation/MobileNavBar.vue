<template>
  <div>
    <v-app-bar
      app
      :style="{background : currentTheme}"
    >
    <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-img :src="require('../../../assets/polban.png')" max-width="30" contain class="mr-2"/>
    <v-toolbar-title style="font-size: 14px">Politeknik Negeri Bandung</v-toolbar-title>
    <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      width="75%"
      style="padding-top: 60px"
      id="sidebar"
    >
      <v-list>
        <div
          v-for="(item, i) in navItem"
          :key="i"
        >

          <v-list-item
            v-if="!item.to && !item.subLinks"
            :key="i"
            dark
            class="pb-0 mb-n2"
            :class="i === 0 ? 'mt-3' : 'mt-6'"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.text" class="font-weight-bold text-h6"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="!item.subLinks && item.to"
            :key="i"
            link
            :to="item.to"
            active-class="itemOnActive"
            dark
          >
            <v-list-item-icon v-if="item.icon">
              <v-icon color="#DDE2FF">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text" style="color:#DDE2FF" class="d-sm-none d-md-flex"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            v-if="item.subLinks"
            :key="item.text"
            link
            dark
            eager
            v-model="isActive"
          >
            <template v-slot:activator>
              <v-list-item
                :key="i"
                dark
                color="primary"
                class="pa-0 pt-2"
              >
                <v-list-item-icon v-if="item.icon">
                  <v-icon> {{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title v-text="item.text"> {{ item.text }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <template v-slot:appendIcon>
              <v-icon dark color="white">$expand</v-icon>
            </template>

            <v-list-item
              v-for="sublink in item.subLinks"
              :key="sublink.text"
              class="pl-12"
              @click="onSubLinkClicked(sublink.to)"
              :style="{background : sublink.isActive ? '#1A1925' : ''}"
            >
              <v-list-item-content>
                <v-list-item-title v-text="sublink.text"  style="color:white"/>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>

        </div>
      </v-list>

      <template v-slot:append>
        <v-divider style="border: .3px solid rgba(255, 255, 255, .3);"></v-divider>
        <v-btn
          large
          text
          block id="logout-button"
          class="font-weight-bold text-uppercase text-button text-left"
          @click="logout()"
          style="color:#797979"
        >
          <v-icon medium color="#797979" style="transform:rotate(180deg)">
            mdi-logout
          </v-icon>
          Log out
        </v-btn>
      </template>
    </v-navigation-drawer>
  </div>
</template>
<style scoped>
  .profile:hover {
    background: none;
  }
  .profile:active {
    background: none;
  }
  #last-item {
  position: absolute;
  bottom: 0;
  width: 100%;
  }
  #sidebar {
    background: #272343;
  }
  .v-list-item{
    margin-bottom: 10px;
  }
  .v-list-item:hover{
    background-color: #4E4B63;
  }
  #logout-button {
    color: #59DCDC;
  }
  .itemOnActive{
    background: #1A1925;
  }
</style>
<script>
import { mapGetters } from "vuex"
export default {
  name: "MobileNavBar",
  props: {
    items: {
      type: Array,
      required: false,
      default: () => {
        return [
          {
            text: "Components"
          },
          {
            to: "/dashboard",
            icon: "mdi-view-dashboard",
            text: "Dashboard"
          },
          {
            icon: "mdi-tennis",
            text: "Players",
            subLinks: [
              {
                text: "Players list",
                to: "/players"
              },
              {
                text: "Import WTA Players",
                to: "/players/import"
              }
            ]
          },
          {
            to: "/tournaments",
            icon: "mdi-trophy",
            text: "Tournaments"
          }
        ]
      }
    }
  },
  components: {
  },
  data: () => ({
    drawer: false,
    group: null,
    darkmode: false,
    toHome: "/home",
    isLoading: true,
    isActive: false,
    refreshTrigger: false
  }),
  computed: {
    ...mapGetters({
      currentTheme: "theme/getCurrentColor",
      isDark: "theme/getIsDark"
    }),
    identity: function () {
      return this.$store.getters.identity
    },
    navItem () {
      return this.items.map((item) => {
        console.log(this.refreshTrigger)
        if (item.subLinks) {
          item.subLinks = item.subLinks.map((sublink) => {
            return { ...sublink, ...{ isActive: this.$route.path === sublink.to } }
          })
          return { ...item, ...{ isActive: this.isActive } }
        }
        return item
      })
    }
  },
  created () {
    const tasks = []
    if (this.$route.meta.requiresAuth) {
      tasks.push(this.waitAuthenticated())
    }
    Promise.all(tasks).then(result => {
      this.isLoading = false
      this.user.nama = this.identity.given_name
    })
  },
  methods: {
    logout: function () {
      this.$store.dispatch("logout", this.$router)
    },
    collapseSubItems () {
      this.isActive = false
    },
    async onSubLinkClicked (to) {
      if (this.$router.currentRoute.path !== to) {
        await this.$router.push({ path: to })
      }
    }
  },
  watch: {
    darkmode (value) {
      if (value === this.isDark) return
      this.toogleTheme("doni")
    }
  }
}
</script>
