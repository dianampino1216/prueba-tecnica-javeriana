import { validateJaverianaEmail } from '../utils/validators';

describe('validateJaverianaEmail', () => {
  test('V1 — email vacío retorna inválido con mensaje de obligatoriedad', () => {
    const result = validateJaverianaEmail('');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('El correo electrónico es obligatorio.');
  });

  test('V2 — email con solo espacios retorna inválido con mensaje de obligatoriedad', () => {
    const result = validateJaverianaEmail('   ');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('El correo electrónico es obligatorio.');
  });

  test('V3 — formato sin @ retorna inválido con mensaje de formato', () => {
    const result = validateJaverianaEmail('noatsign');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('El formato del correo no es válido.');
  });

  test('V4 — dominio externo retorna inválido con mensaje de dominio', () => {
    const result = validateJaverianaEmail('user@gmail.com');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('Debes utilizar un correo con dominio @javeriana.edu.co.');
  });

  test('V5 — subdominio javeriana retorna inválido', () => {
    const result = validateJaverianaEmail('user@posgrados.javeriana.edu.co');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('Debes utilizar un correo con dominio @javeriana.edu.co.');
  });

  test('V6 — dominio en mayúsculas retorna válido (check es case-insensitive)', () => {
    const result = validateJaverianaEmail('user@JAVERIANA.EDU.CO');
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  test('V7 — email válido con dominio correcto retorna válido', () => {
    const result = validateJaverianaEmail('juan.perez@javeriana.edu.co');
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  test('V8 — email con espacios alrededor es trimmed y retorna válido', () => {
    const result = validateJaverianaEmail('  user@javeriana.edu.co  ');
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });
});
