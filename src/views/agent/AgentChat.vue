<template>
  <div class="page-container">
    <h1 class="page-title iUp">AI 助手</h1>

    <div class="chat-container glass-card iUp">
      <div class="chat-messages" ref="messagesContainer">
        <div v-if="messages.length === 0" class="welcome-message">
          <div class="welcome-icon">🤖</div>
          <h2>你好！我是 AI 助手</h2>
          <p>我可以回答关于博主的问题，包括项目经历、技术栈、简历信息等。有什么想了解的吗？</p>
        </div>

        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="message"
          :class="msg.role"
        >
          <div class="message-avatar">
            {{ msg.role === 'user' ? '👤' : '🤖' }}
          </div>
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(msg.content)"></div>
            <div v-if="msg.role === 'assistant' && msg.isStreaming" class="streaming-cursor"></div>
          </div>
        </div>

        <div v-if="isConnecting" class="message assistant">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <div class="message-text">正在连接...</div>
          </div>
        </div>
      </div>

      <div class="chat-input-area">
        <div class="model-selector">
          <el-select v-model="selectedModel" size="small" placeholder="选择模型">
            <el-option label="DeepSeek" value="deepseek" />
            <el-option label="GPT-4" value="gpt4" />
          </el-select>
        </div>

        <div class="input-wrapper">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="2"
            placeholder="输入你的问题..."
            @keydown.enter.exact.prevent="handleSend"
            :disabled="isStreaming || isConnecting"
          />
          <el-button
            type="primary"
            :loading="isStreaming || isConnecting"
            @click="handleSend"
            :disabled="!inputMessage.trim()"
          >
            发送
          </el-button>
        </div>

        <div class="connection-status" :class="{ connected: ws?.isConnected() }">
          <span class="status-dot"></span>
          {{ ws?.isConnected() ? '已连接' : '未连接' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { createAgentWebSocket } from '@/api/agent'

const messages = ref([])
const inputMessage = ref('')
const selectedModel = ref('deepseek')
const isStreaming = ref(false)
const isConnecting = ref(false)
const messagesContainer = ref(null)
const ws = ref(null)

function formatMessage(content) {
  if (!content) return ''
  // Simple markdown-like formatting
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function handleSend() {
  const message = inputMessage.value.trim()
  if (!message || isStreaming.value || isConnecting.value) return

  // Add user message
  messages.value.push({
    role: 'user',
    content: message
  })

  // Add placeholder for assistant message
  messages.value.push({
    role: 'assistant',
    content: '',
    isStreaming: true
  })

  inputMessage.value = ''
  isStreaming.value = true
  scrollToBottom()

  // Send message via WebSocket
  ws.value.send(message, selectedModel.value)
}

function handleToken(data) {
  const lastMessage = messages.value[messages.value.length - 1]
  if (lastMessage && lastMessage.role === 'assistant') {
    lastMessage.content += data.content
    scrollToBottom()
  }
}

function handleDone() {
  const lastMessage = messages.value[messages.value.length - 1]
  if (lastMessage && lastMessage.role === 'assistant') {
    lastMessage.isStreaming = false
  }
  isStreaming.value = false
}

function handleError(data) {
  isStreaming.value = false
  const lastMessage = messages.value[messages.value.length - 1]
  if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
    lastMessage.content = data.message || '发生错误，请重试'
    lastMessage.isStreaming = false
  } else {
    // Show error as a new message
    messages.value.push({
      role: 'assistant',
      content: data.message || '发生错误，请重试'
    })
  }
  scrollToBottom()
}

async function connectWebSocket() {
  isConnecting.value = true
  try {
    await ws.value.connect()
  } catch (e) {
    messages.value.push({
      role: 'assistant',
      content: '无法连接到 AI 服务，请稍后重试'
    })
  } finally {
    isConnecting.value = false
  }
}

onMounted(() => {
  // Initialize WebSocket
  ws.value = createAgentWebSocket()

  // Set up event listeners
  ws.value.on('token', handleToken)
  ws.value.on('done', handleDone)
  ws.value.on('error', handleError)

  // Connect
  connectWebSocket()

  // Animate
  requestAnimationFrame(() => {
    document.querySelectorAll('.iUp').forEach(el => el.classList.add('up'))
  })
})

onUnmounted(() => {
  if (ws.value) {
    ws.value.disconnect()
  }
})
</script>

<style scoped>
.chat-container {
  height: calc(100vh - 200px);
  min-height: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.welcome-message {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.6);
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.welcome-message h2 {
  color: #fff;
  font-size: 20px;
  margin-bottom: 8px;
}

.welcome-message p {
  font-size: 14px;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.6;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 85%;
}

.message.user {
  flex-direction: row-reverse;
  margin-left: auto;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: var(--blue-accent, #3b82f6);
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
}

.message.user .message-text {
  background: var(--blue-accent, #3b82f6);
  color: #fff;
}

.message-text :deep(code) {
  background: rgba(0, 0, 0, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.streaming-cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background: var(--blue-accent, #3b82f6);
  margin-left: 4px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.chat-input-area {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.model-selector {
  display: flex;
  align-items: center;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-wrapper :deep(.el-textarea__inner) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  resize: none;
}

.input-wrapper :deep(.el-textarea__inner:focus) {
  border-color: var(--blue-accent, #3b82f6);
}

.input-wrapper :deep(.el-textarea__inner::placeholder) {
  color: rgba(255, 255, 255, 0.3);
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
}

.connection-status.connected .status-dot {
  background: #4ade80;
}

@media (max-width: 768px) {
  .chat-container {
    height: calc(100vh - 180px);
  }

  .message {
    max-width: 95%;
  }

  .input-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .input-wrapper .el-button {
    align-self: flex-end;
  }
}
</style>
