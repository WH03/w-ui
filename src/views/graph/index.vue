<template>
    <div id="cesiumContainer">
        <div class="btnBox">
            <a-space wrap>
                <a-button type="primary" @click="drawPoint">画点</a-button>
                <a-button type="primary" @click="drawLine">画线</a-button>
                <a-button type="primary" @click="drawPlane">画面</a-button>
                <a-button type="primary" @click="drawRectangle">创建矩形</a-button>
                <a-button type="primary" @click="drawCorridor">创建管道</a-button>
                <a-button type="primary" @click="drawSphere">创建球体</a-button>
                <a-button type="primary" @click="drawBox">创建立方体</a-button>
                <a-button type="primary" @click="drawCone">创建圆锥体</a-button>
                <a-button type="primary" @click="drawWall">创建墙体</a-button>
            </a-space>
            <p></p>
            <a-space wrap>
                <a-button type="primary" danger @click="removePoint">删除点</a-button>
                <a-button type="primary" danger @click="removeLine">删除线</a-button>
                <a-button type="primary" danger @click="removePlane">删除面 </a-button>
                <a-button type="primary" danger @click="removeRectangle">删除矩形</a-button>
                <a-button type="primary" danger @click="removeCorridor">删除管道</a-button>
                <a-button type="primary" danger @click="removeSphere">删除球体</a-button>
                <a-button type="primary" danger @click="removeBox">删除立方体</a-button>
                <a-button type="primary" danger @click="removeCone">删除圆锥体</a-button>
                <a-button type="primary" danger @click="removeWall">删除墙体</a-button>
                <a-button type="primary" danger @click="removeAll">删除所有</a-button>
            </a-space>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, reactive } from "vue";
    import * as Cesium from "cesium";
    let token = [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNGE4MDJhMy1kNTRlLTQzM2YtYjE1Yy0wOGMwMGVkYzA5ZjMiLCJpZCI6MTI1NDkxLCJpYXQiOjE3MjkxNDIzNzl9.6tsKL09OwpW2n5FqxFl1dpEyvU6waQwAavIRby6Gqfw',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MDcwZDdlNS01ZGU2LTQwZWUtOTcwNy03ZTE0NTcwMmNlYjMiLCJpZCI6MTI1NDkxLCJpYXQiOjE2NzY4ODAzNDN9.Cy3uiLaWrd13KvTouVqA9YamkMj8d5ThDVloSWzW61E',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNjc5MGZkOC1lNWVlLTRkY2UtYmJmZC02YzUwNWFhZDIwNjAiLCJpZCI6MTI1NDkxLCJpYXQiOjE3Mjg5ODE5NjF9.wtnNY0g6Au1sLs7LFlWFtGxebl7AHNKDXx5lFYcnQFM',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2NWRiNjJkNi02MWFmLTQxZjAtYmViZS01MjViZDU5NjlhNTIiLCJpZCI6MTI1NDkxLCJpYXQiOjE3MjkyMzgyMjR9.ob2-foAxkxsfvi60OTR6HLhTaV_E1QGKjUlAEY3CpCM',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNzA1NmQ2MS0xMTgxLTQ4OTItOTgyNC0zYTVjNjhjYTYwN2YiLCJpZCI6MTI1NDkxLCJpYXQiOjE3MjkyMzgyNjF9.kf0IDvgQHGgCL4vAHTRBLdABwmuEXxd4_KeJ-xgQBQ8',
    ]
    Cesium.Ion.defaultAccessToken = token[Math.floor(Math.random() * token.length)];

    let viewer = reactive({});  //容器
    let obj = reactive({})

    // 画点
    const drawPoint = () => {
        obj.point = viewer.entities.add({
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
    }

    // 删除点
    const removePoint = () => {
        viewer.entities.remove(obj.point);//如果已删除则返回true,如果该集合中不存在该实体，则返回false
    }

    // 画线
    const drawLine = () => {
        obj.line = viewer.entities.add({
            id: 'line',
            name: '线',
            show: true,
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([
                    119.52685, 34.28513,
                    118.53995, 34.30513,
                    119.53995, 34.26513,
                    119.55995, 34.32513,
                ]),
                width: 3,
                material: Cesium.Color.BLUE.withAlpha(0.5)
            }
        })
    }
    // 删除线
    const removeLine = () => {
        viewer.entities.remove(obj.line);
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
    // 删除面
    const removePlane = () => {
        viewer.entities.remove(obj.plane)
    }

    // 创建矩形
    const drawRectangle = () => {
        obj.rectangle = viewer.entities.add({
            id: 'rectangle',
            name: '矩形',
            show: true,
            rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(119.53, 34.25, 119.55, 34.27),//参数依次为为西经、南纬、东经和北纬度数
                material: new Cesium.ColorMaterialProperty(
                    Cesium.Color.BLUE.withAlpha(0.5)
                )
            }
        })
    }
    // 删除矩形
    const removeRectangle = () => {
        viewer.entities.remove(obj.rectangle)
    }

    // 创建管道
    const drawCorridor = () => {
        obj.corridor = viewer.entities.add({
            id: 'corridor',
            name: '管道',
            show: true,
            corridor: {
                positions: Cesium.Cartesian3.fromDegreesArray([
                    119.58, 34.28,  //起点
                    119.57, 34.28,  //拐点
                    119.57, 34.20,//终点
                ]),
                extrudedHeight: 100, //通道高度
                width: 100,  //通道宽度
                outline: true,
                outlineColor: Cesium.Color.WHITE,
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                // cornerType: Cesium.CornerType.MITERED,  //夹角是直角
                cornerType: Cesium.CornerType.ROUNDED,  //夹角是圆角
                material: new Cesium.ColorMaterialProperty(
                    Cesium.Color.RED.withAlpha(0.5)
                ),

            }
        })
    }
    // 删除管道
    const removeCorridor = () => {
        viewer.entities.remove(obj.corridor)
    }

    // 创建球体
    const drawSphere = () => {
        obj.sphere = viewer.entities.add({
            // id:'sphere',
            name: '球体',
            position: Cesium.Cartesian3.fromDegrees(119.55, 34.27, 300),
            ellipsoid: {
                radii: new Cesium.Cartesian3(300, 300, 300), //x、y、z方向长度
                material: Cesium.Color.YELLOW.withAlpha(0.5),
                outline: true,
                outlineColor: Cesium.Color.BLACK,
            }
        })
    }
    // 删除球体
    const removeSphere = () => {
        viewer.entities.remove(obj.sphere)
    }

    // 创建立方体
    const drawBox = () => {
        obj.box = viewer.entities.add({
            name: 'box',
            position: Cesium.Cartesian3.fromDegrees(119.56, 34.27, 200),
            box: {
                dimensions: new Cesium.Cartesian3(500, 500, 500),
                material: Cesium.Color.ANTIQUEWHITE
            }
        })
    }
    // 删除立方体
    const removeBox = () => {
        viewer.entities.remove(obj.box)
    }

    //创建圆锥体
    const drawCone = () => {
        obj.cone = viewer.entities.add({
            name: '圆锥体',
            position: Cesium.Cartesian3.fromDegrees(119.56, 34.27, 200),
            cylinder: {
                length: 4000,  //圆柱体高度
                topRadius: 0,    //顶面半径。如果设置和底面半径相等则为圆柱体
                bottomRadius: 1000,  //底面半径
                material: Cesium.Color.ALICEBLUE
            }
        })
    }
    // 删除圆锥体
    const removeCone = () => {
        viewer.entities.remove(obj.cone)
    }

    // 创建墙体
    const drawWall = () => {
        obj.wall = viewer.entities.add({
            id: 'wall',
            name: '墙',
            show: true,
            wall: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                    [
                        119.56, 34.29, 200,
                        119.58, 34.29, 200,
                        119.58, 34.25, 200,
                        119.56, 34.25, 200,
                        119.56, 34.29, 200,
                    ]
                ),
                material: Cesium.Color.AQUAMARINE
            }
        })
    }
    // 删除墙体
    const removeWall = () => {
        viewer.entities.remove(obj.wall)
    }

    const removeAll = () => {
        viewer.entities.removeAll()
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