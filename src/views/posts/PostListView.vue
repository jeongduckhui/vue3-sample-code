<template>
  <div>
    <h2>게시글 목록</h2>
    <hr class="my-4" />

    <!-- Filter Start -->
    <PostFilter
      v-model:title="params.title_like"
      :limit="params._limit"
      @update:limit="changeLimit"
    ></PostFilter>
    <!-- Filter End -->

    <hr class="my-4" />

    <!-- Grid Start -->
    <AppGrid :items="posts">
      <template #default="{ item }">
        <PostItem
          :title="item.title"
          :content="item.content"
          :created-at="item.createdAt"
          @click="goPage(item.id)"
        ></PostItem>
      </template>
    </AppGrid>
    <!-- Grid End -->

    <!-- Pagination Start -->
    <AppPagination
      v-if="totalCount"
      :pageSize="params._limit"
      :totalCount="totalCount"
      @currentPage="page => (params._page = page)"
    ></AppPagination>
    <!-- Pagination End -->

    <hr class="my-5" />
    <AppCard>
      <PostDetailView :id="1"></PostDetailView>
    </AppCard>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import PostItem from '@/components/posts/PostItem.vue'
import PostDetailView from './PostDetailView.vue'
import AppCard from '@/components/app/AppCard.vue'
import useAxios from '@/composables/axios'
import AppPagination from '@/components/app/AppPagination.vue'
import AppGrid from '@/components/app/AppGrid.vue'
import PostFilter from '@/components/posts/PostFilter.vue'

const router = useRouter()
const posts = ref([])
const params = ref({
  _sort: 'createdAt',
  _order: 'desc',
  _page: 1,
  _limit: 3,
  title_like: '',
})

const totalCount = ref(null)

const changeLimit = value => {
  params.value._limit = value
  params.value._page = 1
}

// axios start ===================================
const { sendRequest } = useAxios()

const fetchPosts = async () => {
  const res = await sendRequest({
    method: 'get',
    url: '/posts',
    params: params.value,
  })

  posts.value = res.data
  // 페이징 처리할 때 사용하는 값이 Number 타입인지 확인해야 함.
  // totalCount.value = parseInt(res.headers['x-total-count'])
  totalCount.value = res.headers['x-total-count']
}
// axios end ===================================

const goPage = id => {
  router.push({
    name: 'PostDetail',
    params: {
      id: id,
    },
  })
}

watchEffect(fetchPosts)

// fetchPosts()
</script>

<style scoped></style>
