import '@vue/runtime-core'

// 전역 컴포넌트 타입 등록 방법
// 컴포넌트를 전역적으로 사용하기 위해 plugins에 작성하고, main.js에 등록한 후 component.d.ts 파일에 타입을 정의해야 함.
// 타입을 정의하지 않으면 사용 시 오류검사에 걸림. 컴포넌트 태그 색깔이 다름.
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    AppAlert: (typeof import('./src/components/app/AppAlert.vue'))['default']
    AppCard: (typeof import('./src/components/app/AppCard.vue'))['default']
    AppGrid: (typeof import('./src/components/app/AppGrid.vue'))['default']
    AppModal: (typeof import('./src/components/app/AppModal.vue'))['default']
    AppPagination: (typeof import('./src/components/app/AppPagination.vue'))['default']
    RouterLink: (typeof import('vue-router'))['RouterLink']
    RouterView: (typeof import('vue-router'))['RouterView']
  }
}
