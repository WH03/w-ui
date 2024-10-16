<template>
    <div id="cesiumContainer">
        <div class="btnBox">
            <a-space wrap>
                <a-button type="primary" @click="originLayerGaoDe1">高德图层1</a-button>
                <a-button type="primary" @click="originLayerGaoDe2">高德图层2</a-button>
                <a-button type="primary" @click="originLayer">默认图层</a-button>
            </a-space>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import * as Cesium from "cesium";
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwYjE4ZTFkNi05NjQ1LTQ5M2ItYWIxZi1jOGJiZGRkNjY5NzMiLCJpZCI6MTI1NDkxLCJpYXQiOjE3MjkwNjI4NTZ9.e994qsbMbFgrh_LTyD1HynYb8gXShuV8LqOPE-J87h0'



    let viewer;
    let gaodeLayer;

    const originLayerGaoDe1 = () => {

        viewer.imageryLayers.get(0).show = false;//删除底图
        var imagelyser = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider(//用ImageryLayer添加一个新的底图
            {
                url: " http://webrd01.is.autonavi.com/appmaptile?&scale=1&lang=zh_cn&style=8&x={x}&y={y}&z={z}"
            }
        ));
        viewer.imageryLayers.add(imagelyser);//将底图加到原来的球体上
    };

    // 默认图层
    const originLayerGaoDe2 = () => {
        viewer.imageryLayers.get(0).show = false;//删除底图
        gaodeLayer = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
            url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
            minimumLevel: 1,
            maximumLevel: 20
        }))

        viewer.imageryLayers.add(gaodeLayer); // 添加高德图层

    }



    //默认初始图层
    const originLayer = () => {
        // viewer.imageryLayers.removeAll(); // 移除当前图层
        // viewer.imageryLayers.get(0).show = false;//删除底图
        // viewer.imageryLayers.get(0).show = false;//删除底图
        // viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
        // if (viewer.imageryLayers.length > 1) {
        //     viewer.imageryLayers._layers.splice(1)

        // }

        viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
    }


    onMounted(() => {
        const Cartesian = Cesium.Cartesian3.fromDegrees(119.56985, 34.20513, 10000)

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
                heading: Cesium.Math.toRadians(-50), //初始方向
                pitch: Cesium.Math.toRadians(-50), //初始方向
                roll: Cesium.Math.toRadians(0),
            }
        })


        // //通过imageryLayers获取图层列表集合
        // var layers = viewer.scene.imageryLayers;
        // //图层列表集合的addImageryProvider方法:
        // //两个参数，第一参数是一个ImageryProvider函数，这个函数的作用是新建一个图层;第二个参数是index，Number类型，作用是指定新插入图层在图层列表集合中的索引(位置)，若不指定，默认新图层添加在最上层
        // //返回值是新添加到图层列表集合中的图层
        // var blackMarble = layers.addImageryProvider(
        //     new Cesium.UrlTemplateImageryProvider({
        //         url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
        //     })
        // );

        // //get或set图层透明度，范围是0-1
        // blackMarble.alpha = 1;

        // //get或set图层亮度，小于1图层更暗，大于1更亮
        // blackMarble.brightness = 5.0;


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