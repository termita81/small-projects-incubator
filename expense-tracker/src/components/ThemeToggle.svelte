<script>
  import { theme } from '../stores/theme';
</script>

<button class="theme-toggle" on:click={theme.toggle} aria-label="Toggle theme">
  {#if $theme === 'light'}
    🌙
  {:else}
    ☀️
  {/if}
</button>

<style>
  .theme-toggle {
    position: fixed;
    top: 1rem;
    right: 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 2px solid var(--border-color);
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 1000;
  }

  .theme-toggle:hover {
    background-color: var(--bg-tertiary);
    transform: scale(1.1);
  }

  .theme-toggle:active {
    transform: scale(0.95);
  }
</style>
