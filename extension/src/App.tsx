import React, { useEffect, useMemo } from "react";

import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";

import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import SyncIcon from "@mui/icons-material/Sync";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { NotebookList } from "./NoteSwitcher";

import { CreateNoteDialog, DeleteNoteDialog, RenameNoteDialog, DialogNames, MoveNoteDialog } from "./Dialogs";
import { NoteMenu } from "./NoteMenu";

import { Settings } from "./SettingsPanel";

import { Editor } from "./Editor";

import { EntryTypes, DBEntry } from "./webdb";

import { Database } from "./webdb";
import { useLiveQuery } from "dexie-react-hooks";

const drawerWidth = 500;

const DUMMY: DBEntry = {
    id: -1,
    parent: -1,
    name: "",
    color: "#1976D2",
    type: EntryTypes.FOLDER
};

const INTRO: DBEntry = {
    id: -1,
    parent: -1,
    name: "No Note Selected",
    color: "#1976D2",
    type: EntryTypes.NOTE
};

export function App() {
    // functions for opening and closing drawers
    const [lOpen, setLOpen] = React.useState(false);
    const [rOpen, setROpen] = React.useState(false);

    // MENU STATES
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLButtonElement>(null);
    const [menuSelected, setMenuSelected] = React.useState<DBEntry>(DUMMY);
    function menuChangeSelection(entry: DBEntry) {
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

    function openTopLevelNew() {
        setMenuSelected(DUMMY);
        dialogHandleOpen(DialogNames.NEW);
    }

    const [settings, setSettings] = React.useState<Settings>({fontSize: 16, spellcheck: true, darkMode: false});
    // const [currentEntry, setCurrentEntry] = React.useState<Notebook>(INTRO);
    const [currentId, setCurrentId] = React.useState(-1);

    // function settingsPanelUpdate(newVal: Partial<Settings>) {
    //     setSettings({ ...settings, ...newVal });
    // }

    function changeSelection(entry: DBEntry) {
        menuHandleClose();
        setLOpen(false);
        setROpen(false);

        setCurrentId(entry.id);
    }

    useEffect(() => {
        const ce = localStorage.getItem("currentId");
        if (ce !== null) {
            setCurrentId(parseInt(ce, 10));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("currentId", currentId.toString());
    }, [currentId]);

    const currentEntry = useLiveQuery(() => {
        if (currentId < 0) return INTRO;
        return Database.notes.get(currentId);
    }, [currentId], INTRO);

    // https://mui.com/material-ui/customization/dark-mode/
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = useMemo(() =>
        createTheme({ palette: { mode: prefersDarkMode ? "dark" : "light" } }),
    [prefersDarkMode]);

    return (
        <ThemeProvider theme={theme}>

            <CssBaseline />
            <AppBar position="static" style={{ backgroundColor: (currentEntry ?? INTRO).color }}>
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setLOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" flexGrow={1}>{(currentEntry ?? INTRO).name}</Typography>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ ml: 2 }} onClick={() => Database.sync()}>
                        <SyncIcon />
                    </IconButton>
                    <a href="note_ui.html" target="_blank" style={{ color: "inherit "}}>
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ ml: 2 }}>
                            <OpenInNewIcon />
                        </IconButton>
                    </a>
                </Toolbar>
            </AppBar>

            <Drawer open={lOpen} variant="persistent" anchor="left" sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}>
                {/* <Typography variant="body1">Uhh...</Typography> */}
                <Button variant="contained" onClick={() => setLOpen(false)}>Close</Button>
                <Button onClick={openTopLevelNew}>Create New Entry<AddIcon /></Button>
                <NotebookList menuOpener={menuHandleOpen} changeSelection={changeSelection} menuChangeSelection={menuChangeSelection} selected={currentId} parent={-1} indentLevel={-1} />
            </Drawer>

            {/* <Drawer open={rOpen} variant="persistent" anchor="right" sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}>
                <Button variant="contained" onClick={() => setROpen(false)}>Close</Button>
                <SettingsPanel settings={settings} setSettings={settingsPanelUpdate} />
            </Drawer> */}

            <Box>
                <Editor id={currentEntry?.id} settings={settings} />
            </Box>

            <NoteMenu open={menuOpen} openDialog={dialogHandleOpen} anchor={menuAnchor} handleClose={() => setMenuOpen(false)} selected={menuSelected.type} />
            <CreateNoteDialog open={newNoteDialogOpen} handleClose={dialogHandleClose} entry={menuSelected} />
            <RenameNoteDialog open={renameNoteDialogOpen} handleClose={dialogHandleClose} entry={menuSelected} />
            <DeleteNoteDialog open={deleteNoteDialogOpen} handleClose={dialogHandleClose} entry={menuSelected} />
            <MoveNoteDialog open={moveNoteDialogOpen} handleClose={dialogHandleClose} entry={menuSelected} />

        </ThemeProvider>
    );
}
