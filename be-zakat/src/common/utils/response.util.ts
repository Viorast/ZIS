export class ResponseUtil {
  static success(message: string, data?: any) {
    return {
      status: 'success',
      message,
      data,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }
}