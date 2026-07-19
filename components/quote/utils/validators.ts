function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

export function isValidEmail(email: string) {
  const normalizedEmail = email.trim();

  if (normalizedEmail === "") {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    normalizedEmail
  );
}

export function isValidCPF(cpf: string) {
  const numbers = onlyNumbers(cpf);

  if (numbers.length !== 11) {
    return false;
  }

  if (/^(\d)\1+$/.test(numbers)) {
    return false;
  }

  let sum = 0;

  for (let index = 0; index < 9; index++) {
    sum += Number(numbers[index]) * (10 - index);
  }

  let digit = (sum * 10) % 11;

  if (digit === 10) {
    digit = 0;
  }

  if (digit !== Number(numbers[9])) {
    return false;
  }

  sum = 0;

  for (let index = 0; index < 10; index++) {
    sum += Number(numbers[index]) * (11 - index);
  }

  digit = (sum * 10) % 11;

  if (digit === 10) {
    digit = 0;
  }

  return digit === Number(numbers[10]);
}

function parseBrazilianDate(date: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return null;
  }

  const parts = date.split("/").map(Number);

  const day = parts[0];
  const month = parts[1];
  const year = parts[2];

  if (
    !day ||
    !month ||
    !year ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const parsedDate = new Date(
    year,
    month - 1,
    day
  );

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null;
  }

  return parsedDate;
}

export function isValidDate(date: string) {
  const parsedDate = parseBrazilianDate(date);

  if (!parsedDate) {
    return false;
  }

  const today = new Date();

  today.setHours(23, 59, 59, 999);

  return parsedDate <= today;
}

export function calculateAge(date: string) {
  const birthDate = parseBrazilianDate(date);

  if (!birthDate) {
    return null;
  }

  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDifference =
    today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export function isAdult(
  date: string,
  minimumAge = 18
) {
  if (!isValidDate(date)) {
    return false;
  }

  const age = calculateAge(date);

  return age !== null && age >= minimumAge;
}

export function getDateValidationError(
  date: string,
  minimumAge = 18,
  maximumAge = 100
) {
  if (date.trim() === "") {
    return "";
  }

  if (date.length < 10) {
    return "";
  }

  if (!isValidDate(date)) {
    return "Informe uma data de nascimento válida.";
  }

  const age = calculateAge(date);

  if (age === null) {
    return "Informe uma data de nascimento válida.";
  }

  if (age < minimumAge) {
    return (
      "É necessário ter pelo menos " +
      minimumAge +
      " anos."
    );
  }

  if (age > maximumAge) {
    return "Verifique o ano de nascimento informado.";
  }

  return "";
}