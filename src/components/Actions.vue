<script setup>
import { usePageStore } from '@/stores/exif'
import { Dismiss } from 'flowbite';
import { Modal } from 'flowbite';
import 'vue-select/dist/vue-select.css';
import { exif_keys } from '../assets/exif'
import { ref } from 'vue';

const pageStore = usePageStore()
const selected_exif = ref(null)
const entered_value = ref(null)

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
      pageStore.setTableData(exif_data)
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
        close_modal()
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

function close_modal() {
  const $targetEl = document.getElementById('crud-modal');
  const modal = new Modal($targetEl);
  modal.hide()
}

function showModal() {
  const $targetEl = document.getElementById('crud-modal');
  const options = {
    backdrop: 'dynamic',
    closable: true,
  }
  const modal = new Modal($targetEl, options);
  modal.show()
}

const cancelTable = (e) => {
  pageStore.work_flow_state = 'LANDING'
  pageStore.exif_changed = false
}

function download_file(e) {
  pageStore.postMessage({ type: "download", filename: pageStore.image_name })
}

function delete_all_exif(e) {
  pageStore.postMessage({ type: "delete_all" })
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

const add_exif = () => {
  let selected_key = exif_keys.find((key) => {
    return selected_exif.value === key[1]
  })
  pageStore.postMessage({ type: "add", exif_key: selected_exif.value, exif_value: entered_value.value, exif_type: selected_key[2] })
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
const vSelect = defineAsyncComponent(() =>
  import('vue-select')
)

export default {
  components: {
    vSelect
  },
  data: () => ({
    attributes: {
      placeholder: "nice"
    },

  }),
  computed: {
    options: function () {
      const new_keys = exif_keys.map((key) => {
        return key[1]
      }
      )
      return new_keys
    },
  },

}

</script>
<template>
  <div v-if="pageStore.work_flow_state === 'LIST'">
    <button type="button" @click="cancelTable()"
      class="text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">
      Cancel
    </button>

    <button type="button" v-on:click="showModal"
      class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">
      Add Exif
    </button>

    <button type="button" v-on:click="delete_all_exif"
      class="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">
      Delete All Exif
    </button>

    <button type="button" v-on:click="download_file" v-if="pageStore.exif_changed"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
      Download
    </button>
  </div>

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

  <div v-if="pageStore.work_flow_state === 'LIST'" id="crud-modal" tabindex="-1" aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Add Exif Metadata
          </h3>
          <button type="button" v-on:click="close_modal"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->

        <div class="p-4 md:p-5 grid gap-4 mb-4 grid-cols-2">

          <div class="col-span-2 sm:col-span-1">
            <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>

            <v-select :options="options" id="category" v-model="selected_exif">
            </v-select>

          </div>
          <div class="col-span-2 sm:col-span-1">
            <label for="value" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Value</label>
            <input v-model="entered_value" name="value" id="value"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="$2999" required="">
          </div>
        </div>
        <button type="button" v-on:click="add_exif"
          class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"></path>
          </svg>
          Add new product
        </button>

      </div>
    </div>
  </div>

</template>