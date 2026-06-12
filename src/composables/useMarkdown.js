import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try { return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + '</code></pre>' } catch (_) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})

export function useMarkdown() {
  return {
    render(text) {
      return md.render(text)
    }
  }
}
