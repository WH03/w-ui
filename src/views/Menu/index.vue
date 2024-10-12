 <template>
  <a-layout>
    <a-layout-header class="header">
      <div class="logo">
        <img src="../../assets/vue.svg" alt="" />
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider v-model:collapsed="collapsed" collapsible>
        <div class="logo" />
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
          <a-menu-item key="1">
            <PieChartOutlined />
            <span>Option 1</span>
          </a-menu-item>
          <a-menu-item key="2">
            <DesktopOutlined />
            <span>Option 2</span>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <template #title>
              <span>
                <UserOutlined />
                <span>User</span>
              </span>
            </template>
            <a-menu-item key="3">Tom</a-menu-item>
            <a-menu-item key="4">Bill</a-menu-item>
            <a-menu-item key="5">Alex</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #title>
              <span>
                <TeamOutlined />
                <span>Team</span>
              </span>
            </template>
            <a-menu-item key="6">Team 1</a-menu-item>
            <a-menu-item key="8">Team 2</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="9">
            <FileOutlined />
            <span>File</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-layout style="padding: 0px 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>List</a-breadcrumb-item>
          <a-breadcrumb-item>App</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '24px',
            margin: 0,
            minHeight: '280px',
          }"
        >
          Content
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { ref } from "vue";
import {
  UserOutlined,
  PieChartOutlined,
  DesktopOutlined,
  TeamOutlined,
  FileOutlined,
} from "@ant-design/icons-vue";
const selectedKeys1 = ref(["2"]);
const selectedKeys2 = ref(["1"]);
const openKeys = ref(["sub1"]);
const collapsed = ref(false);
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
    height: 100vh;
  }
}

// :deep(.ant-layout) .ant-layout-sider-trigger {
//   background-color: #fff;
//   color: #002140;
//   border: 1px solid #002140;
// }
</style>