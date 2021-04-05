// https://nathanbirrell.me/notes/composition-mobx-state-tree/
import { types, flow, Instance } from "mobx-state-tree";
import { request } from "../helpers";

const Model = {
  state: types.maybe(
    types.enumeration("state", ["init", "pending", "error", "done"])
  ),
  error: types.maybe(types.frozen()),
  countPendingCalls: 0,
};

const Views = (self: any) => ({
  get hasError() {
    return self.state === "error";
  },
  get isFetching() {
    return Boolean(self.countPendingCalls);
  },
  // ... and other shared views here, for example, hasData() might check if there are items in a self.data array
});

type Options = {
  config?: object;
  onFetchSuccess?: (response: any, method: IMethod) => any;
  onFetchError?: (error: any, method: IMethod) => any;
};

function generateAction({
  self,
  requestFn,
  method,
}: {
  self: any;
  requestFn: any;
  method: IMethod;
}) {
  return flow(function* <Parameters>(
    endpoint: string,
    parameters?: Parameters,
    options?: Options
  ) {
    const { onFetchSuccess, onFetchError } = options || {};
    self.state = "pending";
    self.countPendingCalls += 1;

    try {
      const response = yield requestFn(endpoint, parameters);

      self.error = null;
      if (typeof onFetchSuccess === "function") {
        onFetchSuccess(response, method); // callback to be overriden in composed model
      }
      self.state = "done";

      return response;
    } catch (error) {
      self.error = error;
      self.state = "error";
      if (
        typeof self.onFetchError === "function" ||
        typeof onFetchError === "function"
      ) {
        onFetchError?.(error, method);
        self.onFetchError(error); // callback to be overriden in composed model
      }
    } finally {
      self.countPendingCalls -= 1;
    }
  });
}

const Actions = (self: any) => {
  return {
    fetch: generateAction({
      self,
      requestFn: (endpoint: string) => request.get(endpoint),
      method: "get",
    }),
    post: generateAction({
      self,
      requestFn: (endpoint: string, parameters: any) =>
        request.post(endpoint, parameters),
      method: "post",
    }),
    patch: generateAction({
      self,
      requestFn: (endpoint: string, parameters: any) =>
        request.put(endpoint, parameters),
      method: "patch",
    }),
    delete: generateAction({
      self,
      requestFn: (endpoint: string) => request.delete(endpoint),
      method: "delete",
    }),
    onFetchError: function (error: Error) {
      console.error("Error reason:", error);
    },

    // If you like, you could create the callbacks `onFetchSuccess` and `onFetchError` with a simple error log to remind you to define these in your Products and Posts models
  };
};

export const ApiStore = types
  .model("ApiStore", Model)
  .views(Views)
  .actions(Actions);

type IMethod = "post" | "delete" | "patch" | "get";
