<template>
  <div class="home">
    <el-input v-model="searchInput"></el-input>
    <el-button @click="handleSearch">搜索</el-button>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { search } from "../163music";

export default {
  data() {
    return {
      searchInput: ""
    };
  },
  name: "home",
  components: {},
  methods: {
    handleSearch: () => {
      search("光年之外", res => {
        console.log(res);
      });
    }
  }
};
</script>
