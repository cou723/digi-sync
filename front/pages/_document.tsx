import {Html, Main, NextScript} from "next/document";
import Head from "../components/Head";

export default function Document() {
    return (
        <Html lang="ja" prefix="og: http://ogp.me/ns#">
            <title>デジシンク</title>
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
