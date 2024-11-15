<template>
    <div id="cesiumContainer">
        <div class="btnBox">
            <a-space wrap>
                <a-button type="primary" @click="addFlowingLine">流动的线</a-button>
                <a-button type="primary" @click="addGlowLine">发光的线</a-button>

            </a-space>
            <p></p>
            <a-space wrap>
                <a-button type="primary" danger @click="deleteFlowingLine">删除流动的线</a-button>
                <a-button type="primary" danger @click="deleteGlowLine">删除发光的线</a-button>
            </a-space>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
let token = [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNGE4MDJhMy1kNTRlLTQzM2YtYjE1Yy0wOGMwMGVkYzA5ZjMiLCJpZCI6MTI1NDkxLCJpYXQiOjE3MjkxNDIzNzl9.6tsKL09OwpW2n5FqxFl1dpEyvU6waQwAavIRby6Gqfw',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MDcwZDdlNS01ZGU2LTQwZWUtOTcwNy03ZTE0NTcwMmNlYjMiLCJpZCI6MTI1NDkxLCJpYXQiOjE2NzY4ODAzNDN9.Cy3uiLaWrd13KvTouVqA9YamkMj8d5ThDVloSWzW61E',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNjc5MGZkOC1lNWVlLTRkY2UtYmJmZC02YzUwNWFhZDIwNjAiLCJpZCI6MTI1NDkxLCJpYXQiOjE3Mjg5ODE5NjF9.wtnNY0g6Au1sLs7LFlWFtGxebl7AHNKDXx5lFYcnQFM',
]
Cesium.Ion.defaultAccessToken = token[Math.floor(Math.random() * token.length)];


let viewer;
let obj = {};
// CallbackProperty：生成一个动态实体
const addFlowingLine = () => {
    let lon, lat, num = 0;
    obj.line = viewer.entities.add({
        polyline: {
            positions: new Cesium.CallbackProperty(() => {
                num += 0.005
                lon = 120 + num
                lat = 30 + num
                if (lon < 121) {
                    return Cesium.Cartesian3.fromDegreesArray([120, 30, lon, lat])
                } else {
                    obj.line.polyline.positions = Cesium.Cartesian3.fromDegreesArray([120, 30, 121, 31])
                }
            }, false),
            width: 5,
            material: Cesium.Color.YELLOW
        }
    })
    viewer.zoomTo(obj.line)
}
// 删除流动的线
const deleteFlowingLine = () => {
    viewer.entities.remove(obj.line)
}

// 添加高光的线
const addGlowLine = () => {
    let lon, lat, num = 0;
    obj.glowLine = viewer.entities.add({
        polyline: {
            // positions: Cesium.Cartesian3.fromDegreesArray([120, 35, 121, 36]),
            positions: new Cesium.CallbackProperty(() => {
                num += 0.005;
                lon = 120 + num
                lat = 30 + num
                // if (lon < 123) {
                //     return Cesium.Cartesian3.fromDegreesArray([120, 30, lon, lat])
                // } else {
                //     obj.glowLine.polyline.positions = Cesium.Cartesian3.fromDegreesArray([120, 30, 121, 31])
                // }

                if (lon < 123) {
                    return Cesium.Cartesian3.fromDegreesArray([120, 30, lon, lat])
                } else {
                    obj.glowLine.polyline.positions = Cesium.Cartesian3.fromDegreesArray([120, 30, 121, 31])
                }

            }, false),
            material: new Cesium.PolylineGlowMaterialProperty({
                color: Cesium.Color.RED,
                glowPower: 0.2
            }),
            width: 20
        }
    })
    viewer.zoomTo(obj.glowLine)
}
// 删除发光的线
const deleteGlowLine = () => {
    viewer.entities.remove(obj.glowLine)
}




onMounted(() => {
    const Cartesian = Cesium.Cartesian3.fromDegrees(119.56985, 34.20513, 5000)
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

        //自定义图层
        // baseLayer: false,
        // baseLayerPicker: false,
        // terrain: Cesium.Terrain.fromWorldTerrain({
        //     requestWaterMask: true,//水面特效
        //     requestVertexNormals: true// 地形数据
        // }),

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
    overflow: hidden;


    position: relative;
}

.btnBox {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 999;
}
</style>