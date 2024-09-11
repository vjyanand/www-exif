<script setup>
import { usePageStore } from '@/stores/exif'
import { Tooltip } from 'flowbite';
import { onMounted, ref } from 'vue';
import 'vue-select/dist/vue-select.css';

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
      "c", "d"
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
  <table>
    <template v-for="field in exif">

      <tr v-bind:data-key="field.key" v-bind:data-type="field.typeName" v-bind:data-raw-value="field.value">
        <td>{{ field.label }}
          <span v-if="field.desc">
            ⓘ
          </span>
          <span v-if="field.desc" role="tooltip"
            class="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
            {{ field.desc }}
            <div class="tooltip-arrow" data-popper-arrow=""></div>
          </span>
        </td>
        <template v-if="pageStore.editing_object && field.key === pageStore.editing_object['key']">
          <td>
            <input type="text" v-bind:placeholder="field.value" v-model="new_value" />
          </td>
          <td><span style="display: flex;justify-content: space-between;">
              <img width="22" @click="delete_field(`${field.key}`)" src="/assets/img/trash-button.svg" />

              <img style="background-color: yellow;" v-if="pageStore.editing_object['value'] === new_value" width="22"
                src="/assets/img/save-button.svg" />
              <img v-else width="22" style="background-color: green;" @click="update_field(field)"
                src="/assets/img/save-button.svg" />

              <img width="22" @click="set_editing_field('')" src="/assets/img/cancel-button.svg" />
            </span>
          </td>
        </template>
        <template v-else>
          <td>{{ field.value }}</td>
          <td><img width="220" @click="set_editing_field(field)" src="/assets/img/edit-button.svg" /></td>
        </template>
      </tr>
    </template>
  </table>
</template>