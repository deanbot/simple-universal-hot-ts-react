import express from "express";
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../../simpleApp/App';
declare let __USE_CLIENT_RENDER_ONLY__;

export default express.Router()
  .get('*', (req, res, next) => {
    let markup = !__USE_CLIENT_RENDER_ONLY__
      ? renderToString(
        <App />
      )
      : 'Please wait'

    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
          <meta content="IE=edge" http-equiv="X-UA-Compatible">
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
          />
        <title>Game Time</title>
      </head>

      <body>
        <div id="app2"></div>
        <div id="app">${markup}</div>
        <script type="application/javascript" src="/bundle.js"></script>
        <script>
    function render(markup) {
      document.getElementById("app2").innerHTML = markup;
    }

    function update() {
      fetch("/api")
        .then(function (response) {
          return response.text();
        })
        .then(function (text) {
          render(text);
          setTimeout(update, 1000);
        })
        .catch(function (err) {
          render("❌  " + err.message + " at <strong>" + new Date() + "</strong>");
          setTimeout(update, 1000);
        })
        ;
    }

    update();
  </script>
      </body>
    </html>
  `)
  }) 