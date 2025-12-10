import { Injectable, signal } from '@angular/core';

export interface NotifyMessage {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

/**
 * 全域 Notify Service
 * 提供 toast 通知功能
 */
@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  private messagesSignal = signal<NotifyMessage[]>([]);
  public messages = this.messagesSignal.asReadonly();
  private nextId = 0;

  /**
   * 顯示成功訊息
   */
  success(message: string, duration: number = 3000): void {
    this.showMessage('success', message, duration);
  }

  /**
   * 顯示錯誤訊息
   */
  error(message: string, duration: number = 5000): void {
    this.showMessage('error', message, duration);
  }

  /**
   * 顯示警告訊息
   */
  warning(message: string, duration: number = 4000): void {
    this.showMessage('warning', message, duration);
  }

  /**
   * 顯示一般訊息
   */
  info(message: string, duration: number = 3000): void {
    this.showMessage('info', message, duration);
  }

  /**
   * 移除指定訊息
   */
  remove(id: number): void {
    this.messagesSignal.update(messages =>
      messages.filter(msg => msg.id !== id)
    );
  }

  /**
   * 清除所有訊息
   */
  clear(): void {
    this.messagesSignal.set([]);
  }

  /**
   * 內部方法：顯示訊息
   */
  private showMessage(type: NotifyMessage['type'], message: string, duration: number): void {
    const id = this.nextId++;
    const newMessage: NotifyMessage = { id, type, message };

    this.messagesSignal.update(messages => [...messages, newMessage]);

    // 自動移除
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }
}
