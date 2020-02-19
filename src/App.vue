<template>
    <div id="app" class="wrapper">
        <div class="box header">Gist Explorer</div>
        <div class="box sidebar">
            <button v-for="gist in gists" @click="show(gist)">
                {{ gist.name }}
            </button>
        </div>
        <div class="box content">
            <div>
                {{ sourceCode}}
            </div>
        </div>
    </div>
</template>

<script>
  import {createApolloClient} from "./createApolloClient";
  import {query} from "./query";

  export default {
    data() {
      return {
        sourceCode: 'Hello World',
        apolloClient: null,
        gists: [],
      }
    },
    async mounted() {
      this.apolloClient = await createApolloClient();
      const {data} = await this.apolloClient.query({query});
      this.gists = data.viewer.gists.edges.map(({node}) => ({
        id: node.name,
        name: node.files[0].name,
        text: node.files[0].text
      }));
      console.warn(this.gists);
    },
    methods: {
      show(gist) {
        this.sourceCode = gist.text;
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
        color: #fff;
        border-radius: 5px;
        padding: 20px;
        font-size: 150%;
    }

    .header {
        background-color: transparent;
    }
</style>
