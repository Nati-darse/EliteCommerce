import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// --- Types ---
interface User {
  id: string
  email: string
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface UIState {
  cartOpen: boolean
  authModalOpen: boolean
  searchOpen: boolean
}

interface StoreState {
  // User
  user: User | null
  setUser: (user: User | null) => void

  // Cart
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  cartTotal: () => number
  cartCount: () => number

  // UI
  ui: UIState
  toggleCart: () => void
  toggleAuthModal: () => void
  toggleSearch: () => void
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // --- User ---
        user: null,
        setUser: (user) => set({ user }),

        // --- Cart ---
        cart: [],
        addToCart: (item) => set((state) => {
          const existing = state.cart.find((i) => i.id === item.id)
          if (existing) {
            // increment quantity if already in cart
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { cart: [...state.cart, item] }
        }),
        removeFromCart: (id) => set((state) => ({
          cart: state.cart.filter((i) => i.id !== id),
        })),
        clearCart: () => set({ cart: [] }),
        cartTotal: () => {
          const { cart } = get()
          return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        },
        cartCount: () => {
          const { cart } = get()
          return cart.reduce((sum, item) => sum + item.quantity, 0)
        },

        // --- UI ---
        ui: {
          cartOpen: false,
          authModalOpen: false,
          searchOpen: false,
        },
        toggleCart: () => set((state) => ({
          ui: { ...state.ui, cartOpen: !state.ui.cartOpen },
        })),
        toggleAuthModal: () => set((state) => ({
          ui: { ...state.ui, authModalOpen: !state.ui.authModalOpen },
        })),
        toggleSearch: () => set((state) => ({
          ui: { ...state.ui, searchOpen: !state.ui.searchOpen },
        })),
      }),
      {
        name: 'elite-commerce-store',  // localStorage key
        partialize: (state) => ({ cart: state.cart }), // only persist cart
      }
    )
  )
)