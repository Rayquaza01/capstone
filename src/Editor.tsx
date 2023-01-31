import React from "react";

import Quill from "quill";
require("quill/dist/quill.snow.css");

export class Editor extends React.Component {
    editor: Quill | null = null;

    componentDidMount(): void {
        this.editor = new Quill("#editor", {theme: "snow"});
    }

    render(): React.ReactNode {
        return (<div id="editor"></div>);
    }
}
