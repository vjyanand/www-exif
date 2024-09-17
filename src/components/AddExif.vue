<script setup>
import { usePageStore } from '@/stores/exif'
import 'vue-select/dist/vue-select.css';
</script>

<script>

import { defineAsyncComponent } from 'vue'
const vSelect = defineAsyncComponent(() =>
  import('vue-select')
)

export default {
  components: {
    vSelect
  },
  data: () => ({
    people: [
      "cat", "dog"
    ],
  }),
  computed: {
    options: function () {
      console.log(this.people)
      return this.people
    },
  },
}
</script>

<template>
<v-select :options="options"></v-select>
</template>