<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const links = [
  { to: '/', text: 'Home' },
  { to: '/blog', text: 'Blog' },
  { to: '/help', text: 'Help' }
]
const isMobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="bg-white border-b border-gray-300">
    <div class="container mx-auto max-w-5xl py-4 px-8 flex justify-between">
      <RouterLink class="pr-1 flex items-center" to="/">
        <svg version="1.0" width="30pt" height="30pt" viewBox="0 0 337.000000 399.000000"
          preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <g>
            <path
              d="M 95.153 38.759 C 95.153 38.759 33.153 106.159 32.753 106.959 C 32.353 107.759 32.553 358.959 33.853 359.759 C 34.753 360.359 302.753 360.659 303.953 359.059 C 305.153 357.759 303.853 41.759 302.753 40.659 C 300.853 38.759 95.153 38.759 95.153 38.759 Z M 285.853 56.759 L 285.853 343.759 C 285.853 343.759 51.753 343.459 51.153 342.459 C 50.753 341.859 49.653 300.759 49.653 300.759 C 49.653 300.759 132.753 300.559 133.253 299.159 C 133.553 298.259 133.653 275.559 131.853 273.759 C 130.753 272.659 77.353 270.659 77.353 270.659 L 76.753 244.759 L 124.353 244.259 C 124.353 244.259 124.553 220.059 123.753 219.159 C 122.853 218.059 76.853 217.759 76.853 217.759 L 76.853 191.759 L 133.853 191.759 L 133.853 161.759 L 49.853 161.759 L 49.853 123.759 C 49.853 123.759 113.653 123.359 114.953 122.759 C 116.753 121.759 117.153 57.759 117.553 57.459 C 117.853 57.059 285.853 56.759 285.853 56.759 Z M 98.353 62.459 L 98.853 107.759 L 57.753 107.759 L 98.353 62.459 Z"
              fill="#000000" stroke="none" />
            <path
              d="M 140.953 161.759 C 140.953 161.759 182.853 232.159 182.853 232.659 C 182.853 233.159 141.853 299.559 141.853 299.959 C 141.853 300.459 179.953 300.759 179.953 300.759 C 179.953 300.759 201.353 265.159 201.853 264.959 C 202.353 264.759 204.053 266.759 205.553 269.259 C 207.153 271.859 224.553 300.259 224.553 300.259 C 224.553 300.259 263.853 300.559 263.853 300.259 C 263.853 298.259 229.153 242.059 227.253 239.359 C 222.053 231.959 222.053 230.859 227.253 223.659 C 229.753 220.159 263.853 164.559 263.853 162.859 C 263.853 162.059 223.953 161.759 223.953 161.759 C 223.953 161.759 204.753 197.959 203.153 198.459 C 201.753 198.959 179.753 161.759 179.753 161.759 L 140.953 161.759 Z"
              fill="#000000" stroke="none" />
          </g>
        </svg>
        <span class="font-playfair px-1 text-2xl font-bold">Exif Tool</span>
      </RouterLink>
      <div class="hidden sm:flex items-center justify-between">
        <nav>
          <RouterLink v-for="(link, index) in links" :key="index" :to="link.to"
            class="font-inter text-black hover:text-blue-600 mr-4">
            {{ link.text }}
          </RouterLink>
          <a class="font-inter text-black hover:text-blue-600" href="mailto:help@pdftableconvert.com">
            Contact
          </a>
        </nav>
      </div>

      <button class="block sm:hidden p-1 m-1 rounded focus:outline-none hover:bg-gray-100 group"
        v-if="!isMobileMenuOpen" @click="toggleMobileMenu">
        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>


      <div class="sm:hidden" role="dialog" aria-modal="true" v-if="isMobileMenuOpen">

        <div class="fixed inset-0 z-10" @click="closeMobileMenu"></div>

        <div
          class="fixed inset-y-0 right-0 z-10 w-1/2 shadow-xl overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 mx-auto">
          <div class="flex justify-end">
            <button class="-m-2.5 rounded-md p-2.5 text-gray-700" type="button" @click="closeMobileMenu">
              <span class="sr-only">Close menu</span>
              <svg class="h-6 w-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="mt-6 flow-root -my-6 divide-y divide-gray-500/10 space-y-2 py-6">
            <RouterLink
              class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-blue-700"
              to="/" @click="closeMobileMenu">
              Home
            </RouterLink>
            <a class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-blue-700"
              href="/blog">
              Blog
            </a>
            <RouterLink
              class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-blue-700"
              to="/help" @click="closeMobileMenu">Help</RouterLink>

            <a class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 hover:text-blue-700"
              href="mailto:help@exif.iavian.net">
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
