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
                v-model="drawer"
                app
                clipped
                color="grey lighten-4">
            <v-list dense class="grey lighten-4">
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
            {{ sourceCode}}
        </v-content>
    </v-app>
</template>

<script>
  import {createApolloClient} from "./createApolloClient";
  import {query} from "./query";

  export default {
    data() {
      return {
        drawer: true,
        token: '',
        sourceCode: 'Hello World',
        apolloClient: null,
        gists: [],
      }
    },
    async mounted() {
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
        const {data} = await this.apolloClient.query({query});
        this.gists = data.viewer.gists.edges.map(({node}) => ({
          id: node.name,
          name: node.files[0].name,
          text: node.files[0].text
        }));
      },
      saveToken() {
        localStorage.setItem("token", this.token);
        this.load();
      }
    },
  }
</script>

<style>
    .sidebar {
        grid-area: sidebar;
    }

    .content {
        grid-area: content;
    }

    .header {
        grid-area: header;
    }


    .wrapper {
        display: grid;
        grid-gap: 10px;
        width: 100%;
        grid-template-columns: 120px auto 120px;
        grid-template-areas: "....... header  header" "sidebar content content";
        background-color: transparent;
        color: #444;
    }

    .box {
        background-color: transparent;
        border-radius: 5px;
        padding: 20px;
        font-size: 150%;
    }

    .header {
        background-color: transparent;
    }
</style>
