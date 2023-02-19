import {Html, Head, Main, NextScript} from "next/document";
import _Head from "../components/Head";

export default function Document() {
    return (
        <Html lang="ja" prefix="og: http://ogp.me/ns#">
            <title>デジシンク</title>
            <Head />
            <_Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
