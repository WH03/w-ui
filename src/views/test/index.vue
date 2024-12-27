<template>
    <div class="canvasbox">
        <a-space>
            <!-- <a-button type="primary" @click="startDrawing">绘制多边形</a-button> -->
            <a-button type="primary" @click="togglePencilMode">标注</a-button>
            <a-button type="primary" @click="saveCanvas">保存</a-button>
            <!-- <a-button type="primary" @click="loadCanvas">加载</a-button> -->
            <a-button type="primary" @click="clearCanvas">清除</a-button>
            <a-button type="primary" @click="prevImage">上一张</a-button>
            <a-button type="primary" @click="nextImage">下一张</a-button>
        </a-space>
        <canvas ref="canvasRef" class="canvas" width="500" height="300"></canvas>

        <!-- 缩略图展示区域 -->
        <div class="thumbnail-container" ref="thumbnailContainer">
            <img v-for="(imageUrl, index) in imageUrls" :key="index" :src="imageUrl" alt="缩略图" class="thumbnail"
                :class="{ selected: index === currentImageIndex }" @click="selectImage(index)" />
        </div>
    </div>


</template>


<script setup>
    import { ref, onMounted } from 'vue';
    import { fabric } from 'fabric';
    import { cloneDeep } from 'lodash-es';
    // Vue ref 来引用 canvas 元素
    const canvasRef = ref(null);// canvas 元素的引用
    const fabricObj = ref(null);// fabric 实例
    const drawingEnabled = ref(false);// 是否允许绘制
    let isPencilMode = ref(false);// 是否是画笔模式
    const roofPoints = ref([]);// 屋顶的点集合
    const lines = ref([]);// 线条集合
    const pointArr = ref([]);// 点集合
    const savedCanvasData = ref({});// 保存的画布数据
    const roof = ref();// 屋顶对象

    // 图片资源及索引
    const imageUrls = ref([
        '/img/cover1.png',
        '/img/cover2.png',
        '/img/cover1.png',
        '/img/cover2.png',
        '/img/cover1.png',
        '/img/cover2.png',
        '/img/cover1.png',
        '/img/cover2.png',
    ]);
    const currentImageIndex = ref(0);// 当前图片索引
    // 缩略图容器的引用
    const thumbnailContainer = ref(null);

    // 加载当前图片
    const loadImage = () => {
        fabric.Image.fromURL(imageUrls.value[currentImageIndex.value], (img) => {
            const canvasWidth = fabricObj.value.getWidth();
            const canvasHeight = fabricObj.value.getHeight();
            const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);

            img.set({ left: 0, top: 0, selectable: false, evented: false, scaleX: scale, scaleY: scale });

            fabricObj.value.clear(); // 清除画布上的所有元素
            fabricObj.value.add(img); // 添加新图片
            fabricObj.value.renderAll(); // 重新渲染画布
        });
    };




    // 初始化事件绑定
    const initializeEvents = () => {
        fabricObj.value.on({
            'mouse:down': handleMouseDown,
            'mouse:move': handleMouseMove,
            'mouse:dblclick': handleMouseDblClick,
        });
    };

    // 上一张图片
    const prevImage = () => {
        currentImageIndex.value = (currentImageIndex.value - 1 + imageUrls.value.length) % imageUrls.value.length;
        loadImage();
        // loadCanvas();
        scrollToSelectedThumbnail();


    };

    // 下一张图片
    const nextImage = () => {
        currentImageIndex.value = (currentImageIndex.value + 1) % imageUrls.value.length;
        loadImage();
        // loadCanvas();
        scrollToSelectedThumbnail();
    };

    // 选择图片（点击缩略图）
    const selectImage = (index) => {
        currentImageIndex.value = index;
        loadImage();
        scrollToSelectedThumbnail();
    };


    const scrollToSelectedThumbnail = () => {
        const container = thumbnailContainer.value;
        const selectedThumbnail = container.children[currentImageIndex.value];
        scrollToCenter(container, selectedThumbnail);

    };


    // 开始绘制
    const startDrawing = () => {
        drawingEnabled.value = true;
        console.log('绘制开始！');
    };

    // 切换画笔模式
    const togglePencilMode = () => {
        isPencilMode.value = !isPencilMode.value;
        fabricObj.value.isDrawingMode = isPencilMode.value;
        fabricObj.value.freeDrawingBrush.width = 2; // 画笔宽度
        fabricObj.value.freeDrawingBrush.color = 'red'; // 画笔颜色
        console.log(isPencilMode.value ? '画笔模式启动' : '画笔模式停止');
    };

    // 清除画布
    // const clearCanvas = () => {
    //     fabricObj.value.clear();
    //     console.log('画布已清除！');
    //     drawingEnabled.value = false;
    // };


    const clearCanvas = () => {
        // 获取当前画布上的所有对象
        const objects = fabricObj.value.getObjects();

        // 过滤掉图片对象，只保留绘制内容
        const drawings = objects.filter(obj => obj.type !== 'image');

        // 清除绘制的内容
        fabricObj.value.remove(...drawings);

        // 如果是画笔模式，切换为非画笔模式
        if (isPencilMode.value) {
            togglePencilMode();
        }

        console.log('绘制内容已清除！当前图片保留');
    };

    // 保存画布数据
    const saveCanvas = () => {
        pointArr.value.push(pointArr.value[0]); // 将第一个点添加为最后一个点，确保封闭
        //  获取所有非图片的对象（即绘制的内容）
        savedCanvasData.value = fabricObj.value.toJSON();

        console.log('画布已保存savedCanvasData.value：', savedCanvasData.value);
        savedCanvasData.value.objects?.forEach(item => {
            if (item.type === 'polyline') item.points = pointArr.value;
        });

        // savedCanvasData.value = fabricObj.value.toJSON().objects.filter(obj => obj.type !== 'image');

        savedCanvasData.value[currentImageIndex.value] = fabricObj.value.toJSON();
        console.log('画布数据已保存：', savedCanvasData.value);

    };


    // 加载保存的画布数据（只加载标注内容，不重复加载图片）
    const loadCanvas = () => {
        // 检查画布中是否已有图片
        const imageObjects = fabricObj.value.getObjects('image');

        // 如果画布中没有图片，则加载图片
        if (imageObjects.length === 0) {
            loadImage();
        }
        if (savedCanvasData.value.objects && savedCanvasData.value.objects.length > 0) {
            fabricObj.value.loadFromJSON(savedCanvasData.value, () => {
                // 禁用所有图片对象的拖动
                fabricObj.value.getObjects('image').forEach((img) => {
                    img.set({
                        selectable: false, // 禁止选择
                        evented: false, // 禁止事件（如拖动、点击）
                    });
                });
                fabricObj.value.renderAll(); // 重新渲染画布
            });
            console.log('画布数据已加载！');
        } else {
            alert('没有保存的数据可加载！');
        }

        // 加载标注（绘制内容）
        // if (savedCanvasData.value.objects && savedCanvasData.value.objects.length > 0) {
        //     fabricObj.value.loadFromJSON(savedCanvasData.value, () => {
        //         // 禁用所有图片对象的拖动
        //         fabricObj.value.getObjects('image').forEach((img) => {
        //             img.set({
        //                 selectable: false, // 禁止选择
        //                 evented: false, // 禁止事件（如拖动、点击）
        //             });
        //         });
        //         fabricObj.value.renderAll(); // 重新渲染画布
        //     });
        //     console.log('画布数据已加载！');
        // } else {
        //     alert('没有保存的数据可加载！');
        // }
    };



    // 鼠标按下事件，记录点击的坐标
    const handleMouseDown = (e) => {
        if (drawingEnabled.value) {
            const mouseFrom = {
                x: e.pointer.x,
                y: e.pointer.y,
            };

            // 保存坐标
            pointArr.value.push({ x: mouseFrom.x, y: mouseFrom.y });

            // 画线
            const point = {
                x: mouseFrom.x,
                y: mouseFrom.y,
            };
            roofPoints.value.push(point);
            drawLine(point);
        }
    };

    // 鼠标移动事件，更新线条
    const handleMouseMove = (e) => {
        if (lines.value.length && drawingEnabled.value) {
            const x = e.pointer.x;
            const y = e.pointer.y;
            lines.value[lines.value.length - 1].set({
                x2: x,
                y2: y,
            });
            fabricObj.value.renderAll();
        }
    };

    // 鼠标双击事件，结束绘制
    const handleMouseDblClick = () => {
        if (drawingEnabled.value) {
            fabricObj.value.off('mouse:down');
            lines.value.forEach((item) => fabricObj.value.remove(item));
            createRoof();
            fabricObj.value.add(roof.value);
            fabricObj.value.renderAll();

            resetDrawingData();
            console.log('绘制结束！pointArr', pointArr.value);
        }
    };

    // 创建屋顶（闭合的多边形）
    const createRoof = () => {
        const left = Math.min(...roofPoints.value.map((p) => p.x));
        const top = Math.min(...roofPoints.value.map((p) => p.y));
        roofPoints.value.push(roofPoints.value[0]); // 闭合多边形

        roof.value = new fabric.Polyline(roofPoints.value, {
            fill: '',
            strokeWidth: 2,
            stroke: 'red',
            left: left,
            top: top,
        });
    };

    // 绘制红色线条
    const drawLine = (point) => {
        const points = [point.x, point.y, point.x, point.y];
        lines.value.push(new fabric.Line(points, {
            strokeWidth: 2,
            selectable: false,
            stroke: 'red',
        }));
        fabricObj.value.add(lines.value[lines.value.length - 1]);
    };

    // 重置绘图数据
    const resetDrawingData = () => {
        roofPoints.value.length = 0;
        lines.value.length = 0;
        drawingEnabled.value = false;
    };

    // 初始化应用
    const initializeApp = () => {
        loadImage(); // 加载初始图片
        initializeEvents();
    };

    // 页面挂载时初始化
    onMounted(() => {
        fabricObj.value = new fabric.Canvas(canvasRef.value); // 通过 ref 获取 canvas 元素
        initializeApp();
    });



    /**
     * 滚动到目标元素居中
     * @param {HTMLElement} container - 容器元素
     * @param {HTMLElement} targetElement - 目标元素
     */
    const scrollToCenter = (container, targetElement) => {
        if (!container || !targetElement) return;

        const elementWidth = targetElement.offsetWidth;
        const containerWidth = container.offsetWidth;
        const elementOffset = targetElement.offsetLeft;

        // 计算滚动位置，目标元素居中
        const scrollPosition = elementOffset - (containerWidth - elementWidth) / 2;

        // 限制滚动范围，确保不会超出容器的边界
        const maxScroll = container.scrollWidth - container.clientWidth; // 最大滚动距离
        const minScroll = 0; // 最小滚动距离

        // 确保滚动位置在容器范围内
        const finalScrollPosition = Math.min(Math.max(scrollPosition, minScroll), maxScroll);

        // 平滑滚动到目标位置
        container.scrollTo({
            left: finalScrollPosition,
            behavior: 'smooth', // 平滑滚动
        });
    };
</script>

<style scoped>
    .canvasbox {
        width: 500px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .canvas {
        display: flex;
        box-sizing: content-box;
        margin-top: 10px;
    }

    /* 缩略图容器，设置为可以横向滚动 */
    .thumbnail-container {
        margin-top: 20px;
        display: flex;
        gap: 10px;
        width: 100%;
        overflow-x: auto;
        /* 横向滚动 */
        padding: 5px 0;
    }

    /* 缩略图样式 */
    .thumbnail {
        width: 135px;
        /* 缩略图宽度，可以调整大小 */
        height: 76px;
        /* 高度保持比例 */
        object-fit: cover;
        /* 图片按比例裁剪填充 */
        border-radius: 4px;
        border: 4px solid transparent;
        cursor: pointer;
        transition: border 0.3s ease;
    }

    /* 选中缩略图时的高亮效果 */
    .thumbnail.selected {
        border: 4px solid #45CDFF;
        /* 高亮边框 */
    }


    /*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }

    /*定义滚动条轨道
 内阴影+圆角*/
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
        border-radius: 3px;
        background-color: #ccc;
    }

    /*定义滑块
 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
        border-radius: 3px;
        -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, .3);
        background-color: #555;
    }


</style>
