import { flow, Instance, types } from "mobx-state-tree";
import { createContext, useContext } from "react";
import { ApiStore } from "./api";

export const ToDo = types
  .model({
    id: types.string,
    title: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
    status: types.optional(
      types.enumeration(["done", "todo", "archived"]),
      "todo"
    ),
  })
  .actions((self) => ({
    changeName(nv: string) {
      self.title = nv;
    },
    changeDescription(nv: string) {
      self.description = nv;
    },
  }));

export const RootModel = types
  .compose(
    ApiStore,
    types.model({
      todos: types.array(ToDo),
    })
  )

  .actions((self) => {
    const fetchTodos = flow(function* () {
      const data = yield self.fetch("/items");
      self.todos = data;
    });

    return {
      addTodo: flow(function* ({ title }: { title: string }) {
        const newtodo = createToDo(title);
        const data = yield self.post("/item", newtodo);

        self.todos = data;

        return newtodo;
      }),
      fetchTodos,
      getTodo: flow(function* (id) {
        if (!self.todos[0] && self.state !== "pending") yield fetchTodos();
        return self.todos.find((item) => item.id === id) as ITask | undefined;
      }),
      deleteTodo: flow(function* (id: string) {
        const data = yield self.delete(`/item/${id}`);

        self.todos = data;
      }),
      updateTodo: flow(function* (id: string, updates: Partial<ITask>) {
        const data = yield self.patch(`/item/${id}`, updates);

        self.todos = data;
      }),
    };
  });

export let rootStore = RootModel.create({
  todos: [],
});

export type RootInstance = Instance<typeof RootModel>;
export type ITask = Instance<typeof ToDo>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const Provider = RootStoreContext.Provider;

export function useStore() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}

const createToDo = (title: string) =>
  ({
    status: "todo",
    title,
    description: "",
    //  I Just really don't want to add another lib
    id: "id" + Math.random().toString(16).slice(2),
  } as ITask);
