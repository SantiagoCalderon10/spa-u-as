

export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Error controlado de negocio
        Error.captureStackTrace(this, this.constructor);
    }
}

// 400 - Entrada inválida o regla de negocio rota
export class ValidationError extends AppError {
    constructor(message = 'Datos de entrada inválidos') {
        super(message, 400);
    }
}

// 401 - No autenticado (falta token o es inválido)
export class UnauthorizedError extends AppError {
    constructor(message = 'No autorizado. Debe iniciar sesión') {
        super(message, 401);
    }
}

// 403 - Autenticado pero sin permisos suficientes
export class ForbiddenError extends AppError {
    constructor(message = 'No tiene permisos para realizar esta acción') {
        super(message, 403);
    }
}

// 404 - Recurso no encontrado
export class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404);
    }
}

// 409 - Conflicto (citas solapadas, correo ya registrado, etc.)
export class ConflictError extends AppError {
    constructor(message = 'Conflicto con el estado actual del recurso') {
        super(message, 409);
    }
}