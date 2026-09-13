export const api = {
  /**
   * Post to unified maintenance router endpoint
   */
  async postAction<T = any>(action: string, data: any = {}): Promise<{ success: boolean; message?: string; [key: string]: any }> {
    const res = await fetch('/api/maintenance/router', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ action, ...data })
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Fetch complete dataset
   */
  async getOptimizedData() {
    return this.postAction('getOptimizedData');
  },

  /**
   * Ping backend API
   */
  async ping() {
    return this.postAction('ping');
  },

  /**
   * 1-Click download .ZIP backup archive
   */
  triggerBackupDownload() {
    window.open('/api/backup/download', '_blank');
  }
};
