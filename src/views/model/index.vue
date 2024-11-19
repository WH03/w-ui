<template>
  <div id="cesiumContainer">
    <div class="btnBox">
      <a-space wrap>
        <a-button type="primary" @click="addmodel3dTiles">加载3dTiles模型</a-button>
        <a-button type="primary" @click="addmodel3dTilesMore">加载3dTiles模型并设置拾取要素</a-button>
        <a-button type="primary" @click="addGlbmodel">加载glb模型</a-button>
        <a-button type="primary" @click="pathPlayBack">路径回放</a-button>
      </a-space>
      <p></p>
      <a-space wrap>
        <a-button type="primary" danger @click="delete3dTilesmodel">删除3dTiles模型</a-button>
        <a-button type="primary" danger @click="deleteGlbmodel">删除glb模型</a-button>
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
const addmodel3dTiles = async () => {
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
    // 创建一个新的transform矩阵,包含旋转信息
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
// 添加3dtiles模型
const addmodel3dTilesMore = async () => {
  obj.models = addThreeDTiles(75343)
  obj.models.then(tileset => {
    console.log('tileset@@@:', tileset)
  })
}

const createDiv = () => {
  const div = document.createElement('div');
  div.className = 'tips';
  div.style.display = 'none';
  div.style.position = 'absolute';
  div.style.bottom = '0';
  div.style.top = '0';
  div.style.color = 'white';
  div.stylep['pointer-events'] = 'none'
  div.style.padding = '4px'
  div.style.backgroundColor = 'black'

  let app = document.querySelector('#app')
  app.appendChild(div)
}


const delete3dTilesmodel = () => {
  viewer.entities.remove(obj.tileset);
}

// 加载glb模型
const addGlbmodel = async () => {
  let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(120.6, 30.1, 5)
  )
  //写法一：
  // const model = viewer.scene.primitives.add(await Cesium.Model.fromGltfAsync({//Gltf和glb模型都用fromGltf
  //   url: '/models/CesiumAir/Cesium_Air.glb',//模型文件路径
  //   modelMatrix: modelMatrix,
  //   scale: 2//模型在地图大小
  // }))
  // viewer.camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(120.6, 30.1, 50)
  // })

  // 写法二：
  const position = Cesium.Cartesian3.fromDegrees(123.0744619, 44.0503706, 5000.0);
  const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(135), 0, 0);
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

  obj.glbmodel = viewer.entities.add({
    name: "Cesium_Air",
    position: position,
    orientation: orientation,
    model: {
      uri: "/models/CesiumAir/Cesium_Air.glb",
      minimumPixelSize: 128,
      maximumScale: 20000,
    },
  });
  // 聚焦到模型
  viewer.trackedEntity = obj.glbmodel;
}

// 删除glb模型
const deleteGlbmodel = () => {
  viewer.entities.remove(obj.glbmodel)
}

// 路径回放
const pathPlayBack = () => {
  let linePositon = [
    [117.45859906800001, 31.143571198000075, 10.89079999999376],
    [117.45789337300005, 31.143422075000046, 11.12170000000333],
    [117.4571119630001, 31.143350937000037, 11.545700000002398],
    [117.45620292500007, 31.143325030000028, 11.529899999994086],
    [117.45545284400009, 31.143363754000063, 11.038100000005215],
    [117.45473256600008, 31.143448056000068, 10.86380000000645],
    [117.45399052200003, 31.143623321000064, 11.345600000000559],
    [117.45347615200001, 31.14381135600007, 11.687300000005052],
    [117.45292459000007, 31.144031608000034, 12.106100000004517],
    [117.45192097000006, 31.144426226000064, 12.842399999994086],
    [117.45065835500009, 31.144954275000032, 12.712299999999232],
    [117.44980033200011, 31.145266268000057, 12.504899999999907],
    [117.44943370300007, 31.145413392000023, 12.731599999999162],
    [117.44920128900003, 31.145382554000037, 12.967699999993783],
    [117.44897692800009, 31.144980649000047, 14.909599999999045],
    [117.44872415000009, 31.14449598400006, 14.55899999999383],
    [117.44851592000009, 31.144125416000065, 14.410999999992782],
    [117.44848024700002, 31.14392828000007, 14.475800000000163],
    [117.44948683700011, 31.14350793500006, 14.507400000002235],
    [117.45089297600009, 31.142959855000072, 14.290399999998044],
    [117.45149371900004, 31.142693826000027, 14.127099999997881],
    [117.45166848000008, 31.142571364000048, 15.52610000000277],
    [117.4516358520001, 31.142433625000024, 14.0341000000044],
    [117.45082070700065, 31.140899211000033, 13.289099999994505]
  ]

  obj.line = viewer.entities.add({
    name: 'line',
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(linePositon.flat()),
      material: Cesium.Color.RED.withAlpha(0.6),
      width: 5
    },
  })

  // 轨迹回放
  let property = new Cesium.SampledPositionProperty();
  // 开始时间
  let startTime = new Date();
  let stopTime;
  let timeStamp = startTime.getTime()

  linePositon.forEach((pos, index) => {
    // 设置成标准时间
    let time = new Date(timeStamp + index * 5000)
    stopTime = time
    let position = Cesium.Cartesian3.fromDegrees(pos[0], pos[1], pos[2])

    property.addSample(Cesium.JulianDate.fromDate(time), position)
  })
  // console.log('@@@property：', property)
  // 设置插值
  property.setInterpolationOptions({
    interpolationDegree: 0.0001,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
  })

  obj.entity = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
      start: Cesium.JulianDate.fromDate(startTime),
      stop: Cesium.JulianDate.fromDate(new Date(stopTime))
    })]),
    position: property,//点集
    model: {
      uri: '/models/CesiumAir/Cesium_Air.glb',
      minimumPixelSize: 10,
      maximumScale: 20,
    },
    path: {
      leadTime: 0,
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.1,
        color: Cesium.Color.AQUA
      }),
      width: 8
    }
  })
  //修改时间轴的当前时间
  viewer.clock.currentTime = Cesium.JulianDate.fromDate(startTime)
  viewer.clock.stopTime = Cesium.JulianDate.fromDate(new Date(stopTime))
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP//运行一遍
  viewer.clock.shouldAnimate = true//开始播放

  // 聚焦到模型
  // viewer.trackedEntity = obj.glbPathBack;
  viewer.zoomTo(obj.line)
}



onMounted(() => {
  const Cartesian = Cesium.Cartesian3.fromDegrees(117.45, 31.14, 50)
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

  // 深度检测
  viewer.scene.globe.depthTestAgainstTerrain = true
  //相机
  viewer.camera.setView({
    destination: Cartesian,//初始位置
    orientation: {//初始方向
      heading: Cesium.Math.toRadians(0), //表示绕 Z 轴旋转,控制物体的水平方向。
      pitch: Cesium.Math.toRadians(-30), //表示绕 X 轴旋转,控制物体的上下方向。
      roll: Cesium.Math.toRadians(0),//表示绕 Y 轴旋转,控制物体的倾斜或翻转。
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


async function addThreeDTiles(url, option) {
  // 开启地形深度检测:
  // 控制在渲染场景时，相机是否进行深度测试以避免将被遮挡的物体绘制在前景
  // true: 相机会根据地形高度信息进行深度测试，避免将低于地面的物体绘制在地面之上
  viewer.scene.globe.depthTestAgainstTerrain = true

  // ! 写法二：
  let tileset = {}
  if (typeof url == 'number') {
    tileset = await Cesium.Cesium3DTileset.fromIonAssetId(url, option);
  } else {
    tileset = await Cesium.Cesium3DTileset.fromUrl(url, option);
  }

  viewer.scene.primitives.add(tileset);
  // 定位到模型
  viewer.zoomTo(
    tileset,
    new Cesium.HeadingPitchRange(
      0.0,
      -0.5,
      tileset.boundingSphere.radius * 2.0 // 模型的包围球半径的2倍
    )
  )
  return tileset // 返回模型对象
}




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