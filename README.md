# @jmondi/notify-svelte

This library is a Svelte-based toast notification system. It provides a NotificationService class with `success`, `info`, and `error` methods to display corresponding notifications. Notifications are time-based and will disappear after a given duration (time-to-live or TTL).

## Installation

```bash
pnpm add @jmondi/notify-svelte
```

## Usage

Start by importing the library:

```ts
import { notify } from '@jmondi/notify-svelte';
```

Create notifications using `success`, `info`, and `error` methods. These can accept either a string or a NotifyMessage object:

```ts
// Display a success notification
notify.success('Task completed successfully!');

// Display an info notification with a custom title and TTL
notify.info({ message: 'Processing the request...', title: 'Please wait', ttl: 6000 });

// Display an error notification
notify.error('Oops! Something went wrong...');
```

Notifications are automatically removed after their TTL expires. However, you can manually remove a notification:

```ts
// Clears a specific notification by its ID
notify.clear(notificationId);

// Clears all notifications
notify.clear();
```

## Configuration

You can optionally create a custom NotificationService instance with your own settings. Available settings include:

- `ttl`: The default time-to-live for notifications (in milliseconds). Default is 4500.
- `suppressDuplicates`: Whether to suppress showing notifications that are duplicates of ones already displayed. Default is false.
- `historyLength`: The number of notifications to keep track of for suppressing duplicates. Default is 5.

Here's how you might customize these settings:

```ts
import { NotificationService } from '@jmondi/notify-svelte';

const customNotify = new NotificationService({
  ttl: 5000,
  suppressDuplicates: true,
  historyLength: 10,
});
```
