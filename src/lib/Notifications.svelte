<script lang="ts">
  import { fly } from "svelte/transition";
  import type {Notify} from "$lib/notification.service.js";
  import {notify} from "$lib/notification.service.js";

  let notifications: Notify[] = [];
  notify.messageList$.subscribe(n => (notifications = Object.values(n)));
</script>

{#if notifications.length}
  <ul data-testid="jmondi-notifications" class="list">
    {#each notifications as notification}
      <li transition:fly={{ x: 100, duration: 200 }} class={`item ${notification.type}`}>
        <button class="message-container" on:click={() => notify.clear(notification.id)}>
          {#if notification.title}<span class="title">{notification.title}</span>{/if}
          <span class="message">{notification.message}</span>
        </button>
      </li>
    {/each}
  </ul>
{/if}

<style lang="postcss">
    :root {
        --notify-colors-white: white;
        --notify-colors-success: green;
        --notify-colors-info: blue;
        --notify-colors-error: red;
        --notify-border-radius: 0.25rem;
    }

  .list {
    z-index: 100;
    margin: 0;
    padding: 0;
    position: fixed;
    top: 1em;
    right: 1em;
    left: 1em;
    font-size: 1rem;
    font-weight: 700;
    color: var(--notify-colors-white);
  }

  .item {
    width: 100%;
    border-radius: var(--notify-border-radius);
    font-weight: inherit;
    display: flex;
    margin-bottom: 0.5rem;

    word-break: break-all;
  }

  .message-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0.5em;
  }

  .title {
    font-size: 105%;
    font-weight: 700;
  }

  .message {
    font-size: 1rem;
    font-weight: normal;
  }

  .close {
    user-select: none;
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    text-align: center;
    width: 1.5rem;
    border-radius: 0 var(--notify-border-radius) var(--notify-border-radius) 0;
    display: flex;
    justify-content: center;
    align-items: center;

    &.info {
      background-color: var(--notify-colors-info);
    }

    &.success {
      background-color: var(--notify-colors-success);
    }

    &.error {
      background-color: var(--notify-colors-error);
    }
  }

  .info {
    background-color: var(--notify-colors-info);
    border-color: var(--notify-colors-info);
  }

  .success {
    background-color: var(--notify-colors-success);
    border-color: var(--notify-colors-success);
  }

  .error {
    background-color: var(--notify-colors-error);
    border-color: var(--notify-colors-error);
  }
</style>
