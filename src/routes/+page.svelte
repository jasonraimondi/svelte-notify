<script>
    import {notify} from "$lib";
    import Notifications from "$lib/Notifications.svelte";
</script>

<Notifications />

<div>
  <p>Notify Svelte</p>
  <button data-testid="notify-error" on:click={() => notify.error({ title: "message", message: "I am a long message"})}>Notify Error</button>
  <button data-testid="notify-info" on:click={() => notify.info("hi ya slugger")}>Notify Info</button>
  <button data-testid="notify-success" on:click={() => notify.success("hi ya slugger")}>Notify Success</button>
</div>
