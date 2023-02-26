import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

import { Database } from "./webdb";

export interface CreateNoteDialogProps {
    open: boolean
    handleClose: () => void
}

export function CreateNoteDialog(props: CreateNoteDialogProps) {
    const [name, setName] = useState("");

    function createNewNote() {
        if (name === "") return;

        Database.notes.put({name: name, parent: 0, text: ""});
        props.handleClose();
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="new-note-title">
            <DialogTitle id="new-note-title">Create a new note</DialogTitle>
            <DialogContent><TextField autoFocus label="New Note Name" variant="standard" type="text" value={name} onChange={e => setName(e.target.value)} /></DialogContent>

            <DialogActions>
                <Button onClick={props.handleClose}>Cancel</Button>
                <Button onClick={createNewNote}>OK</Button>
            </DialogActions>
        </Dialog>
    );
}
