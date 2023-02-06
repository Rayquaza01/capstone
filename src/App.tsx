import React from "react";

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

import { Settings, SettingsPanel } from "./SettingsPanel";

import { Editor } from "./Editor";

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

const drawerWidth = 500;

export function App() {
    // functions for opening and closing drawers
    const [lOpen, setLOpen] = React.useState(false);
    const [rOpen, setROpen] = React.useState(false);

    const [db, setDB] = React.useState(ex1);
    const [content, setContent] = React.useState("");

    // setTimeout(() => setContent("hello, world"), 5000);

    const [menuOpen, setMenuOpen] = React.useState(false);
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLButtonElement>(null);

    const [settings, setSettings] = React.useState<Settings>({fontSize: 16, spellcheck: true, darkMode: false});

    function menuHandleOpen(anchor: HTMLButtonElement) {
        setMenuOpen(true);
        setMenuAnchor(anchor);
    }

    function menuHandleClose() {
        setMenuOpen(false);
        setMenuAnchor(null);
    }

    function settingsPanelUpdate(newVal: Partial<Settings>) {
        setSettings({ ...settings, ...newVal });
    }

    return (
        <Box>

            <AppBar position="static" >
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setLOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" flexGrow={1}>
                        Testing
                    </Typography>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ ml: 2 }} onClick={() => setROpen(true)}>
                        <SettingsIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer open={lOpen} variant="persistent" anchor="left" sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}>
                {/* <Typography variant="body1">Uhh...</Typography> */}
                <Button variant="contained" onClick={() => setLOpen(false)}>Close</Button>
                <CategoryList item={db} depth={1} menuOpener={menuHandleOpen} />
            </Drawer>

            <Drawer open={rOpen} variant="persistent" anchor="right" sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}>
                <Button variant="contained" onClick={() => setROpen(false)}>Close</Button>
                <SettingsPanel settings={settings} setSettings={settingsPanelUpdate} />
            </Drawer>

            <Editor content={content} settings={settings} />

            <Menu open={menuOpen} anchorEl={menuAnchor} onClose={menuHandleClose}>
                <MenuItem onClick={menuHandleClose}>Rename</MenuItem>
                <MenuItem onClick={menuHandleClose}>Delete</MenuItem>
                <MenuItem onClick={menuHandleClose}>New Folder</MenuItem>
                <MenuItem onClick={menuHandleClose}>New Note</MenuItem>
            </Menu>
        </Box>
    );
}
