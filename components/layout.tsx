import React from "react";

export function Layout(props: { title: string; children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        
        <title>{props.title}</title>
        <script src="/uno.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"></link>
        {/* <link rel="stylesheet" href="/index.css" /> */}
      </head>
      <body>
        <div className="App" role="main">
          <article className="App-article">

            <div style={{ height: "30px" }}></div>
            <h3>{props.title}</h3>

            <div style={{ height: "30px" }}></div>
            {props.children}
          </article>
        </div>
      </body>
    </html>
  );
}
