<!--
 * @Author: Jane
 * @Date: 2020-04-14 17:43:10
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-20 15:11:54
 * @Descripttion: 
 -->
<template>
  <div id="page1"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as Three from 'three';

@Component({})
export default class Page1 extends Vue {
  camera: any = null;
  scene: any = null;
  renderer: any = null;
  mesh: any = null;

  init() {
    const container: any = document.getElementById('page1');
    //添加相机
    this.camera = new Three.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.01,
      10
    );
    this.camera.position.z = 1;
    //添加场景
    this.scene = new Three.Scene();
    //添加立方体
    const geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
    //使用材质
    const material = new Three.MeshNormalMaterial();
    //添加网格
    this.mesh = new Three.Mesh(geometry, material);
    //加入场景
    this.scene.add(this.mesh);
    //加入渲染器 antialias为true是打开抗锯齿 优化显示一些机器好的设备
    this.renderer = new Three.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    //添加到子节点
    container.appendChild(this.renderer.domElement);
  }
  animate() {
    requestAnimationFrame(this.animate);
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
    this.renderer.render(this.scene, this.camera);
  }

  mounted() {
    this.init();
    this.animate();
  }
}
</script>

<style lang="scss">
  #page1 {
    width: 100vw;
    height: 100vh;
  }
</style>
