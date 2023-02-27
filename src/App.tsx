import React, { useState, useEffect } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";

import { CategoryList } from "./NoteSwitcher";
import { CategoryStructure } from "./NoteStructure";

import { CreateNoteDialog, DeleteNoteDialog, RenameNoteDialog, DialogNames } from "./Dialogs";
import { NoteMenu } from "./NoteMenu";

import { Settings, SettingsPanel } from "./SettingsPanel";

import { Editor } from "./Editor";

import { Database } from "./webdb";

const ex1: CategoryStructure = {
    name: "Notebook",
    folders: [
        {
            name: "Folder",
            folders: [],
            items: ["hello", "world"]
        },
        {
            name: "Folder 2",
            folders: [{ name: "Subfolder", folders: [], items: ["Goodbye", "earth"] }],
            items: ["testing", "123"]
        }
    ],
    items: ["some", "notes", "here"]
};

interface AppBarNameProps {
    id: number
}

function AppBarName(props: AppBarNameProps) {
    const [name, setName] = useState("");

    useEffect(() => {
        Database.notes.get(props.id).then(res => {
            if (res !== undefined)
                setName(res.name);
        });
    }, [props.id]);

    return (
        <Typography variant="h6" flexGrow={1}>{name}</Typography>
    );
}

const drawerWidth = 500;

export function App() {
    // functions for opening and closing drawers
    const [lOpen, setLOpen] = React.useState(false);
    const [rOpen, setROpen] = React.useState(false);

    // MENU STATES
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLButtonElement>(null);
    const [menuSelectedID, setMenuSelectedID] = React.useState(-1);
    const [menuSelectedName, setMenuSelectedName] = React.useState("");
    function menuChangeSelection(id: number, name: string) {
        console.log("Menu Selected", id, name)
        setMenuSelectedID(id);
        setMenuSelectedName(name);
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
        }
    }

    const [settings, setSettings] = React.useState<Settings>({fontSize: 16, spellcheck: true, darkMode: false});
    const [currentID, setCurrentID] = React.useState(0);



    function settingsPanelUpdate(newVal: Partial<Settings>) {
        setSettings({ ...settings, ...newVal });
    }

    function changeSelection(id: number) {
        menuHandleClose();
        setLOpen(false);
        setROpen(false);

        setCurrentID(id);
    }

    return (
        <Box>

            <AppBar position="static" >
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setLOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <AppBarName id={currentID} />
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ ml: 2 }} onClick={() => setROpen(true)}>
                        <SettingsIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer open={lOpen} variant="persistent" anchor="left" sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}>
                {/* <Typography variant="body1">Uhh...</Typography> */}
                <Button variant="contained" onClick={() => setLOpen(false)}>Close</Button>
                <CategoryList menuOpener={menuHandleOpen} changeSelection={changeSelection} menuChangeSelection={menuChangeSelection} />
            </Drawer>

            <Drawer open={rOpen} variant="persistent" anchor="right" sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}>
                <Button variant="contained" onClick={() => setROpen(false)}>Close</Button>
                <SettingsPanel settings={settings} setSettings={settingsPanelUpdate} />
            </Drawer>

            <Editor id={currentID} settings={settings} />


            <NoteMenu open={menuOpen} openDialog={dialogHandleOpen} anchor={menuAnchor} handleClose={() => setMenuOpen(false)} />
            <CreateNoteDialog open={newNoteDialogOpen} handleClose={dialogHandleClose} />
            <RenameNoteDialog open={renameNoteDialogOpen} handleClose={dialogHandleClose} id={menuSelectedID} name={menuSelectedName} />
            <DeleteNoteDialog open={deleteNoteDialogOpen} handleClose={dialogHandleClose} id={menuSelectedID} name={menuSelectedName} />
        </Box>
    );
}
