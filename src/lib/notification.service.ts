import { get, writable } from "svelte/store";

export type NotifyMessage = {
  message: string;
  title?: string;
  ttl?: number;
};

export const NotifyType = {
  Error: "error",
  Info: "info",
  Success: "success",
} as const;
export type NotifyType = (typeof NotifyType)[keyof typeof NotifyType];

export type Notify = {
  id: number;
  message: string;
  title?: string;
  type: NotifyType;
  isSuccess: boolean;
  isInfo: boolean;
  isError: boolean;
  ttl: number;
};

export type NotifyList = Record<number, Notify>;

export type NotifySettings = {
  ttl: number;
  suppressDuplicates: boolean;
  historyLength: number;
};

export class NotificationService {
  private readonly settings: NotifySettings;
  private readonly history: Record<string, string> = {};
  private readonly CLEAR_STATE = {};

  public readonly messageList$ = writable<Record<string, Notify>>(this.CLEAR_STATE);

  constructor(settings?: Partial<NotifySettings>) {
    this.settings = {
      ttl: 4500,
      suppressDuplicates: false,
      historyLength: 5,
      ...settings,
    };
  }

  success(message: string | NotifyMessage) {
    this.flash(message, NotifyType.Success);
  }

  info(message: string | NotifyMessage) {
    this.flash(message, NotifyType.Info);
  }

  error(message: string | NotifyMessage) {
    this.flash(message, NotifyType.Error);
  }

  clear(id?: number) {
    if (id) {
      this.remove(id);
    } else {
      this.messageList$.set(this.CLEAR_STATE);
    }
  }

  private remove(id: number): void {
    const existing = get(this.messageList$);
    if (existing.hasOwnProperty(id)) {
      const { [id]: _, ...rest } = existing;
      this.messageList$.set(rest);
    }
  }

  private trackHistory({ id, ...notify }: Notify): { isDuplicate: boolean } {
    const historyValues = this.history ? Object.values(this.history) : [];
    const historyKeys = this.history ? Object.keys(this.history) : [];
    const match = JSON.stringify(notify);
    const isDuplicate = historyValues.includes(match);

    if (this.history && !isDuplicate) {
      this.history[id] = match;
      setTimeout(() => void delete this.history?.[id], notify.ttl);
    }

    if (historyKeys.length >= this.settings.historyLength) {
      const toDelete = historyKeys.shift();
      if (typeof toDelete === "string" && this.history?.hasOwnProperty(toDelete)) {
        delete this.history[toDelete];
      }
    }

    return { isDuplicate };
  }

  private flash(message: string | NotifyMessage, type: NotifyType = NotifyType.Info): void {
    if (
      !message ||
      (typeof message === "object" && !message.message) ||
      (typeof message === "string" && message.trim() === "")
    ) {
      throw new Error(
        "Invalid message. Message must be a string or NotifyMessage object with a non-empty message.",
      );
    }

    const id = Date.now();
    let title: string | undefined;
    let ttl = this.settings.ttl;

    if (typeof message !== "string") {
      title = message.title;
      ttl = message.ttl ?? ttl;
      message = message.message;
    }

    const notify = {
      id,
      message,
      title,
      type,
      ttl,
      isSuccess: type === NotifyType.Success,
      isInfo: type === NotifyType.Info,
      isError: type === NotifyType.Error,
    };

    let shouldAlert = true;

    if (this.settings.suppressDuplicates) {
      const { isDuplicate } = this.trackHistory(notify);
      shouldAlert = !isDuplicate;
    }

    if (shouldAlert) this.addMessageToList(notify);

    setTimeout(() => this.remove(id), ttl);
  }

  private addMessageToList(message: Notify): void {
    const messageList = {
      ...get(this.messageList$),
      [message.id]: message,
    };
    this.messageList$.set(messageList);
  }
}

export const notify = new NotificationService();
