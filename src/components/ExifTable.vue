<script setup>
import { usePageStore } from '@/stores/exif'
import { Tooltip } from 'flowbite';
import { onMounted, ref } from 'vue';

const pageStore = usePageStore()
const result = pageStore.exif_data
const new_value = ref(null)

let exif = result["exif"];
exif.unshift({ "label": "Mime", "value": result["mime"], "key": "mime", "typeName": "" })
exif.unshift({ "label": "Pixel Height", "value": result["height"], "key": "pixel_height", "typeName": "" })
exif.unshift({ "label": "Pixel Width", "value": result["width"], "key": "pixel_width", "typeName": "" })
exif.unshift({ "label": "Byte Order", "value": (result["byte_order"] === 1 ? "littleEndian" : "bigEndian"), "key": "byte_order", "typeName": "" })

onMounted(() => {
  let tooltips = document.getElementsByClassName("tooltip")
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
  for (const index in tooltips) {
    let tooltip_span = tooltips[index]
    let outer_span = tooltip_span.previousSibling
    new Tooltip(tooltip_span, outer_span, { triggerType: isTouch ? 'click' : 'hover', onShow: () => { console.log("A") } });
  }
})

function set_editing_field(field) {
  pageStore.editing_object = field
  new_value.value = field['value']
}

function update_field(field) {
  console.log("update called")
  const payload = { type: "update", exif_key: field['key'], exif_value: new_value.value }
  console.log(payload)
  pageStore.postMessage(payload)
}

function delete_field(field) {
  console.log("Deleting - delete_field")
  pageStore.postMessage({ type: "delete", exif_key: field })
}

</script>

<template>
  <div class="p-4 overflow-x-auto relative md:mb-12">
    <table class="table-auto w-full max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      <thead class="bg-gray-200 text-gray-700 text-sm uppercase leading-normal">
        <tr>
          <th class="py-3 px-6 text-center font-semibold">Label</th>
          <th class="py-3 px-6 text-center font-semibold">Value</th>
          <th class="py-3 px-6 text-center font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody ref="mtable" class="divide-y divide-gray-200">
        <!-- Table content dynamically generated here -->
        <tr v-for="field in exif" :key="field.key" :data-key="field.key" :data-type="field.typeName" :data-raw-value="field.value">
          <td class="py-3 px-6 text-center">{{ field.label }}</td>
          <td class="py-3 px-6 text-center">
            {{ field.value }}
            <!-- Edit field functionality -->
            <span v-if="field.desc">
            ⓘ
          </span>
          <span v-if="field.desc" role="tooltip"
            class="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
            {{ field.desc }}
            <div class="tooltip-arrow" data-popper-arrow=""></div>
          </span>

            <template v-if="pageStore.editing_object && field.key === pageStore.editing_object['key']">
              <input type="text" :placeholder="field.value" v-model="new_value" />
            </template>
          </td>
          <td class="py-3 px-6 text-center">
            <div class="flex justify-center">
    <!-- Delete button -->
    <img width="22" @click="delete_field(field.key)" src="/assets/img/trash-button.svg" class="mr-2" />
    <!-- Save button -->
     <!-- <img style="background-color: yellow;" v-if="pageStore.editing_object['value'] === new_value" width="22"  src="/assets/img/save-button.svg" />
              <img v-else width="22" style="background-color: green;" @click="update_field(field)"
                src="/assets/img/save-button.svg" /> -->
    <!-- Edit button -->
    <img width="22" @click="set_editing_field(field)" src="/assets/img/edit-button.svg" />
  </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>