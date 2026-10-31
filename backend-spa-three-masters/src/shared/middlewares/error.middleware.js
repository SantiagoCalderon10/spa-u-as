// backend-spa-three-masters/src/middlewares/error.middleware.js

export function errorMiddleware(err, req, res, next) {
    // Si es un error controlado de nuestra jerarquía
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            error: err.message,
        });
    }

    // Error inesperado de programación o base de datos (500)
    console.error('💥 Error inesperado:', err);
    return res.status(500).json({
        error: 'Ocurrió un error interno en el servidor',
    });
}