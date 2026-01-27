<script setup>
import { Modal, Dismiss } from 'flowbite';
import 'vue-select/dist/vue-select.css';
import { exif_keys } from '../assets/exif'
import { onMounted, ref } from 'vue';
import { usePageStore } from '@/stores/exif'

const pageStore = usePageStore()
const selected_exif = ref(null)
const entered_value = ref(null)

onMounted(() => {
  const $targetEl = document.getElementById('crud-modal');
  const options = {
    backdrop: 'dynamic',
    closable: true,
    onHide: () => {
      pageStore.show_modal = false
    },
  }
  const modal = new Modal($targetEl, options);
  modal.show()
})

function close_modal() {
  const $targetEl = document.getElementById('crud-modal');
  const modal = new Modal($targetEl);
  modal.hide()
  pageStore.show_modal = false
}

const add_exif = () => {
  let selected_key = exif_keys.find((key) => {
    return selected_exif.value === key[1]
  })
  console.log("Add called", selected_key)
  pageStore.postMessage({ type: "add", exif_key: selected_exif.value, exif_value: entered_value.value, exif_type: selected_key[2] })
}

pageStore.$subscribe((mutation, state) => {
  close_modal()
})

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
  <div id="crud-modal" tabindex="-1" aria-hidden="true"
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

            <v-select :options="options" id="category" v-model="selected_exif" class="text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ">
            </v-select>

          </div>
          <div class="col-span-2 sm:col-span-1">
            <label for="value" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Value</label>
            <input v-model="entered_value" name="value" id="value"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
          </div>
        </div>
        <button type="button" v-on:click="add_exif"
          class="col-span-4 sm:col-span-1 text-white bg-green-700 hover:bg-green-800 font-medium px-2.5 text-sm py-2.5">
          Add Exif
        </button>

      </div>
    </div>
  </div>
</template>