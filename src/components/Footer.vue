<template>
  <footer class="bg-neutral-100 shadow bg-gray-800">
    <div class="max-w-screen-xl p-4 flex justify-between items-center">
      <span class="text-sm text-gray-500 text-gray-400">
        © 2024 <a href="https://iavian.com/" class="hover:underline">Vijay</a>. All Rights Reserved.
      </span>
                 <ul class="privacyList text-sm font-medium text-gray-500 text-gray-400 gap-4">
        <li>
          <a href="#" class="hover:text-blue-600">Privacy Policy</a>
        </li>        
        <li>
          <a href="#" class="hover:text-blue-600">Contact</a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<style>
@media (min-width: 768px) {
  .privacyList{
    display: flex;
  }
}
  /* Make the footer responsive */
  @media (max-width: 768px) {
    .flex {
      flex-wrap: wrap;
    }
    .justify-between {
      justify-content: center;
    }
  }
  @media (max-width: 480px) {
    .text-sm {
      font-size: 0.8rem;
    }
    .gap-4 {
      gap: 2rem;
    }
  }

  .flex {
    flex-wrap: nowrap;
  }   
</style>