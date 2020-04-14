<!--
 * @Author: Jane
 * @Date: 2020-04-14 17:43:10
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-14 17:43:41
 * @Descripttion: 
 -->
<template>
  <div id="app">
    <div id="nav">
      111
    </div>
  </div>
</template>

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
