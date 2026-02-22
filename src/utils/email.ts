export function isValidEmailStrict(raw: string): boolean {
  const value = raw.trim();
  if (!value || value.length > 254) {
    return false;
  }

  if (value.includes("..") || /\s/.test(value)) {
    return false;
  }

  const atIndex = value.indexOf("@");
  if (atIndex <= 0 || atIndex !== value.lastIndexOf("@")) {
    return false;
  }

  const localPart = value.slice(0, atIndex);
  const domainPart = value.slice(atIndex + 1).toLowerCase();

  if (!localPart || !domainPart) {
    return false;
  }

  if (localPart.length > 64 || domainPart.length > 253) {
    return false;
  }

  // Allowed common RFC chars in local-part (unquoted form).
  if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)) {
    return false;
  }

  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    return false;
  }

  const labels = domainPart.split(".");
  if (labels.length < 2) {
    return false;
  }

  // Validate each DNS label: 1-63 chars, letters/digits/hyphen, no leading/trailing hyphen.
  for (const label of labels) {
    if (!label || label.length > 63) {
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(label)) {
      return false;
    }
    if (label.startsWith("-") || label.endsWith("-")) {
      return false;
    }
  }

  const tld = labels[labels.length - 1];
  if (!/^[a-z]{2,63}$/.test(tld)) {
    return false;
  }

  return true;
}
