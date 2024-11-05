<template>
    <div id="cesiumContainer">
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
    onMounted(() => {
        const Cartesian = Cesium.Cartesian3.fromDegrees(119.56985, 34.20513, 10000000);
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
            terrain: Cesium.Terrain.fromWorldTerrain({
                requestWaterMask: true,//水面特效
                requestVertexNormals: true// 地形数据
            }),

        });


        //相机
        viewer.camera.setView({
            destination: Cartesian,//初始位置
            orientation: {//初始方向
                heading: Cesium.Math.toRadians(30), //初始方向
                pitch: Cesium.Math.toRadians(-90), //初始方向
                roll: Cesium.Math.toRadians(-40),
            }
        })


        //通过imageryLayers获取图层列表集合
        let layers = viewer.scene.imageryLayers;
        //图层列表集合的addImageryProvider方法:
        //两个参数，第一参数是一个ImageryProvider函数，这个函数的作用是新建一个图层;第二个参数是index，Number类型，作用是指定新插入图层在图层列表集合中的索引(位置)，若不指定，默认新图层添加在最上层
        //返回值是新添加到图层列表集合中的图层
        let blackMarble = layers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
                url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
            })
        );

        //get或set图层透明度，范围是0-1
        blackMarble.alpha = 1;
        //get或set图层亮度，小于1图层更暗，大于1更亮
        blackMarble.brightness = 5.0;

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