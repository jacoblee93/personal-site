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
  color: var(--white);
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
