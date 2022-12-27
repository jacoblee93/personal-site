<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
</script>

<template>
  <footer class="footer">
    <span class="copyright">© Jacob Lee, 2023</span>
  </footer>
</template>

<style scoped>
.footer {
  color: var(--color-white);
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
