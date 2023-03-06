import React, { useState, useEffect } from "react";

import { EntryTypes } from "./webdb";
import { DialogNames } from "./Dialogs";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export interface MenuProps {
    open: boolean
    anchor: HTMLElement | null
    selected: EntryTypes
    openDialog: (name: DialogNames) => void
    handleClose: () => void
}

export function NoteMenu(props: MenuProps) {
    return (
        <Menu open={props.open} anchorEl={props.anchor} onClose={props.handleClose} >
            { props.selected === EntryTypes.FOLDER && <MenuItem onClick={() => props.openDialog(DialogNames.NEW)}>New</MenuItem> }
            <MenuItem onClick={() => props.openDialog(DialogNames.RENAME)}>Rename</MenuItem>
            <MenuItem onClick={() => props.openDialog(DialogNames.DELETE)}>Delete</MenuItem>
            <MenuItem onClick={() => props.openDialog(DialogNames.MOVE)}>Move</MenuItem>
        </Menu>
    );
}
