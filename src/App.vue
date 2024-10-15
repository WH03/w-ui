<template>
  <a-layout>
    <a-layout-header class="header">
      <div class="logo">
        <img src="./assets/vue.svg" alt="" />
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider v-model:collapsed="collapsed" collapsible>
        <a-menu v-model:selectedKeys="selectedKeys" @click="clickMenu" theme="dark" mode="inline">

          <template v-for="item in menuList">
            <template v-if="!item.children">
              <a-menu-item :key="item.path">
                <router-link :to="item.path">
                  <PieChartOutlined />
                  <span> {{ item.title }}</span>
                </router-link>
              </a-menu-item>
            </template>

            <template v-else>
              <a-sub-menu :key="item.path" :menu-info="item" />
            </template>
          </template>

        </a-menu>
      </a-layout-sider>

      <a-layout style="padding: 0px 24px 24px;">
        <a-breadcrumb style="margin: 10px 0">
          <a-breadcrumb-item>{{ current }}</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content :style="{
          background: '#fff',
          padding: '5px',
          margin: 0,
          minHeight: '280px',
        }">
          <!-- 路由占位符 -->
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script setup>
  import { ref, reactive } from "vue";
  import { useRoute } from 'vue-router'
  import {
    UserOutlined,
    PieChartOutlined,
    DesktopOutlined,
    TeamOutlined,
    FileOutlined,
  } from "@ant-design/icons-vue";

  const selectedKeys = ref(['/graph']);
  // const openKeys = ref(['sub1']);

  const route = useRoute()
  // console.log('@@@route.matched：', route.matched);
  // const current = [route.path]
  let current = ref('/graph')

  // console.log('@@@current：', current);

  const collapsed = ref(false);

  const menuList = reactive([
    {
      key: '1',
      path: '/graph',
      title: "绘制图形"
    },
    {
      key: '2',
      path: '/model',
      title: "引入模型"
    },
    {
      key: '3',
      path: '/3333',
      title: "33333"
    }
  ])

  function clickMenu(item) {
    console.log('@@@item', item);
    current.value = item.key
  }



</script>
<style lang="scss" scoped>
  @import "@/style/style.scss";
  @import "@/style/utils.scss";

  .ant-layout {
    .header {
      display: flex;
      align-items: center;
      background-color: #0a1936;
    }

    .logo {
      width: 50px;
      height: 50px;

      img {
        width: 100%;
      }
    }

    .ant-layout-content {
      height: 88vh;
    }
  }
</style>