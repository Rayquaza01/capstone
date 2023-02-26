import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { Settings } from "./SettingsPanel";
import { Database } from "./webdb";

require("quill/dist/quill.snow.css");

export interface EditorProps {
    settings: Settings
    id: number;
}

export function Editor(props: EditorProps) {
    const [content, setContent] = useState("");

    function updateDB(value: string, delta, source: string) {
        setContent(value);
        console.log(delta);

        if (source === "user") {
            console.log(value);
            Database.notes.update(props.id, { text: value });
        }
    }

    useEffect(() => {
        Database.notes.get(props.id).then((value) => {
            setContent(value?.text ?? "");
        });
    }, [props.id]);

    useEffect(() => {
        document.querySelector(".ql-editor")?.setAttribute("spellcheck", props.settings.spellcheck.toString());
    }, [props.settings.spellcheck]);

    return (
        <ReactQuill onChange={updateDB} value={content} />
    );
}
