import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";

import browser from "webextension-polyfill";

import Box from "@mui/material/Box"
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { Settings } from "./SettingsPanel";
import { Database } from "./webdb";

require("quill/dist/quill.snow.css");

export interface EditorToolbarProps {

}

export function EditorToolbar(props: EditorToolbarProps) {
    const [size, setSize] = useState<false | string>(false);

    return (
        <Box id="toolbar">
            <Select value={size} onChange={e => setSize(e.target.value)} className="ql-size">
                <MenuItem value="small" />
                <MenuItem selected />
                <MenuItem value="large" />
                <MenuItem value="huge" />
            </Select>
        </Box>
    );
}

export interface EditorProps {
    settings: Settings
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

    useEffect(() => {
        document.querySelector(".ql-editor")?.setAttribute("spellcheck", props.settings.spellcheck.toString());
    }, [props.settings.spellcheck]);

    /* https://github.com/Rayquaza01/note-taker/blob/49ffab4cb77e03dcde12cddf8177c4e4ec3077eb/extension/notes.js#L45 */
    return (
        <ReactQuill onChange={updateDB} value={content} style={{ height: browser.extension.getViews({ type: "popup" }).includes(window) ? "300px" : "inherit" }} />
    );
}
