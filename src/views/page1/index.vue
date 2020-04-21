<!--
 * @Author: Jane
 * @Date: 2020-04-14 17:43:10
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-21 17:14:46
 * @Descripttion: 
 -->
<template>
  <div id="page1"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as Three from 'three';
import { makeTextSprite } from '@/util/makeFrontCanvas';
// import { onDocumentMouseDown, onDocumentMouseMove, onDocumentMouseUp, onDocumentTouchDown, onDocumentTouchMove, onDocumentMouseUp, onWindowResize } from '@/util/mouseTouchControl'

@Component({})
export default class Page1 extends Vue {
  camera: any = null;
  scene: any = null;
  renderer: any = null;
  raycaster = new Three.Raycaster(); // 用于鼠标去获取在3D世界被鼠标选中的一些物体
  go_yangtai: any = null;
  mouse = new Three.Vector2(); //将鼠标位置
  is_click: any = null; //点击事件

  isUserInteracting: boolean = false;
  onMouseDownMouseX: number = 0;
  onMouseDownMouseY: number = 0;
  lon: number = 0;
  onMouseDownLon: number = 0;
  lat: number = 0;
  onMouseDownLat: number = 0;
  phi: any = 0;
  theta: any = 0;
  geometry: any = null; //球体网格
  sushe: any = null;
  sushe_low: any = null; //宿舍全景图材质
  yangtai: any = null;
  yangtai_low: any = null;
  yangtai_flag = false; //阳台全景图材质、转到阳台
  mesh: any = null; //全景球体对象
  time: number = 0; //加载计数
  camera_time = 0; //摄像机移动参数
  exchange_img = false; //切换图片标志位
  onPointerDownPointerX: number = 0;
  onPointerDownPointerY: number = 0;
  onPointerDownLon: number = 0;
  onPointerDownLat: number = 0;

  susheLowUrl = require('./img/sushe_low.jpg');
  yangtaiLowUrl = require('./img/yangtai_low.jpg');
  susheUrl = require('./img/sushe.jpg');
  yangtaiUrl = require('./img/yangtai.jpg');

  init() {
    const container: HTMLElement | null = document.getElementById('page1');
    // 透视投影相机
    // PerspectiveCamera(fov, aspect, near, far)
    // - fov 可视角度
    // - aspect 为width/height,通常设置为canvas元素的高宽比。
    // - near近端距离
    // - far远端距离
    this.camera = new Three.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1100
    ); //透视投影照相机
    this.camera.target = new Three.Vector3(0, 0, 0); //设置相机所看的位置

    this.scene = new Three.Scene(); //场景

    //创建一个canvas绘制文字

    //箭头板子
    this.go_yangtai = makeTextSprite('　　　☝', '去阳台看看', {});
    this.go_yangtai.position.set(-3, -1.5, -0.5);
    this.scene.add(this.go_yangtai);

    //全景场景
    this.geometry = new Three.SphereGeometry(500, 60, 40); //SphereGeometry用来在三维空间内创建一个球体对象.
    this.geometry.scale(-1, 1, 1);

    //使用基本材质（BasicMaterial）的物体，渲染后物体的颜色始终为该材质的颜色，不会由于光照产生明暗、阴影效果
    this.sushe_low = new Three.MeshBasicMaterial({
      map: new Three.TextureLoader().load(
        this.susheLowUrl,
        void (() => {
          this.time++;
        })()
      )
    });

    this.yangtai_low = new Three.MeshBasicMaterial({
      map: new Three.TextureLoader().load(
        this.yangtaiLowUrl,
        void (() => {
          this.time++;
        })()
      )
    });

    // 构建平面网格 mesh
    this.mesh = new Three.Mesh(this.geometry, this.sushe_low); //Mesh（图元装配函数）   生成三维物体

    //异步加载高清纹理图
    //错误写法，在加载完图片后还没给map赋值，就使用了该材质。
    //                sushe = new Three.MeshBasicMaterial( {
    //                    map: new Three.TextureLoader().load( 'sushe.jpg', void function(){
    //                      mesh.material = sushe;   }() )} );
    //正确写法：在加载完成之后先完成对材质对象的构建，在进行使用
    new Three.TextureLoader().load(this.susheUrl, texture => {
      this.sushe = new Three.MeshBasicMaterial({
        map: texture
      });
      this.mesh.material = this.sushe;
    });

    this.scene.add(this.mesh); //网格添加到场景中

    this.renderer = new Three.WebGLRenderer(); //定义渲染器
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    if (container) {
      container.appendChild(this.renderer.domElement); //将场景加入到画面
    }

    document.addEventListener('mousedown', this.onDocumentMouseDown, false);
    document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    document.addEventListener('mouseup', this.onDocumentMouseUp, false);
    //		document.addEventListener( 'wheel', onDocumentMouseWheel, false );
    document.addEventListener('touchstart', this.onDocumentTouchDown, false);
    document.addEventListener('touchmove', this.onDocumentTouchMove, false);
    document.addEventListener('touchend', this.onDocumentMouseUp, false);

    window.addEventListener('resize', this.onWindowResize, false);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.update();
  }

  update() {
    //捕捉鼠标

    //	if ( isUserInteracting === false ) {

    //		lon += 0.1;

    //	}

    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = Three.MathUtils.degToRad(90 - this.lat);
    this.theta = Three.MathUtils.degToRad(this.lon);

    this.camera.target.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
    this.camera.target.y = 500 * Math.cos(this.phi);
    this.camera.target.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);

    this.camera.lookAt(this.camera.target);

    /*
				// distortion
				camera.position.copy( camera.target ).negate();
				*/
    if (this.camera_time > 0 && this.camera_time < 50) {
      this.camera.target.x = -493;
      this.camera.target.y = -28;
      this.camera.target.z = -72;
      this.camera.lookAt(this.camera.target);
      this.camera.fov -= 1;
      this.camera.updateProjectionMatrix(); //需要更新，不自动更新
      this.camera_time++;
      console.log('111111111');
      console.log(this.camera_time);
      this.go_yangtai.visible = false;
    } else if (this.camera_time == 50) {
      this.lat = -2;
      this.lon = 182;
      this.camera_time = 0;
      console.log('222222');
      console.log(this.camera_time);
      this.camera.fov = 75;
      this.camera.updateProjectionMatrix();
      this.mesh.material = this.yangtai_low;
      new Three.TextureLoader().load(this.yangtaiUrl, texture => {
        this.yangtai = new Three.MeshBasicMaterial({
          map: texture
        });
        this.mesh.material = this.yangtai;
      });
    }
    this.renderer.render(this.scene, this.camera);
  }

  //切换场景动作
  changeScene() {
    //  console.log("aa");
    this.camera_time = 1;
    //    mesh.material = yangtai;
  }

  mounted() {
    this.init();
    this.animate();
  }

  onDocumentMouseDown(event: any) {
    event.preventDefault();

    this.raycaster.setFromCamera(this.mouse, this.camera); //射线捕捉
    var intersects = this.raycaster.intersectObjects([this.go_yangtai]);
    if (intersects.length > 0 && this.time == 2) {
      this.changeScene();
    }

    this.isUserInteracting = true;
    this.is_click = true;
    this.onPointerDownPointerX = event.clientX;
    this.onPointerDownPointerY = event.clientY;

    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;
  }

  onDocumentTouchDown(event: any) {
    event.preventDefault();

    this.isUserInteracting = true;
    this.onPointerDownPointerX = event.touches[0].pageX;
    this.onPointerDownPointerY = event.touches[0].pageY;

    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;
  }

  onDocumentMouseMove(event: any) {
    //  console.log("tex", sushe);
    //屏幕位置转换到3D世界坐标系
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    if (this.isUserInteracting === true) {
      this.lon =
        (this.onPointerDownPointerX - event.clientX) * 0.1 +
        this.onPointerDownLon;
      this.lat =
        (event.clientY - this.onPointerDownPointerY) * 0.1 +
        this.onPointerDownLat;
    }
  }

  //手机控制适配
  onDocumentTouchMove(event: any) {
    if (this.isUserInteracting === true) {
      this.lon =
        (this.onPointerDownPointerX - event.touches[0].pageX) * 0.1 +
        this.onPointerDownLon;
      this.lat =
        (event.touches[0].pageY - this.onPointerDownPointerY) * 0.1 +
        this.onPointerDownLat;
    }
  }

  onDocumentMouseUp(event: any) {
    this.isUserInteracting = false;
  }

  onDocumentMouseWheel(event: any) {
    // var fov = this.camera.fov + event.deltaY * 0.05;
    // this.camera.fov = Three.MathUtils.clamp(fov, 10, 75);
    // this.camera.updateProjectionMatrix();
    
    this.camera.fov += event.deltaY * 0.05;
    this.camera.updateProjectionMatrix();
  }
}
</script>

<style lang="scss">
#page1 {
  width: 100vw;
  height: 100vh;
}
</style>
