import React from "react";

import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";

import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";

import { NotebookList } from "./NoteSwitcher";

import { CreateNoteDialog, DeleteNoteDialog, RenameNoteDialog, DialogNames, MoveNoteDialog } from "./Dialogs";
import { NoteMenu } from "./NoteMenu";

import { Settings, SettingsPanel } from "./SettingsPanel";

import { Editor } from "./Editor";

import { EntryTypes, Note, Notebook } from "./webdb";

const drawerWidth = 500;

const DUMMY: Notebook = {
    id: -1,
    parent: -1,
    name: "",
    color: "#ff0000",
    type: EntryTypes.FOLDER
};

const INTRO: Note = {
    id: -1,
    parent: -1,
    name: "Introduction",
    color: "#ff0000",
    text: "Introduction text",
    type: EntryTypes.NOTE
};

export function App() {
    // functions for opening and closing drawers
    const [lOpen, setLOpen] = React.useState(false);
    const [rOpen, setROpen] = React.useState(false);

    // MENU STATES
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLButtonElement>(null);
    const [menuSelected, setMenuSelected] = React.useState<Note | Notebook>(DUMMY);
    function menuChangeSelection(entry: Note | Notebook) {
        setMenuSelected(entry);
    }

    function menuHandleOpen(anchor: HTMLButtonElement) {
        setMenuOpen(true);
        setMenuAnchor(anchor);
    }


    function menuHandleClose() {
        setMenuOpen(false);
        setMenuAnchor(null);
    }

    // DIALOG STATES
    const [newNoteDialogOpen, setNewNoteDialogOpen] = React.useState(false);
    const [renameNoteDialogOpen, setRenameNoteDialogOpen] = React.useState(false);
    const [deleteNoteDialogOpen, setDeleteNoteDialogOpen] = React.useState(false);
    const [moveNoteDialogOpen, setMoveNoteDialogOpen] = React.useState(false);
    function dialogHandleOpen(dialog: DialogNames) {
        switch (dialog) {
            case DialogNames.NEW:
                setNewNoteDialogOpen(true);
                break;
            case DialogNames.RENAME:
                setRenameNoteDialogOpen(true);
                break;
            case DialogNames.DELETE:
                setDeleteNoteDialogOpen(true);
                break;
            case DialogNames.MOVE:
                setMoveNoteDialogOpen(true);
                break;
        }

        menuHandleClose();
    }

    function dialogHandleClose(dialog: DialogNames) {
        switch (dialog) {
            case DialogNames.NEW:
                setNewNoteDialogOpen(false);
                break;
            case DialogNames.RENAME:
                setRenameNoteDialogOpen(false);
                break;
            case DialogNames.DELETE:
                setDeleteNoteDialogOpen(false);
                break;
            case DialogNames.MOVE:
                setMoveNoteDialogOpen(false);
                break;
        }
    }

    const [settings, setSettings] = React.useState<Settings>({fontSize: 16, spellcheck: true, darkMode: false});
    const [currentEntry, setCurrentEntry] = React.useState<Note | Notebook>(INTRO);

    function settingsPanelUpdate(newVal: Partial<Settings>) {
        setSettings({ ...settings, ...newVal });
    }

    function changeSelection(entry: Note | Notebook) {
        menuHandleClose();
        setLOpen(false);
        setROpen(false);

        setCurrentEntry(entry);
    }

    return (
        <Box>

            <AppBar position="static" style={{ backgroundColor: currentEntry.color }}>
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setLOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" flexGrow={1}>{currentEntry.name}</Typography>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ ml: 2 }} onClick={() => setROpen(true)}>
                        <SettingsIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer open={lOpen} variant="persistent" anchor="left" sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}>
                {/* <Typography variant="body1">Uhh...</Typography> */}
                <Button variant="contained" onClick={() => setLOpen(false)}>Close</Button>
                <NotebookList menuOpener={menuHandleOpen} changeSelection={changeSelection} menuChangeSelection={menuChangeSelection} selected={currentEntry.id} parent={-1} indentLevel={-1} />
            </Drawer>

            <Drawer open={rOpen} variant="persistent" anchor="right" sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}>
                <Button variant="contained" onClick={() => setROpen(false)}>Close</Button>
                <SettingsPanel settings={settings} setSettings={settingsPanelUpdate} />
            </Drawer>

            <Editor id={currentEntry?.id} settings={settings} />

            <NoteMenu open={menuOpen} openDialog={dialogHandleOpen} anchor={menuAnchor} handleClose={() => setMenuOpen(false)} selected={menuSelected.type} />
            <CreateNoteDialog open={newNoteDialogOpen} handleClose={dialogHandleClose} entry={menuSelected} />
            <RenameNoteDialog open={renameNoteDialogOpen} handleClose={dialogHandleClose} entry={menuSelected} />
            <DeleteNoteDialog open={deleteNoteDialogOpen} handleClose={dialogHandleClose} entry={menuSelected} />
            <MoveNoteDialog open={moveNoteDialogOpen} handleClose={dialogHandleClose} entry={menuSelected} />
        </Box>
    );
}
