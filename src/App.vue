<template>
    <v-app>
        <v-app-bar app clipped-left>
            <v-app-bar-nav-icon @click="drawer = !drawer"/>
            <span class="title ml-3 mr-5">Gist Explorer</span>
            <v-spacer/>
            <v-text-field
                    v-model="token"
                    v-on:keyup.enter="saveToken"
                    solo-inverted
                    flat
                    hide-details
                    label="Github personal access token">
                <template v-slot:append>
                    <v-btn color="primary" @click="saveToken">Save</v-btn>
                </template>
            </v-text-field>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" text> <v-icon v-on="on">fa-question-circle</v-icon></v-btn>
                </template>
                <div>Gist-Explorer needs your github access token to query gists at github.</div>
                <div>(Settings -> Developer Settings -> Personal access token -> create new token)</div>
                <div style="color:orange">To see your Secret gist, the permission "gist" must be set.</div>
                <div>If this is not set, only your public gist can be queried.</div>
                <div>Copy the generated token into the textfield and hit save.</div>
            </v-tooltip>
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
            <v-overlay :value="isLoading" style="height: 100%">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
            <v-banner single-line sticky>
                <template v-slot:actions>
                    <v-btn outlined class="grey--text" @click="copy">
                        <v-icon>fa-paste</v-icon>
                    </v-btn>
                    <v-btn outlined class="grey--text" @click="edit">
                        <v-icon>fa-edit</v-icon>
                    </v-btn>
                </template>
            </v-banner>
            <div style="display: flex; height: calc(100% - 80px)">
                <div style="width:var(--drawer-width);"/>
                <div ref="sourceCode" class="code mt-3 ml-3 mr-3 mb-3"
                     :contenteditable="editMode">
                    {{ sourceCode}}
                </div>
            </div>
            <v-snackbar color="primary" v-model="copySnackbar">
                Code copied!
            </v-snackbar>
            <v-snackbar color="primary" v-model="successSnackbar">
                Successful! Open the burger menu to see your gists.
            </v-snackbar>
        </v-content>
    </v-app>
</template>

<script>
    import {createApolloClient} from "./createApolloClient";
    import {query} from "./query";
    import resizeableDrawerMixin from "./resizeableDrawerMixin.js";

    export default {
        mixins: [resizeableDrawerMixin],
        data() {
            return {
                successSnackbar: false,
                copySnackbar: false,
                isLoginError: false,
                loginError: '',
                isLoading: false,
                editMode: false,
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
                this.editMode = false;
                this.sourceCode = gist.text;
            },
            async load() {
                this.isLoading = true;
                const {data} = await this.apolloClient.query({query, fetchPolicy: 'network-only'})
                    .catch(e => {
                        this.isLoginError = true;
                        this.loginError = `Something went wrong? Maybe wrong accesstoken? error was: ${e.toString()}`;
                        return Promise.reject(e);
                    })
                    .finally(e => {
                        this.isLoading = false;
                    });
                this.isLoginError = false;
                this.successSnackbar = true;
                this.gists = data.viewer.gists.edges.map(({node}) => ({
                    id: node.name,
                    name: node.files[0].name,
                    text: node.files[0].text
                })).sort((o1, o2) => o1.name.localeCompare(o2.name));
            },
            saveToken() {
                localStorage.setItem("token", this.token);
                this.load();
            },
            copy() {
                navigator.clipboard.writeText(this.sourceCode)
                this.copySnackbar = true;
            },

            edit() {
                this.editMode = true;
                this.$nextTick(() => this.$refs.sourceCode.focus());
            }
        },
    }
</script>
<style>
    :root {
        --drawer-width: 300px;
    }
</style>
