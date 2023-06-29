<template>
  <Vue3JsonEditor v-model="state" :show-btns="true" @json-change="onJsonChange"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Vue3JsonEditor } from 'vue3-json-editor'

export default defineComponent({
  name: 'App',
  components: {
    Vue3JsonEditor
  },
  setup() {
    function onJsonChange(value: any) {
      console.log(value)
    }

    const state = ref<object>({})

    return {
      state,
      onJsonChange
    }
  }
})
</script>
