const post = (url: string, body: object) =>
  fetch(`http://localhost:3000${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((r) => r.json());
const get = (url: string) =>
  fetch("http://localhost:3000" + url).then((r) => r.json());
const put = (url: string, body: object) =>
  fetch(`http://localhost:3000${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((r) => r.json());
const dlt = (url: string) =>
  fetch(`http://localhost:3000${url}`, {
    method: "DELETE",
  }).then((r) => r.json());

export const request = { delete: dlt, post, put, get };

export const updateStatus = (
  ns: "todo" | "done" | "archived"
): { status: "todo" | "done" | "archived" } => ({
  status: {
    done: "todo" as const,
    todo: "done" as const,
    archived: "archived" as const,
  }[ns],
});
