/*
사용법: v-tooltip="'쌍따옴표 안에 홑따옴표 넣고 입력해야 함'"
*/

const tooltip = {
  // 디렉티브가 바인딩된 요소가 DOM에 마운트될 때 호출됩니다.
  mounted(el, binding) {
    const tooltipText = binding.value
    if (!tooltipText) return

    // 툴팁 엘리먼트 생성
    const tooltipEl = document.createElement('div')
    tooltipEl.classList.add('v-follow-tooltip')
    tooltipEl.textContent = tooltipText

    // 초기 스타일 설정 (CSS로 관리하는 것이 더 좋습니다)
    tooltipEl.style.opacity = '0'
    tooltipEl.style.position = 'fixed' // 화면을 기준으로 위치
    tooltipEl.style.zIndex = '1000'
    tooltipEl.style.whiteSpace = 'nowrap'
    tooltipEl.style.padding = '5px 10px'
    tooltipEl.style.backgroundColor = '#333'
    tooltipEl.style.color = '#fff'
    tooltipEl.style.borderRadius = '4px'
    tooltipEl.style.pointerEvents = 'none' // 마우스 이벤트 무시

    document.body.appendChild(tooltipEl)
    el._tooltipEl = tooltipEl // 엘리먼트 인스턴스 저장

    // 마우스 호버 이벤트 핸들러
    const handleMouseOver = () => {
      tooltipEl.style.opacity = '1'
    }
    el.addEventListener('mouseover', handleMouseOver)

    // 마우스 움직임 이벤트 핸들러
    const handleMouseMove = event => {
      // 마우스 위치에 따라 툴팁 위치 업데이트
      tooltipEl.style.left = `${event.clientX + 15}px` // 마우스 커서로부터 약간의 간격
      tooltipEl.style.top = `${event.clientY + 15}px`
    }
    el.addEventListener('mousemove', handleMouseMove)

    // 마우스 아웃 이벤트 핸들러
    const handleMouseOut = () => {
      tooltipEl.style.opacity = '0'
    }
    el.addEventListener('mouseout', handleMouseOut)

    // 이벤트 핸들러 정리용으로 저장
    el._handleMouseOver = handleMouseOver
    el._handleMouseMove = handleMouseMove
    el._handleMouseOut = handleMouseOut
  },

  // 디렉티브가 바인딩 해제될 때 툴팁 엘리먼트와 이벤트 리스너를 정리합니다.
  unmounted(el) {
    if (el._tooltipEl) {
      el._tooltipEl.remove()
    }
    if (el._handleMouseOver) {
      el.removeEventListener('mouseover', el._handleMouseOver)
    }
    if (el._handleMouseMove) {
      el.removeEventListener('mousemove', el._handleMouseMove)
    }
    if (el._handleMouseOut) {
      el.removeEventListener('mouseout', el._handleMouseOut)
    }
  },
}

export default tooltip
