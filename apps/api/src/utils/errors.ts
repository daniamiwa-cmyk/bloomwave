export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class InsufficientGemsError extends AppError {
  constructor(required: number, available: number) {
    super(
      `Insufficient gems: need ${required}, have ${available}`,
      402,
      'INSUFFICIENT_GEMS',
    );
  }
}
