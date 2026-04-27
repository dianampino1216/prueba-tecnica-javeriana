interface ValidationResult {
    isValid: boolean;
    errorMessage: string | null;
}

export const validateJaverianaEmail = (email: string): ValidationResult => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
        return {
            isValid: false,
            errorMessage: 'El correo electrónico es obligatorio.',
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        return {
            isValid: false,
            errorMessage: 'El formato del correo no es válido.',
        };
    }

    if (!trimmedEmail.toLowerCase().endsWith('@javeriana.edu.co')) {
        return {
            isValid: false,
            errorMessage: 'Debes utilizar un correo con dominio @javeriana.edu.co.',
        };
    }

    return {
        isValid: true,
        errorMessage: null,
    };
};