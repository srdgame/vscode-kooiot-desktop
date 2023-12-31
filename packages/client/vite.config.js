import legacyPlugin from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteLogo } from './src/core/config'
import Banner from 'vite-plugin-banner'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import vuePlugin from '@vitejs/plugin-vue'

import GvaPosition from './vitePlugin/gvaPosition'
import GvaPositionServer from './vitePlugin/codeServer'
import fullImportPlugin from './vitePlugin/fullImport/fullImport.js'
// @see https://cn.vitejs.dev/config/
export default ({
  command,
  mode
}) => {
  const NODE_ENV = process.env.NODE_ENV || 'development'
  const envFiles = [
    `.env.${NODE_ENV}`
  ]
  for (const file of envFiles) {
    const envConfig = dotenv.parse(fs.readFileSync(file))
    for (const k in envConfig) {
      process.env[k] = envConfig[k]
    }
  }

  viteLogo(process.env)

  const timestamp = Date.parse(new Date())

  const optimizeDeps = {}

  const alias = {
    '@': path.resolve(__dirname, './src'),
    'vue$': 'vue/dist/vue.runtime.esm-bundler.js',
    'mqtt': 'mqtt/dist/mqtt.min.js',
    // 'process': 'process/browser',
    // 'stream': 'stream-browserify',
    // 'zlib': 'browserify-zlib',
  }

  const esbuild = {}

  const config = {
    base: './', // index.html文件所在位置
    root: './', // js导入的资源路径，src
    resolve: {
      alias,
    },
    define: {
      'process.env': {}
    },
    server: {
      // 如果使用docker-compose开发模式，设置为false
      open: true,
      port: process.env.VITE_CLI_PORT,
      proxy: {
        // 把key的路径代理到target位置
        // detail: https://cli.vuejs.org/config/#devserver-proxy
        [process.env.VITE_BASE_API]: { // 需要代理的路径   例如 '/api'
          target: `${process.env.VITE_BASE_PATH}:${process.env.VITE_SERVER_PORT}/`, // 代理到 目标路径
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp('^' + process.env.VITE_BASE_API), ''),
        },
        [process.env.VIT_UPLOADS_URL || '/uploads']: {
          target: `${process.env.VITE_BASE_PATH}:${process.env.VITE_SERVER_PORT}/`, // 代理到 目标路径
          changeOrigin: true,
          rewrite: path => path,
        },
        [process.env.VIT_PKG_URL || '/pkg']: {
          target: `${process.env.VITE_BASE_PATH}:${process.env.VITE_SERVER_PORT}/`, // 代理到 目标路径
          changeOrigin: true,
          rewrite: path => path,
        },
        [process.env.VITE_LOCAL_API || '/local_api']: {
          target: 'http://127.0.0.1:6108/', // 代理到 目标路径
          changeOrigin: true,
          rewrite: path => path,
        },
      },
    },
    build: {
      minify: 'terser', // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用terser
      manifest: false, // 是否产出manifest.json
      sourcemap: false, // 是否产出sourcemap.json
      outDir: '../extension/vue-dist', // 产出目录
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
      },
    },
    esbuild,
    optimizeDeps,
    plugins: [
      // vueI18n({
      //   include: path.resolve(__dirname, './src/locales/**'),
      //   compositionOnly: true
      // }),
      GvaPositionServer(),
      GvaPosition(),
      legacyPlugin({
        targets: ['Android > 39', 'Chrome >= 60', 'Safari >= 10.1', 'iOS >= 10.3', 'Firefox >= 54', 'Edge >= 15'],
      }),
      vuePlugin(),
      [Banner(`\n Build based on kooiot-cloud \n Time : ${timestamp}`)]
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/style/element/index.scss" as *;`,
        }
      }
    },
  }

  if (NODE_ENV === 'development') {
    config.plugins.push(
      fullImportPlugin()
    )
  } else {
    config.plugins.push(AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass'
      })]
    }))
  }
  return config
}

