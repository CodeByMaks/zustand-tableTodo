import { create } from 'zustand';

export interface iTodo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface TodoStore {
  todos: iTodo[];
  addTodo: (todo: Omit<iTodo, 'id' | 'completed'>) => void;
  editTodo: (id: number, updatedTodo: Omit<iTodo, 'id' | 'completed'>) => void;
  deleteTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: 'all' | 'completed' | 'pending';
  setFilterStatus: (status: 'all' | 'completed' | 'pending') => void;
}

const useStore = create<TodoStore>((set) => ({
  todos: [
    {
      id: 1,
      title: "Learn React",
      description: "Learn React and build a todo app",
      completed: false,
    },
  ],
  searchTerm: '',
  filterStatus: 'all',
  addTodo: (todo) =>
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: Date.now(),
          completed: false,
          ...todo,
        },
      ],
    })),
  editTodo: (id, updatedTodo) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updatedTodo } : todo
      ),
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilterStatus: (status) => set({ filterStatus: status }),
}));

export default useStore;