<template>
  <div class="search-component">
    <div
      class="user-box"
    >
      <div class="gvaIcon gvaIcon-refresh" :class="[reload ? 'reloading' : '']" @click="handleReload" />
    </div>
    <div
      class="user-box"
    >
      <Screenfull class="search-icon" :style="{cursor:'pointer'}" />
    </div>
    <div
      class="user-box"
    >
      <div class="service gvaIcon-customer-service" @click="toService" />
    </div>
    <div
      class="user-box"
    >
      <el-dropdown trigger="click" style="margin-top: 1px" @command="handleSetLanguage">
        <span class="el-dropdown-link">
          <img src="@/assets/language.svg" style="width: 16px; height: 16px;">
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :disabled="$i18n.locale==='en'" command="en"><img src="@/assets/flags/en.svg" class="img" style="width: 16px; height: 16px;">English</el-dropdown-item>
            <el-dropdown-item :disabled="$i18n.locale==='zh'" command="zh"><img src="@/assets/flags/zh.svg" class="img" style="width: 16px; height: 16px;">中文</el-dropdown-item>
            <el-dropdown-item :disabled="$i18n.locale==='ar'" command="ar"><img src="@/assets/flags/ar.svg" class="img" style="width: 16px; height: 16px;">العربية</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BtnBox',
}
</script>

<script setup>
import Screenfull from '@/view/layout/screenfull/index.vue'
import { emitter } from '@/utils/bus.js'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/pinia/modules/user'
import Cookies from 'js-cookie'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const { t } = useI18n()

const userStore = useUserStore()

const reload = ref(false)
const handleReload = () => {
  reload.value = true
  emitter.emit('reload')
  setTimeout(() => {
    reload.value = false
  }, 500)
}
const toService = () => {
  window.open('https://support.qq.com/product/418301')
}

const handleSetLanguage = (lang) => {
  // console.log('handleSetLanguage() called with value: ' + lang)
  i18n.locale.value = lang

  userStore.setLanguage(lang)

  Cookies.set('language', lang)

  ElMessage({
    message: t('general.langSwitch'),
    type: 'success'
  })
  setTimeout(() => {
    window.location.reload()
  }, 500)
}

</script>
<style scoped lang="scss">
.reload {
  font-size: 18px;
}

.transition-box {
  overflow: hidden;
  width: 160px;
  margin-right: 32px;
  text-align: center;

  ::v-deep(.el-input__wrapper) {
    .el-input__inner {
      border-bottom: 1px solid var(--el-color-info-light-7);
    }

    box-shadow: none !important;
  }

  ::v-deep(.el-select .el-input .el-input__wrapper.is-focus) {
    box-shadow: none !important;
  }

  ::v-deep(.el-select .el-input.is-focus .el-input__wrapper) {
    box-shadow: none !important;
  }
}

.reloading{
  animation:turn 0.5s linear infinite;
}

@keyframes turn {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.service {
  font-family: "gvaIcon", serif !important;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

//小屏幕不显示
@media (max-width: 750px) {
  .service {
    display: none;
  }
}
</style>
