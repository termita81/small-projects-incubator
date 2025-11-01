<script setup>
import { ref } from 'vue'

const emit = defineEmits(['image-uploaded'])

const dragOver = ref(false)
const previewUrl = ref(null)
const fileInput = ref(null)

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    processImage(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  dragOver.value = false

  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processImage(file)
  }
}

const processImage = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const imageUrl = e.target.result
    previewUrl.value = imageUrl
    emit('image-uploaded', imageUrl)
  }
  reader.readAsDataURL(file)
}

const triggerFileInput = () => {
  fileInput.value.click()
}
</script>

<template>
  <div class="image-uploader">
    <div
      class="drop-zone"
      :class="{ 'drag-over': dragOver }"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop="handleDrop"
      @click="triggerFileInput"
    >
      <div class="drop-zone-content">
        <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <h2>Upload Your Image</h2>
        <p>Drag and drop an image here, or click to browse</p>
        <p class="file-info">Supports: JPG, PNG, GIF, WebP</p>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        style="display: none"
      />
    </div>
  </div>
</template>

<style scoped>
.image-uploader {
  width: 100%;
  max-width: 600px;
}

.drop-zone {
  border: 3px dashed var(--border);
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--surface);
}

.drop-zone:hover {
  border-color: var(--primary-color);
  background: #f0f7ff;
}

.drop-zone.drag-over {
  border-color: var(--secondary-color);
  background: #f0fff4;
  transform: scale(1.02);
}

.drop-zone-content {
  pointer-events: none;
}

.upload-icon {
  width: 80px;
  height: 80px;
  color: var(--primary-color);
  margin: 0 auto 1.5rem;
}

.drop-zone h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.drop-zone p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.file-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
  opacity: 0.8;
}
</style>
