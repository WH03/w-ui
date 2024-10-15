import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
// ant design vue按需加载
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// 导入cesium插件
import cesium from 'vite-plugin-cesium';

// 引入resolve
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
    cesium()
  ],
  resolve: {
    // 设置路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
      "*": resolve(""),
    },
  },
});
