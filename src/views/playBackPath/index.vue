<template>
    <div id="cesiumContainer">
        <div class="box">
            <a-space wrap>
                <a-button type="primary" @click="playBackPath">轨迹回放</a-button>
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


// //轨迹回放
// function playBackPath(viewer) {
//     //Set bounds of our simulation time
//     const start = Cesium.JulianDate.fromDate(new Date(2024, 2, 25, 16));
//     const stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());

//     //Make sure viewer is at the desired time.
//     viewer.clock.startTime = start.clone();
//     viewer.clock.stopTime = stop.clone();
//     viewer.clock.currentTime = start.clone();
//     viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
//     viewer.clock.multiplier = 10;

//     //Set timeline to simulation bounds
//     viewer.timeline.zoomTo(start, stop);

//     //Generate a random circular pattern with varying heights.
//     function computeCirclularFlight(lon, lat, radius) {
//         const property = new Cesium.SampledPositionProperty();
//         for (let i = 0; i <= 360; i += 45) {
//             const radians = Cesium.Math.toRadians(i);
//             const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
//             const position = Cesium.Cartesian3.fromDegrees(
//                 lon + radius * 1.5 * Math.cos(radians),
//                 lat + radius * Math.sin(radians),
//                 Cesium.Math.nextRandomNumber() * 500 + 1750,
//             );
//             property.addSample(time, position);

//             //Also create a point for each sample we generate.
//             viewer.entities.add({
//                 position: position,
//                 point: {
//                     pixelSize: 8,
//                     color: Cesium.Color.TRANSPARENT,
//                     outlineColor: Cesium.Color.YELLOW,
//                     outlineWidth: 3,
//                 },
//             });
//         }
//         return property;
//     }

//     //Compute the entity position property.
//     const position = computeCirclularFlight(-112.110693, 36.0994841, 0.03);
//     obj.model = viewer.entities.add({
//         availability: new Cesium.TimeIntervalCollection([
//             new Cesium.TimeInterval({
//                 start: start,
//                 stop: stop,
//             }),
//         ]),
//         position: position,
//         orientation: new Cesium.VelocityOrientationProperty(position),
//         model: {
//             uri: "/models/CesiumAir/Cesium_Air.glb",
//             minimumPixelSize: 128
//         },
//         path: {
//             resolution: 1,
//             material: new Cesium.PolylineGlowMaterialProperty({
//                 glowPower: 0.1,
//                 color: Cesium.Color.YELLOW,
//             }),
//             width: 10,
//         },
//     })
//     // viewer.trackedEntity = obj.model;
//     // viewer.zoomTo(obj.model)
// }


// 设定一条指定的飞行路径（可以是任意多个经纬度点）
const flightPath = [
    { lon: 115.110693, lat: 32.0994841 },  // 起点
    { lon: 115.120693, lat: 32.1014841 },
    { lon: 115.130693, lat: 32.1034841 },
    { lon: 115.140693, lat: 32.1054841 },  // 终点
];

/*  生成圆形飞行路径及随机高度：
    函数用来计算并返回一个圆形轨迹的 位置属性。
    lon 和 lat 表示圆心的经度和纬度，radius 表示半径。
*/
// function computeCirclularFlight(path) {
//     const property = new Cesium.SampledPositionProperty();
//     for (let i = 0; i <= path.length; i += 45) {
//         const point = path[i];
//         const time = Cesium.JulianDate.addSeconds(start, i * 60, new Cesium.JulianDate());// 每个点1分钟的间隔
//         // 每隔 45 度生成一个新的位置，计算出的圆形轨迹将位于指定的经纬度周围。每个位置有一个随机的高度，范围是 1750 到 2250 米之间。
//         const position = Cesium.Cartesian3.fromDegrees(
//             point.lon,
//             point.lat,
//             Cesium.Math.nextRandomNumber() * 500 + 1750  // 随机高度
//         );
//         property.addSample(time, position);

//         //每生成一个位置，都会在 Cesium 中创建一个小的点（point），表示每个轨迹点的位置。创建一个点表示每个样本的生成位置
//         viewer.entities.add({
//             position: position,
//             point: {
//                 pixelSize: 8,
//                 color: Cesium.Color.TRANSPARENT,
//                 outlineColor: Cesium.Color.YELLOW,
//                 outlineWidth: 3,
//             },
//         });
//     }
//     return property;
// }


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
    });


    //相机
    // viewer.camera.setView({
    //     destination: Cartesian,//初始位置
    //     orientation: {//初始方向
    //         heading: Cesium.Math.toRadians(0), //表示绕 Z 轴旋转，控制物体的水平方向。
    //         pitch: Cesium.Math.toRadians(-30), //表示绕 X 轴旋转，控制物体的上下方向。
    //         roll: Cesium.Math.toRadians(0),//表示绕 Y 轴旋转，控制物体的倾斜或翻转。
    //     }
    // })
    //Set the random number seed for consistent results.
    Cesium.Math.setRandomNumberSeed(3);



    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(e => {
        console.log('e:', e)
        // pick方法会返回该位置的实体信息，如果没有选中实体则返回undefined
        let pick = viewer.scene.pick(e.position);
        // pickPosition方法返回的是该点击位置的三维世界坐标（Cartesian3），
        // 如果点击位置没有明确的3D对象，它返回undefined
        let newPosition = viewer.scene.pickPosition(e.position)
        console.log('###newPosition', newPosition);

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



    //将指定的日期和时间（2024年3月25日16:00）转换为 Cesium 的 JulianDate 类型，JulianDate 是 Cesium 中用来表示时间的类。
    const start = Cesium.JulianDate.fromDate(new Date(2024, 2, 25, 16));
    // 通过调用 Cesium.JulianDate.addSeconds() 方法，在 start 的基础上增加 360 秒（即 6 分钟），设定仿真结束的时间。
    const stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());
    // 设置仿真的开始和结束时间。
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    // 初始化当前时间为开始时间。
    viewer.clock.currentTime = start.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //表示时间在结束后停止，而不是循环。
    viewer.clock.multiplier = 10;// 设置时间流逝的速度，10 表示时间流逝的速度是实际时间的10倍。

    //通过 viewer.timeline.zoomTo() 设置时间轴的缩放范围，使时间轴显示从 start 到 stop 这段时间。
    viewer.timeline.zoomTo(start, stop);


    function computeFlightPath(path) {
        // 我们首先创建一个 Cesium.SampledPositionProperty 对象。这个对象用于存储位置样本（即不同时间点的位置），并允许我们将其应用到 Cesium 实体 中，使实体能够在仿真中沿着这些位置移动。
        const property = new Cesium.SampledPositionProperty();
        for (let i = 0; i < path.length; i++) {
            const point = path[i];
            // 这里我们为每个路径点计算一个时间值。假设每两个点之间的飞行时间为 60 秒（即 1 分钟）。start 是初始时间，i * 60 是将当前索引乘以 60 秒，来计算当前路径点的时间。
            // 比如，如果 i = 0，那么 time 是 start 时间。
            // 如果 i = 1，则 time 是 start + 60 秒，依此类推。
            // Cesium.JulianDate.addSeconds()：这个方法返回一个新的 JulianDate 对象，它是 start 时间加上 i * 60 秒的结果。这样，每个点都会有一个独立的时间。
            const time = Cesium.JulianDate.addSeconds(start, i * 60, new Cesium.JulianDate()); // 每个点1分钟的间隔
            const position = Cesium.Cartesian3.fromDegrees(
                point.lon,
                point.lat,
                // 生成一个随机数，然后乘以 500 并加上 1750。这样，飞机的高度会在 1750 米到 2250 米之间随机变化。
                Cesium.Math.nextRandomNumber() * 500 + 1750  // 随机高度
            );
            // 将当前时间 time 和位置 position 添加到 SampledPositionProperty 对象 property 中。
            property.addSample(time, position);

            // 为每个点添加一个小点来显示路径
            viewer.entities.add({
                position: position,
                point: {
                    pixelSize: 8,
                    color: Cesium.Color.TRANSPARENT,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 3,
                },
            });
        }
        return property;
    }





    //Compute the entity position property.
    const position = computeFlightPath(flightPath);

    obj.model = viewer.entities.add({
        // availability：定义实体的时间区间，确保该模型在仿真时间段内可见。
        availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({
                start: start,
                stop: stop,
            }),
        ]),
        position: position,
        // 使用 VelocityOrientationProperty 使模型根据其运动的速度方向进行旋转。
        orientation: new Cesium.VelocityOrientationProperty(position),
        model: {
            uri: "/models/CesiumAir/Cesium_Air.glb",
            minimumPixelSize: 128
        },
        path: {//为模型创建一条路径显示，使用 PolylineGlowMaterialProperty 给路径添加发光效果，颜色为黄色，宽度为 10。
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.1,
                color: Cesium.Color.YELLOW,
            }),
            width: 10,
        },
    })



    viewer.trackedEntity = obj.model;
    // viewer.zoomTo(obj.model)


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