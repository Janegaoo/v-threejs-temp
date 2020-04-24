<!--
 * @Author: Jane
 * @Date: 2020-04-14 17:43:10
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-24 15:31:17
 * @Descripttion: 
 -->
<template>
  <div id="page1"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as Three from 'three';
import { makeTextSprite } from '@/util/makeFrontCanvas';

@Component({})
export default class Page1 extends Vue {
  camera: any = null;
  scene: any = null;
  renderer: any = null;
  raycaster = new Three.Raycaster(); // 用于鼠标去获取在3D世界被鼠标选中的一些物体
  go_yangtai: any = null;
  go_room1: any = null;
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
  clickFlag = 0; // 快速点击摄像头移动参数
  exchange_img = false; //切换图片标志位
  onPointerDownPointerX: number = 0;
  onPointerDownPointerY: number = 0;
  onPointerDownLon: number = 0;
  onPointerDownLat: number = 0;
  currentRoom: string = '';
  clickTime: number = 0;

  susheLowUrl = require('./img/sushe_low.jpg');
  yangtaiLowUrl = require('./img/yangtai_low.jpg');
  susheUrl = require('./img/sushe.jpg');
  yangtaiUrl = require('./img/yangtai.jpg');

  mounted() {
    this.init();
    this.animate();
  }

  init() {
    const container: HTMLElement | null = document.getElementById('page1');
    // 透视投影相机
    // PerspectiveCamera(fov, aspect, near, far)
    // - fov 可视角度
    // - aspect 为width/height,通常设置为canvas元素的高宽比。
    // - near近端距离
    // - far远端距离
    this.camera = new Three.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      1,
      1100
    ); //透视投影照相机
    this.camera.target = new Three.Vector3(0, 0, 0); //设置相机所看的位置

    this.scene = new Three.Scene(); //场景

    //创建一个canvas绘制文字

    //箭头板子
    this.go_yangtai = makeTextSprite('　　　☝', '房间2', {});
    this.go_yangtai.position.set(-3, -1.5, -0.5);
    this.go_yangtai.name = 'room1';
    this.scene.add(this.go_yangtai);

    this.go_room1 = makeTextSprite('　　　☝', '房间1', {});
    this.go_room1.position.set(-0.5, -1.2, -3);
    this.go_room1.name = 'room2';
    this.scene.add(this.go_room1);
    this.go_room1.visible = false;

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
    this.renderer.setPixelRatio(window.devicePixelRatio); // 显示设备的物理像素分辨率
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    if (container) {
      container.appendChild(this.renderer.domElement); //将场景加入到画面
    }

    document.addEventListener('mousedown', this.onDocumentMouseDown, false);
    document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    document.addEventListener('mouseup', this.onDocumentMouseUp, false);
    //		document.addEventListener( 'wheel', onDocumentMouseWheel, false );

    document.addEventListener('touchstart', this.onDocumentTouchDown, false); //passive 参数不能省略，用来兼容ios和android
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
    if (this.clickTime > 240) {
      this.updateCamera();
    }
  }

  update() {
    //捕捉鼠标  将经度，纬度转换为rad坐标
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
      
    } else if (this.camera_time == 50) {
      this.lat = -2;
      this.lon = 182;
      this.camera_time = 0;   

      this.camera.fov = 75; // PerspectiveCamera(fov, aspect, near, far); // fov：人眼夹角，aspect：长宽比
      this.camera.updateProjectionMatrix();
      // console.log(this.currentRoom)

      let _loadUrl = '';
      if (this.currentRoom === 'room1') {
        this.mesh.material = this.yangtai_low;
        _loadUrl = this.yangtaiUrl;

        this.go_yangtai.visible = false;
        if (this.go_room1) {
          this.go_room1.visible = true;
        }

      } else if (this.currentRoom === 'room2') {
        this.mesh.material = this.sushe_low;
        _loadUrl = this.susheUrl;

        this.go_yangtai.visible = true;
        // if (this.go_room1) {
        this.go_room1.visible = false;
        // }
      }
      
      new Three.TextureLoader().load(_loadUrl, texture => {
        this.yangtai = new Three.MeshBasicMaterial({
          map: texture
        });
        this.mesh.material = this.yangtai;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }

  updateCamera() {
    if (this.camera.fov === 60) {
      this.camera.fov -= 1;
    }

    if (this.clickFlag > 0 && this.clickFlag < 10) {
      this.camera.lookAt(this.camera.target);
      this.camera.fov -= 1;
      this.camera.updateProjectionMatrix(); //需要更新，不自动更新
      this.clickFlag++;
    } else if(this.camera_time === 10){
      this.camera_time = 0;   
      this.camera.fov = 75; // PerspectiveCamera(fov, aspect, near, far); // fov：人眼夹角，aspect：长宽比
      this.camera.updateProjectionMatrix();
    }

    console.log(this.camera.fov);

    this.renderer.render(this.scene, this.camera);

  }

  //切换场景动作
  changeScene(params: any) {
    //  console.log("aa");
    this.camera_time = 1;
    this.currentRoom = params
    //    mesh.material = yangtai;
  }

  onDocumentMouseDown(event: any) {
    event.preventDefault();
    this.clickTime = new Date().getTime();
    this.raycaster.setFromCamera(this.mouse, this.camera); //射线捕捉 用一个新的原点和方向向量来更新射线（ray）。
    let _arrObj = [this.go_yangtai];
    if (this.go_room1) {
      _arrObj.push(this.go_room1);
    }
    var intersects = this.raycaster.intersectObjects(_arrObj);
    if (intersects.length > 0 && this.time == 2) {
      let _parame = intersects[0].object.name;
      this.changeScene(_parame);
    }

    this.isUserInteracting = true;
    this.is_click = true;
    this.onPointerDownPointerX = event.clientX;
    this.onPointerDownPointerY = event.clientY;

    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;
  }

  onDocumentTouchDown(event: any) {
    // console.log(event)
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
        ( event.touches[0].pageY - this.onPointerDownPointerY) * 0.1 +
        this.onPointerDownLat;
    }
  }

  onDocumentMouseUp(event: any) {
    this.isUserInteracting = false;
    let _now = new Date().getTime();
    this.clickTime = _now - this.clickTime;
    // console.log(this.clickTime);
    if (this.clickTime < 240) {
      // console.log('快速点击')
      this.onClickFn(event);
    }
  }

  onDocumentMouseWheel(event: any) {
    // var fov = this.camera.fov + event.deltaY * 0.05;
    // this.camera.fov = Three.MathUtils.clamp(fov, 10, 75);
    // this.camera.updateProjectionMatrix();

    this.camera.fov += event.deltaY * 0.05;
    this.camera.updateProjectionMatrix();
  }

  onClickFn(event: any) {
    //改变fov值，并更新场景的渲染
    this.clickFlag = 1;
    // this.camera.fov -= 10;

    // this.camera.updateProjectionMatrix();

    // this.renderer.render(this.scene, this.camera);
  }
}
</script>

<style lang="scss">
#page1 {
  width: 100vw;
  height: 100vh;
}
#page1 { //修复 Unable to preventDefault inside passive event listener
  -ms-touch-action: none;
  touch-action: none;
}
</style>
