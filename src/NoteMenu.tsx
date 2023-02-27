import React, { useState, useEffect } from "react";

import { DialogNames } from "./Dialogs";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export interface NoteMenuProps {
    open: boolean
    anchor: HTMLElement | null
    openDialog: (name: DialogNames) => void
    handleClose: () => void
}

export function NoteMenu(props: NoteMenuProps) {
    return (
        <Menu open={props.open} anchorEl={props.anchor} onClose={props.handleClose} >
            <MenuItem onClick={() => props.openDialog(DialogNames.NEW)}>New Note</MenuItem>
            <MenuItem onClick={() => props.openDialog(DialogNames.RENAME)}>Rename</MenuItem>
            <MenuItem onClick={() => props.openDialog(DialogNames.DELETE)}>Delete</MenuItem>
        </Menu>
    )
}
