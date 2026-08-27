export class ApiResponse {
  static success(data: any, message: string = 'Succès'): any {
    return {
      success: true,
      data,
      message,
    }
  }

  static error(message: string = 'Erreur', status: number = 500): any {
    return {
      success: false,
      message,
      status,
    }
  }

  static paginated(data: any[], total: number, page: number, limit: number): any {
    return {
      success: true,
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }
}