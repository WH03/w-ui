<template>
  <div id="cesiumContainer">
    <div class="btnBox">
      <a-space wrap>
        <a-button type="primary" @click="addModal">加载模型</a-button>
      </a-space>
      <p></p>
      <a-space wrap>
        <a-button type="primary" danger @click="deleteModal">删除模型</a-button>
      </a-space>
    </div>
  </div>

</template>

<script setup>
  import { ref, reactive, onMounted } from "vue";
  import * as Cesium from "cesium";

  let token = [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNGE4MDJhMy1kNTRlLTQzM2YtYjE1Yy0wOGMwMGVkYzA5ZjMiLCJpZCI6MTI1NDkxLCJpYXQiOjE3MjkxNDIzNzl9.6tsKL09OwpW2n5FqxFl1dpEyvU6waQwAavIRby6Gqfw',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MDcwZDdlNS01ZGU2LTQwZWUtOTcwNy03ZTE0NTcwMmNlYjMiLCJpZCI6MTI1NDkxLCJpYXQiOjE2NzY4ODAzNDN9.Cy3uiLaWrd13KvTouVqA9YamkMj8d5ThDVloSWzW61E',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNjc5MGZkOC1lNWVlLTRkY2UtYmJmZC02YzUwNWFhZDIwNjAiLCJpZCI6MTI1NDkxLCJpYXQiOjE3Mjg5ODE5NjF9.wtnNY0g6Au1sLs7LFlWFtGxebl7AHNKDXx5lFYcnQFM',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNzA1NmQ2MS0xMTgxLTQ4OTItOTgyNC0zYTVjNjhjYTYwN2YiLCJpZCI6MTI1NDkxLCJpYXQiOjE3MjkyMzgyNjF9.kf0IDvgQHGgCL4vAHTRBLdABwmuEXxd4_KeJ-xgQBQ8',
  ];
  Cesium.Ion.defaultAccessToken = token[Math.floor(Math.random() * token.length)];
  let viewer;
  let obj = reactive({})
  let url = '/3dtiles/park/tileset.json'

  // 添加模型
  const addModal = async () => {
    try {

      //新版本写法
      obj.tileset = await Cesium.Cesium3DTileset.fromUrl(url);
      viewer.scene.primitives.add(obj.tileset)

      // 设置旋转角度
      const angle = Cesium.Math.toRadians(30); // 将角度转换为弧度
      const rotationMatrix = Cesium.Matrix4.fromRotationTranslation(
        Cesium.Matrix3.fromRotationY(angle)
      );

      // 获取原始的transform矩阵
      const initialTransform = obj.tileset.root.transform;
      // 创建一个新的transform矩阵，包含旋转信息
      const newTransform = Cesium.Matrix4.multiply(
        initialTransform,
        rotationMatrix,
        new Cesium.Matrix4()
      );
      // 将新的transform应用到3D Tiles模型上
      obj.tileset.root.transform = newTransform;

      viewer.zoomTo(obj.tileset);


    } catch (error) {
      console.log('error:', error);
    }

  }






  const deleteModal = () => {
    viewer.entities.remove(obj.tileset);
  }


  onMounted(() => {
    const Cartesian = Cesium.Cartesian3.fromDegrees(119.56985, 34.20513, 50)
    viewer = new Cesium.Viewer('cesiumContainer', {
      animation: false, //是否显示动画控件
      baseLayerPicker: false, //是否显示图层选择控件
      geocoder: false, //是否显示地名查找控件
      timeline: false, //是否显示时间线控件
      sceneModePicker: false, //是否显示投影方式控件
      navigationHelpButton: false, //是否显示帮助信息控件
      fullscreenButton: false, //是否显示全屏按钮
      infoBox: false, //是否显示点击要素之后显示的信息
      homeButton: false, //是否显示Home按钮

    });


    //相机
    viewer.camera.setView({
      destination: Cartesian,//初始位置
      orientation: {//初始方向
        heading: Cesium.Math.toRadians(0), //表示绕 Z 轴旋转，控制物体的水平方向。
        pitch: Cesium.Math.toRadians(-30), //表示绕 X 轴旋转，控制物体的上下方向。
        roll: Cesium.Math.toRadians(0),//表示绕 Y 轴旋转，控制物体的倾斜或翻转。
      }
    })
    // 点击事件 
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(e => {
      let pick = viewer.scene.pick(e.position);
      if (Cesium.defined(pick)) {
        console.log('@@@点击选中pick:', pick.id);
        alert('选中name：' + pick.id.name);

      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  });

</script>

<style scoped lang="scss">

  html,
  body,
  #cesiumContainer {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    position: relative;
  }

  .btnBox {
    position: absolute;
    top: 1%;
    left: 1%;
    z-index: 999;
  }
</style>