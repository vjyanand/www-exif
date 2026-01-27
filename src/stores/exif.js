import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
export const usePageStore = defineStore('exif', () => {
  const web_worker = ref(null)
  const file_name = ref(null)
  const image_name = ref(null)
  const worker_initialized = ref(false)
  const work_flow_state = ref("LANDING") // "LANDING", "LIST"
  const exif_changed = ref(false)
  const exif_data = ref(null)
  const toast_timer = ref(null)
  const editing_object = ref(null)
  const show_modal = ref(false)

  function postMessage(payload) {
    web_worker.value.postMessage(payload)
  }

  function remove_exif_data(key) {
    let index = exif_data.value.exif.findIndex((row) => row.key === key)
    index !== -1 && exif_data.value.exif.splice(index, 1)
  }

  function update_exif_data(key, value) {
    let index = exif_data.value.exif.findIndex((row) => row.key === key)
    if (index !== -1) {
      exif_data.value.exif[index]['value'] = value;
      editing_object.value = {}
    }
  }

  function add_exif_data(value) {
    exif_data.value.exif.push(value)
  }

  function update_remove_all(value) {
    exif_data.value.exif.splice(0, exif_data.value.exif.length)
    add_additional_exif(value)
  }

  function add_additional_exif(value) {
    exif_data.value.exif.unshift({
      label: "Mime",
      value: value["mime"],
      key: "mime",
      typeName: "",
      readonly: true,
    });
    exif_data.value.exif.unshift({
      label: "Pixel Height",
      value: value["height"],
      key: "pixel_height",
      typeName: "",
      readonly: true,
    });
    exif_data.value.exif.unshift({
      label: "Pixel Width",
      value: value["width"],
      key: "pixel_width",
      typeName: "",
      readonly: true,
    });
    exif_data.value.exif.unshift({
      label: "Byte Order",
      value: value["byte_order"] === 1 ? "littleEndian" : "bigEndian",
      key: "byte_order",
      typeName: "",
      readonly: true,
    });
  }

  return {
    web_worker,
    file_name,
    image_name,
    worker_initialized,
    work_flow_state,
    exif_changed,
    toast_timer,
    editing_object,
    exif_data,
    show_modal,
    postMessage,
    remove_exif_data,
    update_exif_data,
    add_exif_data,
    add_additional_exif,
    update_remove_all,
  }
})
