<template>
    <div id="cesiumContainer">
        <div class="btnBox">
            <a-space wrap>
                <a-button type="primary" @click="flyTo">飞行</a-button>
                <a-button type="primary" @click="lookAt">锁定视角</a-button>
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

// 设置相机
/*
    heading：左右摇头
    pitch：点头
    roll：歪头
*/
const flyTo = () => {
    const position = Cesium.Cartesian3.fromDegrees(120, 40, 20000);
    // setView：定义相机目的地
    viewer.camera.flyTo({
        destination: position,//位置
        duration: 3,//单位：秒
        orientation: {//方向,默认朝下(0,-90,0)
            heading: Cesium.Math.toRadians(-90),
            pitch: Cesium.Math.toRadians(0),
            roll: Cesium.Math.toRadians(0)//歪头
        }
    })
}

// lookAt:视角锁在哪里

const lookAt = () => {
    const position = Cesium.Cartesian3.fromDegrees(110, 20);
    viewer.camera.lookAt(
        position,
        // 
        new Cesium.HeadingPitchRange(
            Cesium.Math.toRadians(0),
            Cesium.Math.toRadians(-90),
            20000
        )
    )
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