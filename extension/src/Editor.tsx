import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";

import browser from "webextension-polyfill";

import { Database } from "./webdb";

require("quill/dist/quill.snow.css");

export interface EditorProps {
    id?: number;
}

export function Editor(props: EditorProps) {
    const [content, setContent] = useState("");

    function updateDB(value: string, delta: any, source: string) {
        setContent(value);
        // console.log(delta);

        if (props.id === undefined || props.id < 0) return;

        if (source === "user") {
            // console.log(value);
            Database.updateText({ id: props.id, contents: value, modified: new Date() });
        }
    }

    useEffect(() => {
        if (props.id === undefined || props.id < 0) {
            setContent("Please select or create a note.");
            return;
        }

        Database.noteData.get(props.id).then((value) => {
            console.log("DB text record", value);
            if (value === undefined) {
                setContent("");
                return;
            }
            setContent(value.contents);
        });
    }, [props.id]);

    /* https://github.com/Rayquaza01/note-taker/blob/49ffab4cb77e03dcde12cddf8177c4e4ec3077eb/extension/notes.js#L45 */
    return (
        <ReactQuill onChange={updateDB} value={content} style={{ height: browser.extension.getViews({ type: "popup" }).includes(window) ? "300px" : "inherit" }} />
    );
}
