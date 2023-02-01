import React, { MutableRefObject, useEffect, useRef } from "react";

import Quill from "quill";
require("quill/dist/quill.snow.css");

export function Editor() {
    const editor: MutableRefObject<null | Quill> = useRef(null);

    useEffect(() => {
        editor.current = new Quill("#editor", {theme: "snow"});
    }, []);

    return (
        <div id="editor"></div>
    );
}
