<script setup>
import { usePageStore } from "@/stores/exif";
import { onMounted } from "vue";
const pageStore = usePageStore();

onMounted(() => {
  let dropArea = document.getElementById("drop-area");
  dropArea.addEventListener("drop", handleDrop, false);
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });
  dropArea.addEventListener("drop", handleDrop, false);

  document
    .getElementById("file_picker")
    .addEventListener("change", function () {
      let file = this.files[0];
      handleFile(file);
    });
});

function handleDrop(e) {
  let files = e.dataTransfer.files;
  handleFile(files[0]);
}

function handleFile(file) {
  let reader = new FileReader();
  reader.onload = function () {
    let data = new Uint8Array(reader.result);
    pageStore.postMessage({ file: data, type: "file" });
    pageStore.file_name = file.name;
  };
  reader.readAsArrayBuffer(file);
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}
</script>

<template>
<div class="relative flex flex-col gap-y-6 mt-6 px-8 my-8">
   
  <label
  id="drop-area"
  for="file_picker"
  class="cursor-pointer select-none w-full md:w-[45rem] mx-auto bg-gray-100 text-white text-center py-5 px-10 rounded-md focus:outline-none inline-block flex-shrink-0 overflow-hidden">
      <div
        class="flex flex-col items-center justify-center pt-5 pb-6 md:pt-5 md:pb-6 lg:pt-5 lg:pb-6 xl:pt-5 xl:pb-6 2xl:pt-5 2xl:pb-6
        xs:pt-3 xs:pb-3 sm:pt-3 sm:pb-3"
      >
        <svg
          class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400 md:w-8 md:h-8 lg:w-8 lg:h-8 xl:w-8 xl:h-8 2xl:w-8 2xl:h-8
          xs:w-6 xs:h-6 sm:w-6 sm:h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p
          class="mb-2 text-sm text-gray-500 dark:text-gray-400 md:text-sm lg:text-sm xl:text-sm 2xl:text-sm
          xs:text-xs sm:text-xs"
        >
          <span class="font-semibold">Click to select</span> or drag and drop
        </p>
        <p
          class="text-xs text-gray-500 dark:text-gray-400 md:text-xs lg:text-xs xl:text-xs 2xl:text-xs
          xs:text-xxs sm:text-xxs"
        >
          SVG, PNG, JPG or GIF
        </p>
      </div>
      

      <input id="file_picker" type="file" class="hidden" />
    </label>
  
  </div>
</template>
