<template>
    <div id="cesiumContainer">
        <div class="btnBox">
            <a-space wrap>
                <a-button type="primary" @click="drawPoint">画点</a-button>
                <a-button type="primary" @click="drawLine">画线</a-button>
            </a-space>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import * as Cesium from "cesium";
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNjc5MGZkOC1lNWVlLTRkY2UtYmJmZC02YzUwNWFhZDIwNjAiLCJpZCI6MTI1NDkxLCJpYXQiOjE3Mjg5ODE5NjF9.wtnNY0g6Au1sLs7LFlWFtGxebl7AHNKDXx5lFYcnQFM'

    let viewer;



    const drawPoint = () => {
        const entity = viewer.entities.add({
            id: 'point',
            name: '点',
            show: true,
            position: Cesium.Cartesian3.fromDegrees(119.52685, 34.28513, 3000),
            point: {
                color: Cesium.Color.RED,
                pixelSize: 50,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthDistance: Number.POSITION_INFINITY,//无论如何缩放，标记点不被地形遮挡
            }
        })
        // viewer.flyTo(entity)
    }
    const drawLine = () => {
        const entity = viewer.entities.add({
            id: 'line',
            name: '线',
            show: true,
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([
                    119.52685, 34.28513,
                    119.53995, 34.30513,
                    119.53995, 34.26513,
                    119.55995, 34.32513,


                ]),
                width: 3,
                material: Cesium.Color.BLUE.withAlpha(0.5)
            }
        })

    }







    onMounted(() => {
        //返回的是笛卡尔坐标   经纬度转笛卡尔坐标
        //经度 纬度 高度
        //响水县坐标
        const Cartesian = Cesium.Cartesian3.fromDegrees(119.56985, 34.20513, 5000)
        // console.log(Cartesian, 'Cartesian');
        //viewer是所有Api的开始
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

            terrain: Cesium.Terrain.fromWorldTerrain({
                requestWaterMask: true,//水面特效
                requestVertexNormals: true// 地形数据
            }),

        })


        //相机
        viewer.camera.setView({
            destination: Cartesian,//初始位置
            orientation: {//初始方向
                heading: Cesium.Math.toRadians(0), //初始方向
                pitch: Cesium.Math.toRadians(-30), //初始方向
                roll: Cesium.Math.toRadians(0),
            }
        })
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

        .btnBox {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 999;
        }
    }
</style>