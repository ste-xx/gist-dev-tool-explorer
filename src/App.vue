<template>
    <v-app>
        <v-app-bar app clipped-left>
            <v-app-bar-nav-icon @click="drawer = !drawer"/>
            <span class="title ml-3 mr-5">Gist Explorer</span>
            <v-spacer/>
            <v-text-field
                    v-model="token"
                    solo-inverted
                    flat
                    hide-details
                    label="Github personal access token">
                <template v-slot:append>
                    <v-btn color="primary" @click="saveToken">Save</v-btn>
                </template>
            </v-text-field>
        </v-app-bar>
        <v-navigation-drawer
                ref="drawer"
                v-model="drawer"
                app
                clipped
                :width="drawerWidth"
                color="grey lighten-4">
            <v-list dense class="grey lighten-4">
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon x-small class="grey--text">fa-sync</v-icon>
                    </v-list-item-action>
                    <v-list-item-content @click="load">
                        <v-list-item-title class="grey--text">
                            Refresh
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider color="grey"/>
                <template v-for="gist in gists">
                    <v-list-item link :key="gist.id">
                        <v-list-item-content @click="show(gist)">
                            <v-list-item-title class="grey--text">
                                {{ gist.name }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-content>
            <v-alert v-if="isLoginError" type="error">
               {{ loginError }}
            </v-alert>
            <v-overlay :value="isLoading">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
            <v-banner single-line sticky>
                <template v-slot:actions>
                    <v-btn outlined class="grey--text" @click="copy">
                        <v-icon>fa-paste</v-icon>
                    </v-btn>
                </template>
            </v-banner>
            <div class="code mt-3 ml-3 mr-3 mb-3">
                {{ sourceCode}}
            </div>
        </v-content>
    </v-app>
</template>

<script>
  import {createApolloClient} from "./createApolloClient";
  import {query} from "./query";

  export default {
    data() {
      return {
        isLoginError: false,
        loginError: '',
        isLoading: false,
        drawer: true,
        drawerWidth: 300,
        token: '',
        sourceCode: 'Hello World',
        apolloClient: null,
        gists: [],
      }
    },
    async mounted() {
      this.setBorderWidth();
      this.setEvents();
      this.token = localStorage.getItem("token") || '';
      this.apolloClient = await createApolloClient({
        getToken: () => this.token
      });
      if (this.token !== '') {
        return this.load();
      }
    },
    methods: {
      show(gist) {
        this.sourceCode = gist.text;
      },
      async load() {
        this.isLoading = true;
        const {data} = await this.apolloClient.query({query,fetchPolicy: 'network-only'})
          .catch(e => {
            this.isLoginError = true;
            this.loginError=`Something went wrong? Maybe wrong accesstoken? error was: ${e.toString()}`;
            return Promise.reject(e);
          })
          .finally(e => {
          this.isLoading = false;
        });
        this.isLoginError = false;
        this.gists = data.viewer.gists.edges.map(({node}) => ({
          id: node.name,
          name: node.files[0].name,
          text: node.files[0].text
        }));
      },
      saveToken() {
        localStorage.setItem("token", this.token);
        this.load();
      },
      copy(){
        navigator.clipboard.writeText(this.sourceCode)
      },

      setBorderWidth() {
        let i = this.$refs.drawer.$el.querySelector(
          ".v-navigation-drawer__border"
        );
        i.style.cursor = "ew-resize";
      },
      setEvents() {
        const minSize = 3;
        const el = this.$refs.drawer.$el;
        const drawerBorder = el.querySelector(".v-navigation-drawer__border");
        const vm = this;
        const direction = el.classList.contains("v-navigation-drawer--right")
          ? "right"
          : "left";

        function resize(e) {
          document.body.style.cursor = "ew-resize";
          let f =
            direction === "right"
              ? document.body.scrollWidth - e.clientX
              : e.clientX;
          el.style.width = f + "px";
        }

        drawerBorder.addEventListener(
          "mousedown",
          (e) => {
            if (e.offsetX < minSize) {
              el.style.transition = "initial";
              document.addEventListener("mousemove", resize, false);
            }
          },
          false
        );

        document.addEventListener(
          "mouseup",
          () => {
            el.style.transition = "";
            this.drawerWidth = el.style.width;
            document.body.style.cursor = "";
            document.removeEventListener("mousemove", resize, false);
          },
          false
        );
      }
    },
  }
</script>
