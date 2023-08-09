import * as path from "path";
import { existsSync, rmSync, statSync } from "fs";
import type { ServeOptions } from "bun";
import { renderToReadableStream, renderToString } from "react-dom/server";



const PROJECT_ROOT = import.meta.dir;
const PUBLIC_DIR = path.resolve(PROJECT_ROOT, "public");
const BUILD_DIR = path.resolve(PROJECT_ROOT, ".build");

const srcRouter = new Bun.FileSystemRouter({
  dir: "./pages",
  style: "nextjs",
});


// refreshes the .build directory
if (existsSync(BUILD_DIR))
        rmSync(BUILD_DIR, { recursive: true });

// console.log(import.meta.dir + '/unoConfig.jsx');

await Bun.build({
  entrypoints: [
    import.meta.dir + "/hydrate.tsx",
    // import.meta.dir + '/unoConfig.jsx',
    ...Object.values(srcRouter.routes),
  ],
  outdir: BUILD_DIR,
  target: "browser",
  splitting: true,
  minify: true,
});

const unoFile = await Bun.file('uno.js').text()
await Bun.write(`${BUILD_DIR}/uno.js`, unoFile)


const PAGE_DIR = '/pages'

const buildRouter = new Bun.FileSystemRouter({
  dir: BUILD_DIR + PAGE_DIR,
  style: "nextjs",
});

// console.log(buildRouter);


function serveFromDir(config: {
  directory: string;
  path: string;
}): Response | null {
  let basePath = path.join(config.directory, config.path);
  // const suffixes = [""];
  const suffixes = ["", ".html", "index.html"];

  for (const suffix of suffixes) {
    try {
      const pathWithSuffix = path.join(basePath, suffix);
      const stat = statSync(pathWithSuffix);
      if (stat && stat.isFile()) {
        return new Response(Bun.file(pathWithSuffix));
      }
    } catch (err) {}
  }

  return null;
}

export default {
  port: 3007,
  async fetch(request) {
    console.log(request.url);
    
    const match = srcRouter.match(request);

    if (match) {
      const builtMatch = buildRouter.match(request);
      
      if (!builtMatch) {
        return new Response("Unknown error", { status: 500 });
      }

      const Component = await import(match.filePath);
      const stream = await renderToReadableStream(<Component.default />, {
        bootstrapScriptContent: `globalThis.PATH_TO_PAGE = "${PAGE_DIR}/${builtMatch.src}";`,
        bootstrapModules: ["/hydrate.js"],
        // bootstrapScripts
      });

      return new Response(stream, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
    let reqPath = new URL(request.url).pathname;
    console.log(request.method, reqPath);
    if (reqPath === "/") reqPath = "/index.html";

    // check public
    const publicResponse = serveFromDir({
      directory: PUBLIC_DIR,
      path: reqPath,
    });
    if (publicResponse){
      console.log('sending ' + reqPath)
      return publicResponse
    }

    // check /.build
    const buildResponse = serveFromDir({ directory: BUILD_DIR, path: reqPath });
    if (buildResponse){
      console.log('sending ' + reqPath)
      return buildResponse
    }

    return new Response("File not found", {
      status: 404,
    });
  },
} satisfies ServeOptions;


console.log('listening on  http://localhost:' + 3007)
