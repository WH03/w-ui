<template>
  <div id="cesiumContainer">
    <div class="btnBox">
      <a-space wrap>
        <a-button type="primary" @click="addmodel3dTiles">加载3dTiles模型</a-button>
        <a-button type="primary" @click="addmodel3dTilesMore">加载3dTiles模型并设置拾取要素</a-button>
        <a-button type="primary" @click="addGlbmodel">加载glb模型</a-button>
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

let div;//创建div
let silhouetteBlue;//边缘检测对象
let silhouetteGreen;//边缘检测对象
let selectedEntity;
// 添加模型
const addmodel3dTiles = async () => {
  try {
    //新版本写法
    obj.tileset = await Cesium.Cesium3DTileset.fromUrl(url);
    viewer.scene.primitives.add(obj.tileset)

    // 修改颜色
    obj.tileset.style = new Cesium.Cesium3DTileStyle({
      color: "color('blue',0.5)",
      show: true
    })

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
    // 针对不同高度，修改不同颜色
    tileset.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          ['${Height}>=300', 'rgba(45,0,75,0.5)'],
          ['${Height}>=200', 'rgb(102,71,151)'],
          ['${Height}>=100', 'rgb(170,162,204)'],
          ['${Height}>=50', 'rgb(224,226,238)'],
          ['${Height}>=25', 'rgb(252,230,200)'],
          ['${Height}>=10', 'rgb(248,176,87)'],
          ['${Height}>=5', 'rgb(1980,106,11)'],
          ['true', 'rgb(127,59,8)']
        ]
      },
      show: '${Height}>=0'
    })
    viewer.zoomTo(obj.models)
  })

}





// 删除3dtiles
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

// 创建标签
const createDiv = (div, name, pos, type) => {
  div.className = 'tips';
  div.style.display = type || 'none';
  div.style.position = 'absolute';
  div.style.color = 'white';
  div.style.padding = '4px'
  div.style["pointer-events"] = "none"//禁用点击事件
  div.style.backgroundColor = 'black';
  div.style.bottom = `${viewer.scene.canvas.clientHeight - pos.y}px`
  div.style.left = `${pos.x}px`
  div.textContent = name
}
// 高亮显示
function highLight() {
  //定义一个空的entity
  selectedEntity = new Cesium.Entity();
  console.log('@@@selectedEntity:', selectedEntity);
  //判断浏览器是否支持边缘检测
  if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) {
    // 创建一个边缘检测的效果
    silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    // 设置边缘的颜色
    silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
    // 设置边缘的长度
    silhouetteBlue.uniforms.length = 0.01;
    // 设置选中的对象
    silhouetteBlue.selected = [];

    // 
    silhouetteGreen =
      Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    silhouetteGreen.uniforms.color = Cesium.Color.LIME;
    silhouetteGreen.uniforms.length = 0.01;
    silhouetteGreen.selected = [];


    // 添加到场景中
    viewer.scene.postProcessStages.add(
      Cesium.PostProcessStageLibrary.createSilhouetteStage([
        silhouetteBlue,
        silhouetteGreen
      ]),
    );
  }
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

  div = document.createElement("div");//创建div
  viewer.container.appendChild(div);//添加到当前容器中


  highLight()


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
    // 获取点击的对象
    silhouetteBlue.selected = []
    let pick = viewer.scene.pick(e.endPosition);
    // console.log('@@@e.endPosition:', e.endPosition);
    // console.log('@@@:clientHeight', viewer.scene.canvas.clientHeight);
    if (!Cesium.defined(pick)) {
      createDiv(div, '', e.endPosition, 'none')
    }

    if (Cesium.defined(pick)) {
      console.log('@@选中pick:', pick);
      const name = pick.getProperty('BIN')
      createDiv(div, name, e.endPosition, 'block')
      silhouetteBlue.selected = [pick];
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  //点击事件
  let clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  clickHandler.setInputAction(e => {

    silhouetteGreen.selected = [];
    // 如果没有拾取到，直接返回
    let pick = viewer.scene.pick(e.position);
    if (!Cesium.defined(pick)) {
      return
    }

    // 设置为绿色的
    const highLightModel = silhouetteBlue.selected[0]

    // 如果和蓝色状态相同，取消蓝色的
    if (pick === highLightModel) {
      silhouetteBlue.selected = [];
    }

    silhouetteGreen.selected = [pick];

    viewer.selectedEntity = selectedEntity;

  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

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