<template>
    <div id="cesiumContainer">
        <div class="box">
            <a-card title="点击画点" :bordered="false">
                <p>点击画点</p>
            </a-card>
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

// 画点
const addPoint = (pos) => {
    obj.point = viewer.entities.add({
        name: 'point',
        position: pos,
        point: {
            color: Cesium.Color.RED,
            pixelSize: 30,
            disableDepthDistance: Number.POSITION_INFINITY,//无论如何缩放，标记点不被地形遮挡
        }
    })
}

let lineList = ref([])
// 画线
const drawLine = (pos) => {
    if (pos.length < 1) return;
    console.log('pos$##', pos);
    obj.line = viewer.entities.add({
        // id: 'line',
        name: '线',
        show: true,
        polyline: {
            // positions: [
            //     {
            //         x: -2602061.7890276657, y: 4582285.554964762, z: 3581350.49611014
            //     },
            //     {
            //         x: -2605053.124308194, y: 4586585.742298098, z: 3573726.1172516425
            //     }
            // ],
            // position: pos,
            position: pos,
            width: 30,
            material: Cesium.Color.BLUE.withAlpha(0.5)
        }
    })
    viewer.zoomTo(obj.line)
}

// 画面
const drawPlane = () => {
    obj.plane = viewer.entities.add({
        id: 'polygon',
        name: '平面',
        show: true,
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
                119.55, 34.28,
                119.57, 34.28,
                119.57, 34.25,
                119.55, 34.25,
            ]),
            material: Cesium.Color.AQUA.withAlpha(0.8)
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
        console.log('e:', e)
        // pick方法会返回该位置的实体信息，如果没有选中实体则返回undefined
        let pick = viewer.scene.pick(e.position);
        // pickPosition方法返回的是该点击位置的三维世界坐标（Cartesian3），
        // 如果点击位置没有明确的3D对象，它返回undefined
        let newPosition = viewer.scene.pickPosition(e.position)
        console.log('###newPosition', newPosition);
        // newPosition.map(item => {
        //     console.log('@@@item', item);
        // })
        addPoint(newPosition)

        lineList.value.push(newPosition)
        drawLine(lineList.value)

        if (Cesium.defined(pick)) {
            // 将返回的三维坐标（Cartesian3）转换为地理坐标（经度、纬度、高度）
            let cartographic = Cesium.Cartographic.fromCartesian(newPosition);
            // 使用Cesium.Math.toDegrees将弧度转为度
            let lon = Cesium.Math.toDegrees(cartographic.longitude);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let MouseHeight = cartographic.height; // 获取鼠标点击点的高度（即Z坐标）
            // 打印经度、纬度和高度
            console.log(lon, lat, MouseHeight);
            // 打印当前相机视图信息
            console.log(viewer.camera);
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //右键点击操作
    handler.setInputAction(function (click) {
        tooltip.style.display = "none";
        tooltip.innerHTML = "左键单击绘制,右键结束绘制";
        tempPoints = [];
        handler.destroy();//关闭事件句柄
        handler = null;
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


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

.box {
    width: 300px;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 999;
}
</style>