<template>
    <div id="cesiumContainer">
        <div class="btnBox">
            <a-space wrap>
                <a-button type="primary" @click="addTurfLine">添加turf线</a-button>
                <a-button type="primary" @click="addTurfMultiLine">添加多线串</a-button>
                <a-button type="primary" @click="addTopoJson">添加topoJson</a-button>
                <a-button type="primary" @click="addKmz">添加kmz</a-button>
                <a-button type="primary" @click="addPrimitive">添加primitive</a-button>
            </a-space>
            <p></p>
            <a-space wrap>
                <a-button type="primary" danger @click="delTurfLine">删除线</a-button>
                <a-button type="primary" danger @click="delTurfMultiLine">删除多线</a-button>
                <a-button type="primary" danger @click="delTopoJson">删除topoJson</a-button>
                <a-button type="primary" danger @click="delKmz">删除kmz</a-button>
                <a-button type="primary" danger @click="delPrimitive">删除primitive</a-button>
            </a-space>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
import * as turf from '@turf/turf'
let token = [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNGE4MDJhMy1kNTRlLTQzM2YtYjE1Yy0wOGMwMGVkYzA5ZjMiLCJpZCI6MTI1NDkxLCJpYXQiOjE3MjkxNDIzNzl9.6tsKL09OwpW2n5FqxFl1dpEyvU6waQwAavIRby6Gqfw',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MDcwZDdlNS01ZGU2LTQwZWUtOTcwNy03ZTE0NTcwMmNlYjMiLCJpZCI6MTI1NDkxLCJpYXQiOjE2NzY4ODAzNDN9.Cy3uiLaWrd13KvTouVqA9YamkMj8d5ThDVloSWzW61E',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNjc5MGZkOC1lNWVlLTRkY2UtYmJmZC02YzUwNWFhZDIwNjAiLCJpZCI6MTI1NDkxLCJpYXQiOjE3Mjg5ODE5NjF9.wtnNY0g6Au1sLs7LFlWFtGxebl7AHNKDXx5lFYcnQFM',
]
Cesium.Ion.defaultAccessToken = token[Math.floor(Math.random() * token.length)];


let viewer;
let obj = {};

// 添加线
const addTurfLine = async () => {
    let linestring = turf.lineString([
        [-24, 63],
        [-23, 60],
        [-25, 65],
        [-20, 69],],
        { name: "line 1" },
    );

    let source = await Cesium.GeoJsonDataSource.load(linestring)
    // console.log('@@source:', source);
    // console.log('@@@linestring:', linestring);
    obj.line = source.entities.values[0]
    viewer.entities.add(obj.line)
    viewer.zoomTo(obj.line)
}

const delTurfLine = () => {
    viewer.entities.remove(obj.line)
}


// 添加多线
const addTurfMultiLine = async () => {
    let multiLine = turf.multiLineString([
        [
            [0, 0],
            [4, 4],
            [6, 7],
            [10, 10],
        ]
    ])

    obj.source = await Cesium.GeoJsonDataSource.load(multiLine)
    // console.log('@@@source:', source);
    viewer.dataSources.add(obj.source)
    viewer.zoomTo(obj.source)
}

// 删除多线
const delTurfMultiLine = () => {
    viewer.dataSources.remove(obj.source)
}

const addTopoJson = async () => {
    obj.topojson = await Cesium.GeoJsonDataSource.load('/topoJson/usa.topojson')
    viewer.dataSources.add(obj.topojson)
    viewer.zoomTo(obj.topojson)
}
// 删除TopJson
const delTopoJson = () => {
    viewer.dataSources.remove(obj.topojson)
}

// 添加kmz
const addKmz = async () => {
    obj.kmz = await Cesium.KmlDataSource.load('/kmz/gdp2008.kmz')
    viewer.dataSources.add(obj.kmz)
    viewer.zoomTo(obj.kmz)
}
// 删除kmz
const delKmz = () => {
    viewer.dataSources.remove(obj.kmz)
}

// 添加primitive
const addPrimitive = () => {
    obj.primitive = new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.EllipseGeometry({
                center: Cesium.Cartesian3.fromDegrees(115.0, 35.0),
                semiMinorAxis: 500000.0,
                semiMajorAxis: 1000000.0,
                rotation: Cesium.Math.PI_OVER_FOUR,
                vertexFormat: Cesium.VertexFormat.POSITION_AND_ST
            })
        }),
        appearance: new Cesium.EllipsoidSurfaceAppearance({
            material: new Cesium.Material({
                fabric: {
                    type: 'Color',
                    uniforms: {
                        color: new Cesium.Color(0.0, 0.0, 1.0, 0.5)
                    }
                }
            })
        })
    })
    viewer.scene.primitives.add(obj.primitive)
}

//删除 
const delPrimitive = () => {
    viewer.scene.primitives.remove(obj.primitive)
}

onMounted(() => {
    const Cartesian = Cesium.Cartesian3.fromDegrees(117.56985, 38.20513, 2000000)
    viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false, //是否显示动画控件
        baseLayerPicker: false, //是否显示图层选择控件
        geocoder: false, //是否显示地名查找控件
        timeline: false, //是否显示时间线控件
        sceneModePicker: false, //是否显示投影方式控件
        navigationHelpButton: false, //是否显示帮助信息控件
        fullscreenButton: false, //是否显示全屏按钮
        // infoBox: false, //是否显示点击要素之后显示的信息
        homeButton: false, //是否显示Home按钮
    });

    //相机
    viewer.camera.setView({
        destination: Cartesian,//初始位置
        orientation: {//初始方向
            heading: Cesium.Math.toRadians(-30), //表示绕 Z 轴旋转，控制物体的水平方向。
            pitch: Cesium.Math.toRadians(-90), //表示绕 X 轴旋转，控制物体的上下方向。
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