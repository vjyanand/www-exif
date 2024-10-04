<script setup>
import { usePageStore } from '@/stores/exif'
import { ref } from 'vue';
const pageStore = usePageStore()
const show_add_exif = ref(false)

const cancelTable = (e) => {
  pageStore.work_flow_state = 'LANDING'
  pageStore.exif_changed = false
  pageStore.editing_object = null
}

function download_file(e) {
  pageStore.postMessage({ type: "download", filename: pageStore.image_name })
}

function delete_all_exif(e) {
  pageStore.postMessage({ type: "delete_all" })
}

function showModal() {
  pageStore.show_modal = true
}

</script>


<script>
import { defineAsyncComponent } from 'vue'

const AddExif = defineAsyncComponent(() =>
  import('../components/AddExif.vue')
)

export default {
  components: {
    AddExif
  }
}
</script>

<template>
  <div class="flex justify-center container mx-auto py-4 px-2 text-sm space-x-6">

    <button type="button" v-on:click="cancelTable"
      class="w-32 text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg  py-2.5">
      Cancel
    </button>

    <button type="button" v-on:click="delete_all_exif"
      class="w-32 text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg py-2.5">
      Remove Exifs
    </button>

    <button type="button" v-on:click="showModal"
      class="w-32 text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg py-2.5">
      Add Exif
    </button>

    <button type="button"
      :class="[pageStore.exif_changed ? 'hover:bg-blue-800' : 'opacity-50 cursor-not-allowed', 'w-32 text-white bg-blue-700 font-medium rounded-lg py-2.5']"
      v-on:click="download_file">
      Download
    </button>
  </div>

  <add-exif v-if="pageStore.show_modal" />

  <div id="toast"
    class="invisible fixed top-5 right-1 flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800"
    role="alert">
    <svg class="w-5 h-5 text-blue-600 dark:text-blue-500 rotate-45" aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9" />
    </svg>
    <div id="toast-message" class="ps-4 text-sm font-normal">Message sent successfully.</div>
  </div>

</template>