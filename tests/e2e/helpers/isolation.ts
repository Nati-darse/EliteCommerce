export function uniqueEmail(prefix = 'user') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`
}

export function uniqueName(prefix = 'Product') {
  return `${prefix}-${Date.now()}`
}

export function uniquePrice() {
  return Math.floor(Math.random() * 900) + 100  // random price 100-999
}