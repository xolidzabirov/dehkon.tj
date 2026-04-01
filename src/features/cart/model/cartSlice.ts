import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '@/shared/api/cart.service';
import type { Cart, CartItemCreateInfo, CartItemUpdateInfo } from './types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.get();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки корзины');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (data: CartItemCreateInfo, { dispatch, rejectWithValue }) => {
    try {
      await cartService.addItem(data);
      dispatch(fetchCart());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка добавления в корзину');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ itemId, data }: { itemId: number; data: CartItemUpdateInfo }, { dispatch, rejectWithValue }) => {
    try {
      await cartService.updateItem(itemId, data);
      dispatch(fetchCart());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (itemId: number, { dispatch, rejectWithValue }) => {
    try {
      await cartService.removeItem(itemId);
      dispatch(fetchCart());
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clear();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка очистки корзины');
    }
  }
);

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart(state) {
      state.cart = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
