import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";

import { Database, EntryTypes, Note, Notebook } from "./webdb";

export enum DialogNames {
    NEW,
    RENAME,
    DELETE
}

export interface DialogProps {
    open: boolean
    handleClose: (dialog: DialogNames) => void
}

export interface ModifyDialogProps extends DialogProps {
    entry: Note | Notebook
}

export function CreateNoteDialog(props: DialogProps) {
    const [name, setName] = useState("");

    useEffect(() => {
        setName("");
    }, [props.open]);

    function handleClose() {
        props.handleClose(DialogNames.NEW);
    }

    function createNewNote() {
        if (name === "") return;

        Database.notes.put({name: name, parent: 0, text: "", type: EntryTypes.NOTE});
        handleClose();
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="new-note-title">
            <DialogTitle id="new-note-title">Create a new note</DialogTitle>
            <DialogContent><TextField autoFocus label="New Note Name" variant="standard" type="text" value={name} onChange={e => setName(e.target.value)} /></DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={createNewNote}>OK</Button>
            </DialogActions>
        </Dialog>
    );
}

export function RenameNoteDialog(props: ModifyDialogProps) {
    const [name, setName] = useState("");

    useEffect(() => {
        setName(props.entry.name);
    }, [props.entry.name]);

    // useEffect(() => {
    //     setName("");
    // }, [props.open]);

    function handleClose() {
        props.handleClose(DialogNames.RENAME);
    }

    function rename() {
        if (name === "") return;

        if (typeof props.entry.id === "number") {
            Database.notes.update(props.entry?.id, { name });
        }
        handleClose();
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="rename-note-title">
            <DialogTitle id="rename-note-title">Rename "{props.entry.name}"</DialogTitle>
            <DialogContent><TextField autoFocus label="Note Name" variant="standard" type="text" value={name} onChange={e => setName(e.target.value)} /></DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={rename}>OK</Button>
            </DialogActions>
        </Dialog>
    );
}

export function DeleteNoteDialog(props: ModifyDialogProps) {
    function handleClose() {
        props.handleClose(DialogNames.DELETE);
    }

    function deleteNote() {
        if (typeof props.entry.id === "number") {
            Database.notes.delete(props.entry.id);
        }
        handleClose();
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="delete-note-title">
            <DialogTitle id="delete-note-title">Delete "{props.entry.name}"?</DialogTitle>
            <DialogContent>
                <DialogContentText>Are you sure you want to delete this note? This action cannot be undone.</DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={deleteNote}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
}
