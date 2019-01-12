<template>
  <div class="home">
    <el-input v-model="searchInput"></el-input>
    <el-button @click="handleSearch">搜索</el-button>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  data() {
    return {
      searchInput: ""
    };
  },
  name: "home",
  components: {},
  methods: {
    handleSearch: () => {}
  }
};
</script>
