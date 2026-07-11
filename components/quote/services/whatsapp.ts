export function createWhatsAppLink(message: string) {
  const phone = "5531993539953";
  return "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
}
