import React, { MutableRefObject, useEffect, useRef } from "react";

import Quill from "quill";
import { Settings } from "./SettingsPanel";
import { Database } from "./webdb";

require("quill/dist/quill.snow.css");

export interface EditorProps {
    settings: Settings
    content: string
    id: number;
}

export function Editor(props: EditorProps) {
    const editor: MutableRefObject<null | Quill> = useRef(null);

    useEffect(() => {
        editor.current = new Quill("#editor", {theme: "snow"});
        editor.current.focus();

        editor.current.on("text-change", (delta, oldContents, source) => {
            if (source === "user") {
                console.log(editor?.current?.getText());
                Database.notes.update(props.id, { text: editor.current?.getText() ?? "" });
            }
        });
    }, []);

    useEffect(() => {
        document.querySelector(".ql-editor")?.setAttribute("spellcheck", props.settings.spellcheck.toString());
    }, [props.settings.spellcheck]);

    useEffect(() => {
        Database.notes.get(props.id).then((value) => {
            editor.current?.setText(value?.text ?? "", "api");
        });
    }, [props.id]);

    return (
        <div id="editor" style={{ height: 500 }}></div>
    );
}
