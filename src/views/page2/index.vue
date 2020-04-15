<!--
 * @Author: Jane
 * @Date: 2020-04-14 17:43:10
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-15 16:24:42
 * @Descripttion: 
 -->
<template>
  <div id="app">
    <div id="nav">
      {{ ValA }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Page1 extends Vue {
  ValA = 'hello page2'; // a
  ValB = 1; // aaa

  heloWord(a: string) {
    const aa = 'test';
    console.log(a, aa);
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
