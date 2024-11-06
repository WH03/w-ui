<template>
    <div id="cesiumContainer">
        <div class="btnBox">
            <a-space wrap>
                <a-button type="primary" @click="showData">数据展示</a-button>
            </a-space>
            <p></p>
            <a-space wrap>
                <a-button type="primary" danger @click="deleteShowData">关闭</a-button>
            </a-space>
        </div>
    </div>

</template>

<script setup>
    import { ref, reactive, onMounted } from "vue";
    import * as Cesium from "cesium";

    let token = [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNGE4MDJhMy1kNTRlLTQzM2YtYjE1Yy0wOGMwMGVkYzA5ZjMiLCJpZCI6MTI1NDkxLCJpYXQiOjE3MjkxNDIzNzl9.6tsKL09OwpW2n5FqxFl1dpEyvU6waQwAavIRby6Gqfw',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MDcwZDdlNS01ZGU2LTQwZWUtOTcwNy03ZTE0NTcwMmNlYjMiLCJpZCI6MTI1NDkxLCJpYXQiOjE2NzY4ODAzNDN9.Cy3uiLaWrd13KvTouVqA9YamkMj8d5ThDVloSWzW61E',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNjc5MGZkOC1lNWVlLTRkY2UtYmJmZC02YzUwNWFhZDIwNjAiLCJpZCI6MTI1NDkxLCJpYXQiOjE3Mjg5ODE5NjF9.wtnNY0g6Au1sLs7LFlWFtGxebl7AHNKDXx5lFYcnQFM',
    ];
    Cesium.Ion.defaultAccessToken = token[Math.floor(Math.random() * token.length)];
    let viewer;
    let obj = reactive({})


    // const box = viewer.entities.add({
    //     id: 'box',
    //     name: '立方体box',
    //     position: Cesium.Cartesian3.fromDegrees(boxData.lon, boxData.lat, 0),
    //     box: {
    //         dimensions: new Cesium.Cartesian3(1, 1, boxData.value),
    //         material: Cesium.Color.fromCssColorString('red')
    //     }
    // })

    const showData = async () => {
        let boxData = reactive([
            {
                lon: 119.56985, //经度
                lat: 34.20516,  //纬度
                value: 1.5,
                color: 'YELLOW'
            },
            {
                lon: 119.56988, //经度
                lat: 34.20519,  //纬度
                value: 3,
                color: 'GREEN'

            }, {
                lon: 119.56982, //经度
                lat: 34.20510,  //纬度
                value: 6,
                color: 'RED'

            },
        ])


        boxData.forEach((item, index) => {
            const basePosition = Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 0); // 立方体创建的基准位置
            obj.box = viewer.entities.add({
                id: `box${index + 1}`,
                name: `立方体box${index + 1}`,
                position: basePosition,
                box: {
                    dimensions: new Cesium.Cartesian3(3, 3, item.value),
                    material: Cesium.Color.fromCssColorString(item.color)
                }
            })


            //添加文本
            obj.label = viewer.entities.add({
                id: `文本${index + 1}`,
                name: `文本${index + 1}`,
                position: basePosition,
                label: {
                    text: `立方体box${index + 1}`,
                    fillColor: Cesium.Color.AQUA,
                    font: '12px'
                }

            })



        });
    }



    const deleteShowData = () => {
        viewer.entities.removeAll();
    }


    onMounted(() => {
        const Cartesian = Cesium.Cartesian3.fromDegrees(119.56985, 34.20513, 50)
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
        position: relative;
    }

    .btnBox {
        position: absolute;
        top: 1%;
        left: 1%;
        z-index: 999;
    }
</style>