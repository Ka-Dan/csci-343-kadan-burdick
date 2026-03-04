import { createSlice, nanoid } from "@reduxjs/toolkit"

const todosSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    addTodo: {
      prepare(text) {
        return { payload: { id: nanoid(), text } }
      },
      reducer(state, action) {
        state.push(action.payload)
      }
    },
    deleteTodo(state, action) {
      return state.filter(todo => todo.id !== action.payload)
    }
  }
})

export const { addTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;