import { onMounted } from 'vue'

export function useIUp() {
  onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('up')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.iUp').forEach((el) => {
      observer.observe(el)
    })
  })
}
