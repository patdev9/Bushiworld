/* eslint-disable @next/next/no-css-tags */
// eslint-disable-next-line @next/next/no-css-tags
// eslint-disable-next-line @next/next/no-script-in-document
import Script from "next/script";
import Document, { Html, Head, Main, NextScript } from "next/document";


class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="keywords"
            content="bushicro cro cronos blockchain nft"
          />
         
          <meta
            name="description"
            content="Welcome to The Bushicro, 2666 Warriors coming on Cronos to begin the Edo Period"
          />
          <meta name="author" content="bushicro" />
          <link rel="shortcut icon" href="/img/Bushicro1.JPG" />
          <link
            href="https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900&display=swap"
            rel="stylesheet"
          />
          <link href="/css/bootstrap.min.css"/>
          <link rel="stylesheet" href="/css/dark.css" />
         
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />

<link rel="preconnect" href="https://fonts.gstatic.com"/>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com"  />
    <link href="https://fonts.googleapis.com/css2?family=Ribeye&display=swap" rel="stylesheet"/>
   
    <link href="/styles/global.css" type="text/css" rel="stylesheet"/>
    <link href="/styles/TextMessage.css" type="text/css" rel="stylesheet"/>
    <link href="/styles/SceneTransition.css" type="text/css" rel="stylesheet"/>
    <link href="/styles/KeyboardMenu.css" type="text/css" rel="stylesheet"/>
    <link href="/styles/Hud.css" type="text/css" rel="stylesheet"/>
    <link href="/styles/TitleScreen.css" type="text/css" rel="stylesheet"/>
   
    <link href="/styles/Battle.css" type="text/css" rel="stylesheet"/>
    <link href="/styles/Combatant.css" type="text/css" rel="stylesheet"/>
    <link href="/styles/SubmissionMenu.css" type="text/css" rel="stylesheet"/>
    <link href="/styles/Team.css" type="text/css" rel="stylesheet"/>
    <link href="/styles/Menus.css" type="text/css" rel="stylesheet"/>

        </Head>

        <body>
   
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
