<template>
    <div id="cesiumContainer">
        <div class="btnBox">
            <a-space wrap>
                <a-button type="primary" @click="transToCartesian">经纬度转笛卡尔</a-button>
                <a-button type="primary" @click="transToLonLat">笛卡尔转经纬度</a-button>
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


// 经纬度转笛卡尔坐标
const transToCartesian = () => {
    // 返回的是一个笛卡尔坐标
    let cartesian = Cesium.Cartesian3.fromDegrees(120, 35, 20);//经度、纬度、高度
    console.log('@@cartesian转笛卡尔:', cartesian)
}
// 笛卡尔转经纬度
const transToLonLat = () => {
    // 返回弧度坐标
    let cartographic = Cesium.Cartographic.fromCartesian({
        x: -2615221.6116206213,
        y: 4529696.70437908,
        z: 3637878.3809068226
    })
    console.log('@@@cartographic转后的弧度：', cartographic);
    // 弧度转角度:方法一：
    // let lon = 180 / Math.PI * cartographic.longitude;//经度
    // let lat = 180 / Math.PI * cartographic.latitude;//纬度

    // 弧度转角度:方法二：
    let lon = Cesium.Math.toDegrees(cartographic.longitude)
    let lat = Cesium.Math.toDegrees(cartographic.latitude)
    console.log('@@@lon经度：', lon)
    console.log('@@@lat纬度：', lat)

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