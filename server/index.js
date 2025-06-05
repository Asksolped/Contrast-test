import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useRef, useState } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const generateColor = () => {
  return {
    hue: Math.floor(Math.random() * 255),
    sat: Math.floor(Math.random() * 255),
    lum: Math.floor(Math.random() * 255)
  };
};
const diffyColor = (color1, color2) => {
  return Math.abs(color1.hue - color2.hue) + Math.abs(color1.sat - color2.sat) + Math.abs(color1.lum - color2.lum);
};
function parseRGBString(rgbString) {
  const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) {
    console.warn("Failed to parse RGB string:", rgbString);
    return { hue: 0, sat: 0, lum: 0 };
  }
  return {
    hue: parseInt(match[1]),
    sat: parseInt(match[2]),
    lum: parseInt(match[3])
  };
}
function ColorButton() {
  const textRef = useRef(null);
  const backgroundRef = useRef(null);
  const [backgroundColor, setBackColor] = useState("rgb(0, 0, 0)");
  const [color, setColor] = useState("rgb(0, 0, 0)");
  const colorSelectBackground = () => {
    if (!textRef.current) return;
    const computedTextColor = getComputedStyle(textRef.current).color;
    const currColor = parseRGBString(computedTextColor);
    let bgColor, contrast;
    do {
      bgColor = generateColor();
      contrast = diffyColor(bgColor, currColor);
    } while (contrast < 200);
    setBackColor(`rgb(${bgColor.hue}, ${bgColor.sat}, ${bgColor.lum})`);
  };
  const colorSelectText = () => {
    if (!backgroundRef.current) return;
    const computedBackgroundColor = getComputedStyle(
      backgroundRef.current
    ).backgroundColor;
    const currColor = parseRGBString(computedBackgroundColor);
    let txtColor, contrast;
    do {
      txtColor = generateColor();
      contrast = diffyColor(txtColor, currColor);
    } while (contrast < 200);
    setColor(`rgb(${txtColor.hue}, ${txtColor.sat}, ${txtColor.lum})`);
  };
  const both = () => {
    let bg, text, diff;
    do {
      bg = generateColor();
      text = generateColor();
      diff = diffyColor(bg, text);
    } while (diff < 200);
    setBackColor(`rgb(${bg.hue}, ${bg.sat}, ${bg.lum})`);
    setColor(`rgb(${text.hue}, ${text.sat}, ${text.lum})`);
  };
  return /* @__PURE__ */ jsxs("div", { ref: backgroundRef, className: "background", style: { backgroundColor }, children: [
    /* @__PURE__ */ jsx("p", { ref: textRef, style: { color }, children: "Lorem ipsum dolor sit amet consectetur adipisicing elit." }),
    /* @__PURE__ */ jsxs("div", { className: "Button-container", children: [
      /* @__PURE__ */ jsx("button", { id: "textButton", onClick: colorSelectText, children: "Click me to change text color" }),
      /* @__PURE__ */ jsx("button", { id: "backgroundButton", onClick: colorSelectBackground, children: "Click me to change background color" }),
      /* @__PURE__ */ jsx("button", { id: "bothButton", onClick: both, children: "Click me to change both!" })
    ] })
  ] });
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(ColorButton, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DZAi_oRo.js", "imports": ["/assets/chunk-NL6KNZEE-CfxFt-pq.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-BPYC2ieC.js", "imports": ["/assets/chunk-NL6KNZEE-CfxFt-pq.js"], "css": ["/assets/root-tn0RQdqM.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-BG_yoTrr.js", "imports": ["/assets/chunk-NL6KNZEE-CfxFt-pq.js"], "css": ["/assets/home-DcalRgTr.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-565ee154.js", "version": "565ee154", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
