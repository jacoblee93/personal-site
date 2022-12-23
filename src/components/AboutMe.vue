<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
const isInViewport = inject('isInViewport') as (el:HTMLElement, fullyVisible?:boolean) => boolean;
const minime = ref<HTMLElement | null>(null);
const pixelmeTyping = ref<HTMLElement | null>(null);
const pixelmeNotBad = ref<HTMLElement | null>(null);
const pixelmeContainer = ref<HTMLElement | null>(null);
const copy = ref<HTMLElement | null>(null);

const minimeFrames = 6;
let minimePosition = 0;

onMounted(() => {
  // setInterval(() => {
  //   if (!minime.value) {
  //     return;
  //   }
  //   minime.value.style.objectPosition = `-${180 * minimePosition}px 0`;
  //   minimePosition = (minimePosition + 1) % minimeFrames;
  // }, 1000);
  window.requestAnimationFrame(() => {
    if (!pixelmeTyping.value || !pixelmeNotBad.value) {
      return;
    }
    pixelmeTyping.value.style.display = 'block';
    pixelmeNotBad.value.style.display = 'none';
  });
  const appEl = document.querySelector('#app');
  if (!appEl) {
    return;
  }
  const typingCheck = () => {
    if (copy.value && isInViewport(copy.value, true)) {
      appEl.removeEventListener('scroll', typingCheck);
      setTimeout(() => {
        window.requestAnimationFrame(() => {
          if (!pixelmeTyping.value || !pixelmeNotBad.value) {
            return;
          }
          pixelmeTyping.value.style.display = 'none';
          pixelmeNotBad.value.style.display = 'block';
        });
      }, 3000);
    }
  }
  appEl.addEventListener('scroll', typingCheck);
  typingCheck();
});

</script>

<template>
  <section class="about-me">
    <div class="content">
      <div class="pixelme-container" ref="pixelmeContainer">
        <img class="pixelme typing" ref="pixelmeTyping" src="/static/jacob_typing.gif" />
        <img class="pixelme notbad" ref="pixelmeNotBad" src="/static/jacob-not-bad.gif" />
        <img class="pixelme" src="/static/jacob-desk.gif" />
        <img class="pixelme" src="/static/jacob-laptop.gif" />
      </div>
      <div class="bio">
        <h1>
          👋 Nice to meet you!
        </h1>
        <p class="copy" ref="copy">
          I'm a freelance software engineer and consultant based in San Francisco, CA.
          Most recently, I was the Co-founder and CTO of a software platform called
          <a class="bio-link" target="_blank" href="https://autocode.com/"><img class="inline-logo" src="/static/logos/autocode.png" />Autocode</a> used by over 600,000 developers.
          Before that, I was a frontend engineer on
          <a class="bio-link" target="_blank" href="https://photos.google.com"><img class="inline-logo" src="/static/logos/google-photos.png" />Google Photos</a>.
        </p>
        <p>
          My strengths are backend development, devops, and cloud architecture, but I consider myself a generalist who enjoys solving problems in every part of the stack.
        </p>
        <p>
          If you could use my expertise or a steady hand on your next project, reach out to me on
          <a class="bio-link" target="_blank" href="https://www.linkedin.com/in/jacoblee93/"><img class="inline-logo" src="/static/logos/linkedin.png" />LinkedIn</a>,
          <a class="bio-link" target="_blank" href="https://twitter.com/hacubu/"><img class="inline-logo" src="/static/logos/twitter.png" />Twitter</a>,
          or <a href="">via the email within my resume</a> and let's talk!
        </p>
        <!-- <img class="minime" ref="minime" src="/static/mini-jacob.gif" /> -->
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-me {
  background-color: var(--white);
}
.about-me p {
  color: var(--black);
}
.pixelme {
  position: absolute;
}
.pixelme.notbad {
  display: none;
}
.pixelme-container {
  display: flex;
  justify-content: center;
  height: calc(100% - 108px);
  position: relative;
  bottom: 32px;
  min-height: 512px;
  min-width: 420px;
  flex-shrink: 0;
}
.pixelme-container img {
  height: 100%;
  object-fit: cover;
  image-rendering: crisp-edges;
  image-rendering: optimizespeed;
  image-rendering: pixelated;
}
img.inline-logo {
  height: 12px;
  margin-right: 2px;
}
img.minime {
  height: 240px;
  width: 180px;
  object-position: 0 0;
  object-fit: cover;
  image-rendering: crisp-edges;
  image-rendering: optimizespeed;
  image-rendering: pixelated;
}
a.bio-link {
  white-space: nowrap;
}
.bio {
  flex-shrink: 1;
}
@media (max-width: 960px) {
  .bio {
    margin-top: 56px;
  }
  .pixelme-container {
    min-width: 0;
    min-height: 360px;
    height: 360px;
    width: 100%;
    order: 1;
  }
  .pixelme-container img {
    height: 360px;
  }
}
</style>
