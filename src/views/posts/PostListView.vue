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
          @modal="openModal(item)"
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

    <!-- Modal Start -->
    <Teleport to="#modal">
      <PostModal
        v-model="show"
        :title="modalTitle"
        :content="modalContent"
        :created-at="modalCreatedAt"
      />
    </Teleport>
    <!-- Modal End -->

    <hr class="my-5" />
    <template v-if="posts && posts.length > 0 && isLoading === false">
      <AppCard>
        <PostDetailView :id="posts[0].id"></PostDetailView>
      </AppCard>
    </template>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import PostItem from '@/components/posts/PostItem.vue'
import PostDetailView from './PostDetailView.vue'
import useAxios from '@/composables/axios'
import PostFilter from '@/components/posts/PostFilter.vue'
import PostModal from '@/components/posts/PostModal.vue'

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
const { isLoading, sendRequest } = useAxios()

const fetchPosts = async () => {
  const res = await sendRequest({
    method: 'get',
    url: '/posts',
    params: params.value,
  })

  posts.value = res.data
  // 페이징 처리할 때 사용하는 값이 Number 타입인지 확인해야 함.
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

// Modal Start ===================================
const show = ref(false)
const modalTitle = ref('')
const modalContent = ref('')
const modalCreatedAt = ref('')

const openModal = ({ title, content, createdAt }) => {
  show.value = true

  modalTitle.value = title
  modalContent.value = content
  modalCreatedAt.value = createdAt
}
// Modal End ===================================

watchEffect(fetchPosts)
// fetchPosts()
</script>

<style scoped></style>
