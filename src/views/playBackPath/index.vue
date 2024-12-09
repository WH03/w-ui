<template>
    <div id="cesiumContainer">
        <div class="box">
            <a-space wrap>
                <a-button type="primary" @click="startFly">开始飞行</a-button>
                <a-button type="primary" @click="pauseFlight">暂停飞行</a-button>
                <a-button type="primary" @click="resumeFlight">继续飞行</a-button>
                <a-button type="primary" danger @click="stopFlight">停止飞行</a-button>
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

    // 设定一条指定的飞行路径（可以是任意多个经纬度点）
    const flightPath = [
        { lon: 115.110693, lat: 32.0994841 },  // 起点
        { lon: 115.120693, lat: 32.1014841 },
        { lon: 115.130693, lat: 32.1134841 },
        { lon: 115.140693, lat: 32.1054841 },  // 终点
    ];

    /*  生成圆形飞行路径及随机高度：
        函数用来计算并返回一个圆形轨迹的 位置属性。
        lon 和 lat 表示圆心的经度和纬度，radius 表示半径。
    */
    // 生成飞行路径的位置属性
    function computeFlightPath(path, start) {
        const property = new Cesium.SampledPositionProperty();
        for (let i = 0; i < path.length; i++) {
            const point = path[i];
            const time = Cesium.JulianDate.addSeconds(start, i * 100, new Cesium.JulianDate()); // 每个点1分钟的间隔
            const position = Cesium.Cartesian3.fromDegrees(
                point.lon,
                point.lat,

                // Cesium.Math.nextRandomNumber() * 500 + 1750 // 随机高度
            );
            property.addSample(time, position);
        }
        return property;
    }


    // 创建虚线路径

    // 加载模型和路径，确保模型在路径起点
    function loadModelAndPath(flightPath) {
        const start = Cesium.JulianDate.fromDate(new Date(2024, 2, 25, 16));
        let path = []
        flightPath.map((point) => {
            // console.log(`output->point`, point)
            path.push(Cesium.Cartesian3.fromDegrees(point.lon, point.lat))
        });

        const position = computeFlightPath(flightPath, start);

        // 初始位置放置模型在路径的起点
        const initialPosition = Cesium.Cartesian3.fromDegrees(flightPath[0].lon, flightPath[1].lat, 0); // 高度固定为1750m，或按需求调整
        // 添加路径和模型到场景
        obj.model = viewer.entities.add({
            position: initialPosition,
            orientation: new Cesium.VelocityOrientationProperty(position),
            name: 'fly',
            id: 'fly',
            model: {
                uri: "/models/DJ.glb", // 模型文件路径
                minimumPixelSize: 128,
            },
        });
        // obj.model.position = position;
        console.log(`output->obj.model`, obj.model)
        obj.line = viewer.entities.add({
            polyline: {
                positions: path,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,  // 虚线的颜色
                    dashLength: 16.0,            // 虚线的长度
                    gapColor: Cesium.Color.RED,  // 虚线的间隔颜色
                    dashPattern: 0.5,            // 虚线间隔的比例，0.5表示长短均匀
                }),
                width: 3,  // 虚线的宽度
            }
        });

        // 确保相机能够看到模型和路径
        viewer.zoomTo(obj.model);
    }




    // 开始飞行
    const startFly = () => {
        const start = Cesium.JulianDate.fromDate(new Date(2024, 2, 25, 16));
        const stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());

        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // 时间停止而不是循环
        viewer.clock.multiplier = 10; // 时间流逝的速度是实际时间的10倍

        viewer.timeline.zoomTo(start, stop);

        // 更新路径并开始飞行
        const position = computeFlightPath(flightPath, start);
        obj.model.position = position;
        obj.model.orientation = new Cesium.VelocityOrientationProperty(position);

        console.log(`output->viewer点击飞行`, viewer)

        viewer.trackedEntity = obj.model;
        // obj.model.position = position;
    };



    // 暂停飞行
    // let isPaused = ref(false);  // 用来表示飞行是否暂停
    // const pauseFly = () => {
    //     if (isPaused.value) {
    //         // 如果是暂停状态，恢复飞行
    //         resumeFlight();
    //     } else {
    //         // 如果是正在飞行，暂停飞行
    //         pauseFlight();
    //     }
    // }

    // 暂停飞行
    let isPaused = ref(false);  // 用来表示飞行是否暂停
    function pauseFlight() {
        viewer.clock.shouldAnimate = false; // 停止时钟的动画（即暂停）
        isPaused.value = true; // 标记为暂停
    }

    // 恢复飞行
    function resumeFlight() {
        viewer.clock.shouldAnimate = true; // 恢复时钟的动画（即继续）
        isPaused.value = false; // 标记为恢复
    }
    // 停止飞行
    const stopFlight = () => {
        viewer.clock.shouldAnimate = false;  // 停止时钟动画
        resetModelPosition();  // 重置模型位置到起点
    };

    // 重置模型位置到原点
    function resetModelPosition() {
        // 获取飞行路径的起始点
        const startPoint = flightPath[0];
        const startPosition = Cesium.Cartesian3.fromDegrees(startPoint.lon, startPoint.lat, 1750);  // 设置初始高度

        // 将模型设置回原点位置
        if (obj.model) {
            obj.model.position = startPosition;  // 更新模型的位置
        }

        // 可选：重置时钟，使得模型回到起始时间
        viewer.clock.currentTime = viewer.clock.startTime;  // 重置当前时间到起始时间
    }


    onMounted(() => {
        const Cartesian = Cesium.Cartesian3.fromDegrees(115.110693, 32.0994841, 300)
        viewer = new Cesium.Viewer('cesiumContainer', {
            // animation: false, //是否显示动画控件
            // baseLayerPicker: false, //是否显示图层选择控件
            // geocoder: false, //是否显示地名查找控件
            // timeline: false, //是否显示时间线控件
            // sceneModePicker: false, //是否显示投影方式控件
            // navigationHelpButton: false, //是否显示帮助信息控件
            // fullscreenButton: false, //是否显示全屏按钮
            // infoBox: false, //是否显示点击要素之后显示的信息
            // homeButton: false, //是否显示Home按钮
            // shouldAnimate: true, // Enable animations

            infoBox: false, //Disable InfoBox widget
            selectionIndicator: false, //Disable selection indicator
            shouldAnimate: true, // Enable animations
            terrain: Cesium.Terrain.fromWorldTerrain(),

            animation: false, //是否显示动画控件
            baseLayerPicker: false, //是否显示图层选择控件
            geocoder: false, //是否显示地名查找控件
            // timeline: false, //是否显示时间线控件
            sceneModePicker: false, //是否显示投影方式控件
            navigationHelpButton: false, //是否显示帮助信息控件
            fullscreenButton: false, //是否显示全屏按钮
            infoBox: false, //是否显示点击要素之后显示的信息
            homeButton: false, //是否显示Home按钮

        });


        // 相机
        viewer.camera.setView({
            destination: Cartesian,//初始位置
            orientation: {//初始方向
                heading: Cesium.Math.toRadians(0), //表示绕 Z 轴旋转，控制物体的水平方向。
                pitch: Cesium.Math.toRadians(-45), //表示绕 X 轴旋转，控制物体的上下方向。
                roll: Cesium.Math.toRadians(0),//表示绕 Y 轴旋转，控制物体的倾斜或翻转。
            }
        })

        Cesium.Math.setRandomNumberSeed(3);
        loadModelAndPath(flightPath); // 初始化时加载模型和路径
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
        // width: 300px;
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 999;
    }
</style>