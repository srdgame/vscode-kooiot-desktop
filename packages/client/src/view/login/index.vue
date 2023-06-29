<template>
  <div id="userLayout">
    <div class="login_panel">
      <div class="login_panel_form">
        <div class="login_panel_form_title">
          <img
            class="login_panel_form_title_logo"
            src="@/assets/logo.png"
            alt
          >
          <p class="login_panel_form_title_p">{{ $GIN_VUE_ADMIN.appName }}</p>
        </div>
        <div style="padding-left: 92%; padding-bottom: 20px;">
          <el-dropdown trigger="click" @command="handleSetLanguage">
            <span class="el-dropdown-link">
              <img src="@/assets/language.svg" style="width: 30px; height: 30px;">
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :disabled="$i18n.locale==='en'" command="en"><img src="@/assets/flags/en.svg" class="img">English</el-dropdown-item>
                <el-dropdown-item :disabled="$i18n.locale==='zh'" command="zh"><img src="@/assets/flags/zh.svg" class="img">中文</el-dropdown-item>
                <el-dropdown-item :disabled="$i18n.locale==='ar'" command="ar"><img src="@/assets/flags/ar.svg" class="img">العربية</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-form
          ref="loginForm"
          :model="loginFormData"
          :rules="rules"
          :validate-on-rule-change="false"
          @keyup.enter="submitForm"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginFormData.username"
              size="large"
              :placeholder="t('login.entUserName')"
              suffix-icon="user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginFormData.password"
              show-password
              size="large"
              type="password"
              :placeholder="t('login.entPassword')"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="width: 46%"
              size="large"
              @click="submitForm"
            >{{ t('login.login') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="login_panel_right" />
      <div class="login_panel_foot">
        <div class="links">
          <a href="http://doc.kooiot.com/" target="_blank">
            <img src="@/assets/docs.png" class="link-icon" alt="文档">
          </a>
          <a href="https://support.qq.com/product/418301" target="_blank">
            <img src="@/assets/kefu.png" class="link-icon" alt="客服">
          </a>
          <a
            href="https://github.com/kooiot"
            target="_blank"
          >
            <img src="@/assets/github.png" class="link-icon" alt="github">
          </a>
          <a href="https://freeioe.org" target="_blank">
            <img src="@/assets/video.png" class="link-icon" alt="视频站">
          </a>
        </div>
        <div class="copyright">
          <BottomInfo />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
}
</script>

<script setup>
import BottomInfo from '@/view/layout/bottomInfo/bottomInfo.vue'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/pinia/modules/user'
import Cookies from 'js-cookie'
import { useI18n } from 'vue-i18n'
import SparkMD5 from 'spark-md5'

const i18n = useI18n()
const { t } = useI18n()

// 验证函数
const checkUsername = (rule, value, callback) => {
  if (value.length < 5) {
    return callback(new Error(t('login.errUserName')))
  } else {
    callback()
  }
}

const checkPassword = (rule, value, callback) => {
  if (value.length < 6) {
    return callback(new Error(t('login.errPassword')))
  } else {
    callback()
  }
}

const getLanguage = () => {
  var lang = Cookies.get('language')
  return (lang || 'en')
}

getLanguage()

// 登录相关操作
const loginForm = ref(null)

const loginFormData = reactive({
  username: window.localStorage.getItem('user_name'),
  password: window.localStorage.getItem('user_token'),
})

const rules = reactive({
  username: [{ validator: checkUsername, trigger: 'blur' }],
  password: [{ validator: checkPassword, trigger: 'blur' }],
})

const userStore = useUserStore()

const login = async() => {
  var data = {
    username: loginFormData.username,
    token: SparkMD5.hash(loginFormData.password + '@' + loginFormData.username)
  }
  console.log(loginFormData, data)
  return await userStore.LoginIn(data)
}

const submitForm = () => {
  loginForm.value.validate(async(v) => {
    if (v) {
      await login()
    } else {
      ElMessage({
        type: 'error',
        message: t('login.errLogin'),
        showClose: true,
      })
      return false
    }
  })
}

const handleSetLanguage = (lang) => {
  // console.log('handleSetLanguage() called with value: ' + lang)
  i18n.locale.value = lang

  userStore.setLanguage(lang)

  // console.log('userStore handleSetLanguage() called with value: ' + userStore.getLanguage())

  Cookies.set('language', lang)

  // if (lang === 'ar') {
  //   console.log('Arabic language selected changing to RTL')
  //   document.querySelector('html').classList.add('is-rtl')
  // } else {
  //   console.log('Non Arabic language selected changing to LTR')
  //   document.querySelector('html').classList.add('is-ltr')
  // }

  // const htmlEl = document.querySelector('html')

  // if (this.$i18n.locale === 'ar') {
  //   console.log('change language to arabic and ltr to rtl')
  //   htmlEl.setAttribute('dir', 'rtl')
  // } else {
  //   console.log('change language to english and rtl to ltr')
  //   htmlEl.setAttribute('dir', 'ltr')
  // }

  // htmlEl.setAttribute('lang', lang)

  ElMessage({
    message: t('general.langSwitch'),
    type: 'success'
  })
}

</script>

<style lang="scss" scoped>
@import "@/style/newLogin.scss";

img {
  padding-right: 20px;
  width: 20px;
  height: 20px;
}

prefix {
  margin-top: 10px;
  width: 100px;
  height: 100px;
}

.international-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px!important;
}

html.is-rtl * {
    direction: rtl;
}

html.is-ltr * {
    direction: ltr;
}
</style>
