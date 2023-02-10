<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
const isInViewport = inject('isInViewport') as (el:HTMLElement, fullyVisible?:boolean) => boolean;
const minime = ref<HTMLElement | null>(null);
const pixelmeContainer = ref<HTMLElement | null>(null);
const lastParagraph = ref<HTMLElement | null>(null);

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
  const appEl = document.querySelector('#app');
  if (!appEl) {
    return;
  }
  const typingCheck = () => {
    if (lastParagraph.value && isInViewport(lastParagraph.value, true)) {
      appEl.removeEventListener('scroll', typingCheck);
      setTimeout(() => {
        if (!pixelmeContainer.value) {
          return;
        }
        pixelmeContainer.value.classList.remove('typing');
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
      <div class="pixelme-container typing" ref="pixelmeContainer">
        <img class="pixelme typing" ref="pixelmeTyping" src="/static/jacob_typing.gif" />
        <img class="pixelme notbad" ref="pixelmeNotBad" src="/static/jacob-not-bad.gif" />
        <img class="pixelme" src="/static/jacob-desk.gif" />
        <img class="pixelme" src="/static/jacob-laptop.gif" />
      </div>
      <div class="bio">
        <h1>
          👋 Nice to meet you!
        </h1>
        <p>
          I'm a software engineer based in San Francisco.
          Most recently, I was Co-founder and CTO of
          <a class="bio-link" target="_blank" href="https://autocode.com/"><img class="inline-logo" src="/static/logos/autocode.png" />Autocode</a>, an online code editor and serverless platform with <b>600,000+ developers</b>, many of whom were new to software.
          I've been writing about what I've been up to post-Autocode on <a class="bio-link" target="_blank" href="https://blog.jacobscript.dev/">my blog</a>.
        </p>
        <p>
          As an at-scale, general-use platform, we faced technical challenges that ranged from request tracing and billing to cyberattacks to real-time text sync. To solve them, I architected, built, and scaled infrastructure that served <b>hundreds of millions</b> of user API requests per day and <b>hundreds of thousands</b> of concurrent socket connections.
        </p>
        <p>
          Before that, I helped launch shared albums and commenting as a frontend engineer on
          <a class="bio-link" target="_blank" href="https://photos.google.com"><img class="inline-logo" src="/static/logos/google-photos.png" />Google Photos</a>.
        </p>
        <p>
          My strengths are backend development, devops, and cloud architecture, but I embrace the challenge of solving problems anywhere in a stack and a company.
          I've led small teams, moderated and provided support for a <b>40,000 member Discord community</b>.
        </p>
        <p ref="lastParagraph">
          If you could use my expertise, fractional CTO help, or just a steady hand on your next project, reach out to me on
          <a class="bio-link" target="_blank" href="https://www.linkedin.com/in/jacoblee93/"><img class="inline-logo" src="/static/logos/linkedin.png" />LinkedIn</a>,
          <a class="bio-link" target="_blank" href="https://twitter.com/hacubu/"><img class="inline-logo" src="/static/logos/twitter.png" />Twitter</a>,
          or <a class="bio-link" target="_blank" href="/static/docs/Jacob_Lee_Resume_2023.pdf">via the email within my resume</a> and let's talk!
        </p>
        <!-- <img class="minime" ref="minime" src="/static/mini-jacob.gif" /> -->
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-me {
  background-color: var(--color-white);
}
.about-me p {
  color: var(--color-black);
}
.pixelme {
  position: absolute;
}
.pixelme-container {
  display: flex;
  justify-content: center;
  height: calc(100% - 108px);
  position: relative;
  bottom: 48px;
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
.pixelme-container .pixelme.typing {
  opacity: .01;
}
.pixelme-container.typing .pixelme.notbad {
  opacity: .01;
}
.pixelme-container.typing .pixelme.typing {
  opacity: 1;
}
img.inline-logo {
  height: 12px;
  margin-right: 3px;
  position: relative;
  top: 1px;
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
  .bio p {
    text-align: left;
  }
  .bio h1 {
    font-size: 36px;
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
