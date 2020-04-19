<!--
 * @Author: Jane
 * @Date: 2020-04-14 17:43:10
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-18 16:22:20
 * @Descripttion: 
 -->
<template>
  <div id="app">
    <div id="nav">{{ ValA }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';

@Component({})
export default class Page1 extends Vue {
  ValA = 'hello page1'; // a
  ValB = 1; // aaa

  heloWord2(a: string) {
    const aa = 'test';
    console.log(a, aa);
    // console.log(Vue);
  }

  mounted() {
    this.heloWord2('page1page1page1page1page1page1page1page1page1page1page1page1page1page1page1page1');
    console.log(THREE);
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
  .a {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
  .b {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
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
