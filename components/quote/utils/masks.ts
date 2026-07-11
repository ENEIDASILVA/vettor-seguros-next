export function phoneMask(value: string) {
  const digits = value.replace(/\D/g, "").substring(0, 11);

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function cpfMask(value: string) {
  const digits = value.replace(/\D/g, "").substring(0, 11);

  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function cepMask(value: string) {
  const digits = value.replace(/\D/g, "").substring(0, 8);

  return digits.replace(/(\d{5})(\d)/, "$1-$2");
}

export function dateMask(value: string) {
  const digits = value.replace(/\D/g, "").substring(0, 8);

  return digits
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
}