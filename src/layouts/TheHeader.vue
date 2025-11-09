<!-- eslint-disable vue/no-undef-components -->
<template>
  <header>
    <!-- bg-blue-600은 부트스트랩의 bg-primary와 유사한 색상입니다. -->
    <nav class="bg-blue-600 p-4">
      <div
        class="container mx-auto flex flex-wrap items-center justify-between"
      >
        <!-- text-white는 navbar-dark의 텍스트 색상을 대체합니다. text-xl은 navbar-brand의 크기를 대략적으로 맞춥니다. -->
        <a class="text-white text-xl font-semibold" href="#">GYM CODING</a>

        <!-- Tailwind는 기본적으로 햄버거 메뉴를 위한 JavaScript를 제공하지 않습니다. data-bs-toggle/target 속성은 부트스트랩 JS에 의존하므로 Tailwind 클래스만으로 대체했습니다. 실제 동작을 위해서는 별도의 Vue 로직이나 라이브러리가 필요합니다. 여기서는 데스크탑 뷰만 보이도록 했습니다. -->

        <!-- collapse navbar-collapse, navbar-nav, me-auto, d-flex는 Tailwind의 flexbox 유틸리티로 대체됩니다. -->
        <div class="flex-grow">
          <ul class="flex space-x-4 ml-4">
            <li>
              <!-- nav-link, active-class="active"는 Tailwind의 active-class 스타일로 대체됩니다. -->
              <RouterLink
                class="text-white hover:text-gray-200"
                active-class="text-blue-200"
                to="/"
              >
                Home
              </RouterLink>
            </li>
            <li>
              <RouterLink
                class="text-white hover:text-gray-200"
                active-class="text-blue-200"
                to="/about"
              >
                About
              </RouterLink>
            </li>
            <li>
              <RouterLink
                class="text-white hover:text-gray-200"
                active-class="text-blue-200"
                to="/posts"
              >
                게시글
              </RouterLink>
            </li>
            <li>
              <RouterLink
                class="text-white hover:text-gray-200"
                active-class="text-blue-200"
                to="/nested"
              >
                Nested
              </RouterLink>
            </li>
            <li>
              <RouterLink
                class="text-white hover:text-gray-200"
                active-class="text-blue-200"
                to="/playground"
              >
                Playground
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- d-flex, btn, btn-outline-light를 flex, bg-transparent, border, text-white, hover 클래스로 대체합니다. -->
        <div class="flex items-center" role="search">
          <button
            class="bg-transparent border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-blue-600 transition duration-150 ease-in-out"
            type="button"
            @click="goPage"
          >
            글쓰기
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goPage = () => {
  router.push({
    name: 'PostCreate',
  })
}
</script>

<style lang="scss" scoped></style>
