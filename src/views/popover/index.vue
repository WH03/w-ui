<template>
    <div id="cesiumContainer">
        <div class="btnBox">
            <a-space wrap>
                <a-button type="primary" @click="addPopover">创建弹出框</a-button>
            </a-space>
            <p></p>
            <a-space wrap>
                <a-button type="primary" danger @click="deletePopover">删除弹出框</a-button>
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

// 添加弹出层
const addPopover = () => {
    let ele = `<a href='#'>你好</a>`
    createEle([120, 35], ele)
}
// 删除弹出层
const deletePopover = () => {

}

// 创建弹窗
const createEle = (position, ele, isBackHide = true) => {
    // 1、创建一个div容器
    let div = document.createElement('div');
    // 2、设置弹出框容器样式
    div.setAttribute('class', 'popover');
    // 3、设置容器样式
    div.style.width = '120px'
    div.style.height = '120px'
    div.style.position = 'absolute'
    div.style.background = 'aqua'
    div.innerHTML = ele
    let app = document.querySelector('#app')
    app.append(div)

    // 4、根据canvas画布中所有的点位信息进行动态改变容器的位置
    viewer.scene.preRender.addEventListener(() => {
        // 三维坐标
        let pos3 = Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2] || 0);
        // 二维坐标
        let scratch = new Cesium.Cartesian2();
        const canvasPosition = viewer.scene.cartesianToCanvasCoordinates(pos3, scratch);
        div.style.left = canvasPosition.x + 'px'
        div.style.top = canvasPosition.y + 'px'
        // 显示隐藏
        if (isBackHide) {
            let cameraPos = viewer.camera.position;
            //从笛卡尔坐标系转换为地理坐标系，并获取地面高度。
            // cartesianToCartographic 方法用于将笛卡尔坐标（Cartesian3）转换为地理坐标（Cartographic）。地理坐标包括经度、纬度和高度。
            let height = viewer.scene.globe.ellipsoid.cartesianToCartographic(cameraPos).height;

            if (!(height += 1 * viewer.scene.globe.ellipsoid.maximumRadius, Cesium.Cartesian3.distance(cameraPos, pos3) > height)) {
                div.style.display = 'block'
            } else {
                div.style.display = 'none'
            }
        }
    })
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