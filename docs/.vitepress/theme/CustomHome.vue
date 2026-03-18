<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-content">
          <h1 class="tagline">{{ hero.name }}</h1>
          <p class="text">{{ hero.text }}</p>
          <div v-if="hero.actions" class="actions">
            <a v-for="action in hero.actions" :key="action.link" :href="action.link" :class="`action action-${action.theme}`">
              {{ action.text }}
            </a>
          </div>
        </div>
        <div v-if="hero.image" class="hero-image">
          <img :src="hero.image.src" :alt="hero.image.alt" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()

const hero = frontmatter.value.hero || {}
</script>

<style scoped>
.home {
  width: 100%;
}

.hero {
  margin: 0 auto;
  padding: 5rem 2rem;
}

.hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  margin: 0 auto;
  max-width: 1200px;
}

.hero-content {
  flex: 1;
}

.tagline {
  font-size: 3.2rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  color: var(--vp-c-text-1);
}

.text {
  font-size: 1.5rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 2rem 0;
}

.actions {
  display: flex;
  gap: 1rem;
}

.action {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  border: 1px solid transparent;
  cursor: pointer;
}

.action-brand {
  background-color: var(--vp-c-brand);
  color: white;
}

.action-brand:hover {
  background-color: var(--vp-c-brand-dark);
}

.action-alt {
  border: 1px solid var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.action-alt:hover {
  background-color: var(--vp-c-brand-dimm);
}

.hero-image {
  flex: 1;
  text-align: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
}

@media (max-width: 768px) {
  .hero-inner {
    flex-direction: column;
  }

  .tagline {
    font-size: 2rem;
  }

  .text {
    font-size: 1.1rem;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .action {
    width: 100%;
    text-align: center;
  }

  .hero {
    padding: 3rem 1rem;
  }
}
</style>
