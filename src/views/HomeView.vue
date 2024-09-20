<script setup>
import { usePageStore } from '@/stores/exif'
import FileSelect from '../components/FileSelect.vue'
import Slug from '../components/Slug.vue'
import Cards from '../components/Cards.vue'
import Actions from '../components/Actions.vue'
const worker = new Worker(new URL('../worker.js?b', import.meta.url))
const pageStore = usePageStore()
pageStore.setWorker(worker)

</script>
<script>
import { defineAsyncComponent } from 'vue'
const ExifTable = defineAsyncComponent(() =>
  import('../components/ExifTable.vue')
)
export default {
  components: {
    ExifTable
  }
}
</script>
<template>
  <main class="flex-1 overflow-y-auto md:mb-14 lg:mt-8 lg:mb-24">
    <Slug v-if="pageStore.work_flow_state === 'LANDING'" />
    <FileSelect v-if="pageStore.work_flow_state === 'LANDING'" />
    <Actions />
    <exif-table v-if="pageStore.work_flow_state === 'LIST'" />
    <Cards v-if="pageStore.work_flow_state === 'LANDING'" />

  </main>
</template>
