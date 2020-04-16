<!--
 * @Author: Jane
 * @Date: 2020-04-14 10:53:30
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-16 14:19:23
 * @Descripttion: 
 -->
<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
};
</script>
