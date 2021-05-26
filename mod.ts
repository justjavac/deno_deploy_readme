import { html } from "https://deno.land/x/html/mod.ts";
import unified from "https://esm.sh/unified";
import markdown from "https://esm.sh/remark-parse";
import remark2rehype from "https://esm.sh/remark-rehype";
import externalLinks from "https://esm.sh/remark-external-links";
import stringify from "https://esm.sh/rehype-stringify";

function getUrl(fileName: string) {
  if (!Deno.env.get("GITHUB_REPO")) {
    return new URL(fileName, import.meta.url);
  }

  const repo = Deno.env.get("GITHUB_REPO");
  const branch = Deno.env.get("GITHUB_BRANCH") ?? "main";

  return `https://raw.githubusercontent.com/${repo}/${branch}/${fileName}`;
}

async function handleRequest(request: Request) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/assets/style.css")) {
    const style = new URL("assets/style.css", import.meta.url);
    const response = await fetch(style);
    const headers = new Headers(response.headers);
    headers.set("content-type", "text/css; charset=utf-8");
    return new Response(response.body, { ...response, headers });
  }

  if (pathname.startsWith("/assets")) {
    const favicon = new URL(pathname.substr(1), import.meta.url);
    return fetch(favicon);
  }

  const response = await fetch(getUrl("README.md"));
  const content = await response.text();

  const output = await unified()
    .use(markdown)
    .use(externalLinks)
    .use(remark2rehype)
    .use(stringify)
    .process(content);

  return new Response(
    html`<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
          <title>Deno Deploy Readme</title>
          <link rel="stylesheet" href="/assets/style.css" />
        </head>
        <body>
          <div class="container-lg px-3 my-5 markdown-body">
            ${output.toString()}
          </div>
          <script src="https://cdn.bootcdn.net/ajax/libs/anchor-js/4.2.2/anchor.min.js"></script>
          <script>
            anchors.add();
          </script>
        </body>
      </html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    },
  );
}

addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});
