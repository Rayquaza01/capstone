import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";

import Circle from "@mui/icons-material/Circle";

import React, { useEffect, useState } from "react";

import { Database, EntryTypes, DBEntry } from "./webdb";
import { MoveNoteList } from "./NoteSwitcher";

export enum DialogNames {
    NEW,
    RENAME,
    DELETE,
    MOVE
}

export interface DialogProps {
    open: boolean
    handleClose: (dialog: DialogNames) => void
    entry: DBEntry
}

export function CreateNoteDialog(props: DialogProps) {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#ff0000");
    const [type, setType] = useState<EntryTypes | string>(EntryTypes.NOTE);

    useEffect(() => {
        setName("");
        // inherit color from parent
        setColor(props.entry.color);
    }, [props.open]);

    function handleClose() {
        props.handleClose(DialogNames.NEW);
    }

    function createNewNote() {
        if (name === "") return;

        if (typeof props.entry.id !== "number") return;

        switch (type) {
            case EntryTypes.NOTE:
                Database.createEntry({ name, parent: props.entry.id, color, type });
                break;
            case EntryTypes.FOLDER:
                Database.createEntry({ name, parent: props.entry.id, color, type });
                break;
        }
        handleClose();
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="new-note-title">
            <DialogTitle id="new-note-title">Create a new note</DialogTitle>
            <DialogContent>
                <TextField autoFocus label="New Note Name" variant="standard" type="text" value={name} onChange={e => setName(e.target.value)} />
                <FormControl>
                    <InputLabel id="create-dialog-type-label">Type</InputLabel>
                    <Select label="Type" labelId="create-dialog-type-label" value={type} onChange={(e) => setType(e.target.value) } variant="standard">
                        <MenuItem value={EntryTypes.NOTE}>Note</MenuItem>
                        <MenuItem value={EntryTypes.FOLDER}>Folder</MenuItem>
                    </Select>
                </FormControl>
                <IconButton aria-label="Color" onClick={() => (document.querySelector("#newNoteColor") as HTMLInputElement).click()}><Circle style={{ color }} /></IconButton>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={createNewNote}>OK</Button>
            </DialogActions>

            <input type="color" id="newNoteColor" value={color} onChange={(e) => setColor(e.target.value)} style={{ display: "none" }} />
        </Dialog>
    );
}

export function RenameNoteDialog(props: DialogProps) {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#ff0000");

    useEffect(() => {
        setName(props.entry.name);
        setColor(props.entry.color);
    }, [props.entry]);

    // useEffect(() => {
    //     setName("");
    // }, [props.open]);

    function handleClose() {
        props.handleClose(DialogNames.RENAME);
    }

    function rename() {
        if (name === "") return;

        if (typeof props.entry.id === "number") {
            Database.updateEntry({ id: props.entry?.id, name, color })
        }
        handleClose();
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="rename-note-title">
            <DialogTitle id="rename-note-title">Rename "{props.entry.name}"</DialogTitle>
            <DialogContent>
                <TextField autoFocus label="Note Name" variant="standard" type="text" value={name} onChange={e => setName(e.target.value)} />
                <IconButton aria-label="Color" onClick={() => (document.querySelector("#renameNoteColor") as HTMLInputElement).click()}><Circle style={{ color }} /></IconButton>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={rename}>OK</Button>
            </DialogActions>

            <input type="color" id="renameNoteColor" value={color} onChange={(e) => setColor(e.target.value)} style={{ display: "none" }} />
        </Dialog>
    );
}

export function DeleteNoteDialog(props: DialogProps) {
    function handleClose() {
        props.handleClose(DialogNames.DELETE);
    }

    function deleteNote() {
        if (typeof props.entry.id === "number") {
            Database.deleteFolder(props.entry.id);
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

export function MoveNoteDialog(props: DialogProps) {
    const [selected, setSelected] = useState(-1);

    useEffect(() => {
        setSelected(props.entry.parent);
    }, [props.entry]);

    function changeSelection(id: number) {
        setSelected(id);
    }

    function handleClose() {
        props.handleClose(DialogNames.MOVE);
    }

    function moveNote() {
        if (typeof props.entry.id === "number") {
            Database.updateEntry({ id: props.entry.id, parent: selected });
        }
        handleClose();
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="move-note-title">
            <DialogTitle id="move-note-title">Move "{props.entry.name}" to where?</DialogTitle>
            <DialogContent>
                <MoveNoteList parent={-1} indentLevel={0} changeSelection={changeSelection} selected={selected} disallowed={props.entry.id ?? -2} />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={moveNote}>Move</Button>
            </DialogActions>
        </Dialog>
    );
}
