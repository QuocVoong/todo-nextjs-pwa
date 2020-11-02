import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet }   from 'styled-components';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet     = new ServerStyleSheet();
    const page      = renderPage(App => props => sheet.collectStyles(<App {...props}/>));
    const styleTags = sheet.getStyleElement();
    return {
      ...page,
      styleTags
    };
  }

  render() {
    return (
      <html>
      <Head>
        <meta name='application-name' content='todo-next-pwa' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='todo-next-pwa' />
        <meta name='description' content='todo-next-pwa'/>
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='theme-color' content='#FFFFFF' />

        <link rel='apple-touch-icon' sizes='180x180' href='/icons/apple-touch-icon.png' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover' />
        {this.props.styleTags}
      </Head>
      <body>
      <Main/>
      <NextScript/>
      </body>
      </html>
    );
  }
}
