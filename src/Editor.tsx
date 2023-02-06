import React, { MutableRefObject, useEffect, useRef } from "react";

import Quill, { TextChangeHandler } from "quill";
import { Settings } from "./SettingsPanel";

require("quill/dist/quill.snow.css");

export interface EditorProps {
    onChange?: TextChangeHandler
    settings: Settings
    content: string
}

export function Editor(props: EditorProps) {
    const editor: MutableRefObject<null | Quill> = useRef(null);

    useEffect(() => {
        editor.current = new Quill("#editor", {theme: "snow"});
        editor.current.focus();

        if (props.onChange)
            editor.current.on("text-change", props.onChange);
    }, []);

    useEffect(() => {
        editor.current?.setText(props.content, "api");
    }, [props.content]);

    return (
        <div id="editor" style={{ height: 500 }}></div>
    );
}
