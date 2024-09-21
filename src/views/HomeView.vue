<script setup>
import FileSelect from '../components/FileSelect.vue'
import Slug from '../components/Slug.vue'
import Cards from '../components/Cards.vue'

import { usePageStore } from '@/stores/exif'
const worker = new Worker(new URL('../worker.js?b', import.meta.url))
const pageStore = usePageStore()
pageStore.web_worker = worker

pageStore.web_worker.onmessage = function (e) {
  let result = e.data
  switch (result.type) {
    case 'wasm':
      pageStore.worker_initialized = true
      console.log('Initilized')
      break
    case 'exif':
      pageStore.work_flow_state = 'LIST'
      let exif_data = JSON.parse(result.data)
      pageStore.exif_data = exif_data
      pageStore.image_name = result.image_name
      break
    case 'add':
      let result_add = JSON.parse(result.data)
      console.log(result_add)
      if (result_add['success']) {
        console.log("Add Success")
        if (pageStore.exif_changed === false) {
          pageStore.exif_changed = true
        }
        pageStore.add_exif_data(result_add['value']);
      } else {
        console.log("Add Failed")
      }
      break
    case 'update':
      let result_update = JSON.parse(result.data)
      if (result_update['success']) {
        if (pageStore.exif_changed === false) {
          pageStore.exif_changed = true
        }
        pageStore.update_exif_data(result_update['key'], result_update['value']);
      }
      console.log(result_update)
      break
    case 'delete':
      let payload = JSON.parse(result.data)
      if (payload['success']) {
        if (pageStore.exif_changed === false) {
          pageStore.exif_changed = true
        }
        pageStore.remove_exif_data(payload['key']);
        showToast(`${payload['key']} is removed`)
      }
      break
    case 'delete_all':
      let payload_delete_all = JSON.parse(result.data)
      if (pageStore.exif_changed === false && payload_delete_all === true) {
        pageStore.exif_changed = true
        showToast("All exif metadata removed")
      }
      console.log(payload_delete_all)
      break
    case 'download':
      let download_file_name = "mod_" + pageStore.file_name
      downloadBlob(result.data, download_file_name, 'image/jpeg')
      break
    default:
      console.log('default')
  }
}

const downloadBlob = (data, fileName) => {
  let row = document.querySelector('[data-key="mime"]');
  let mimeType = row.getAttribute("data-raw-value");

  const blob = new Blob([data], {
    type: mimeType
  })
  const url = window.URL.createObjectURL(blob)
  downloadURL(url, fileName)
  setTimeout(() => window.URL.revokeObjectURL(url), 1000)
}

const downloadURL = (data, fileName) => {
  const a = document.createElement('a')
  a.href = data
  a.download = fileName
  document.body.appendChild(a)
  a.style.display = 'none'
  a.click()
  a.remove()
}

const showToast = (message, type) => {
  const toast_message = message || ""
  const toastDiv = document.getElementById("toast")
  toastDiv.classList.remove("invisible")
  toastDiv.classList.remove("hidden")
  toastDiv.classList.remove("transition-opacity")
  toastDiv.classList.remove("opacity-0")
  toastDiv.classList.remove("ease-out")
  const toastMessageDiv = document.getElementById("toast-message")
  toastMessageDiv.innerText = toast_message
  toastDiv.classList.add("visible")
  clearTimeout(pageStore.toast_timer)
  pageStore.toast_timer = setTimeout(() => {
    const dismiss = new Dismiss(toastDiv);
    dismiss.hide();
  }, 2000);
}

</script>

<script>
import { defineAsyncComponent } from 'vue'
const ExifTable = defineAsyncComponent(() =>
  import('../components/ExifTable.vue')
)

const Actions = defineAsyncComponent(() =>
  import('../components/Actions.vue')
)

export default {
  components: {
    ExifTable, Actions
  }
}
</script>

<template>
  <main class="flex-1 overflow-y-auto md:mb-14 lg:mt-8 lg:mb-24">
    <Slug v-if="pageStore.work_flow_state === 'LANDING'" />
    <FileSelect v-if="pageStore.work_flow_state === 'LANDING'" />
    <Cards v-if="pageStore.work_flow_state === 'LANDING'" />
    <Actions v-if="pageStore.work_flow_state === 'LIST'" />
    <ExifTable v-if="pageStore.work_flow_state === 'LIST'" />
  </main>
</template>
