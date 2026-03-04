import { configureStore } from "@reduxjs/toolkit"
import todosReducer from "./TodoSlice"

export const TodoStore = configureStore({
  reducer: {
    todos: todosReducer
  }
})