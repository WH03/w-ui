<template>
    <div id="cesiumContainer"></div>
</template>

<script setup>
    import { onMounted } from "vue";
    import * as Cesium from "cesium";

    onMounted(() => {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNjc5MGZkOC1lNWVlLTRkY2UtYmJmZC02YzUwNWFhZDIwNjAiLCJpZCI6MTI1NDkxLCJpYXQiOjE3Mjg5ODE5NjF9.wtnNY0g6Au1sLs7LFlWFtGxebl7AHNKDXx5lFYcnQFM'

        //自定义图层
        const esri = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
            url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
            minimumLevel: 1,
            maximumLevel: 18
        }))







        //返回的是笛卡尔坐标   经纬度转笛卡尔坐标
        //经度 纬度 高度
        //响水县坐标
        const Cartesian = Cesium.Cartesian3.fromDegrees(119.56985, 34.20513, 10000)
        // console.log(Cartesian, 'Cartesian');
        //viewer是所有Api的开始
        const viewer = new Cesium.Viewer('cesiumContainer', {
            animation: false, //是否显示动画控件
            baseLayerPicker: false, //是否显示图层选择控件
            geocoder: false, //是否显示地名查找控件
            timeline: false, //是否显示时间线控件
            sceneModePicker: false, //是否显示投影方式控件
            navigationHelpButton: false, //是否显示帮助信息控件
            fullscreenButton: false, //是否显示全屏按钮
            infoBox: false, //是否显示点击要素之后显示的信息
            homeButton: false, //是否显示Home按钮

            baseLayer: esri,

            //自定义图层
            // baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
            //     url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
            //     minimumLevel: 1,
            //     maximumLevel: 18
            // })),

            terrain: Cesium.Terrain.fromWorldTerrain({
                requestWaterMask: true,//水面特效
                requestVertexNormals: true// 地形数据
            }),

        })


        //相机
        viewer.camera.setView({
            destination: Cartesian,//初始位置
            orientation: {//初始方向
                heading: Cesium.Math.toRadians(-50), //初始方向
                pitch: Cesium.Math.toRadians(-50), //初始方向
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
    }
</style>