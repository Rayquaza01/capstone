import React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";


import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";

import { CategoryList } from "./NoteSwitcher";
import { CategoryStructure } from "./NoteStructure";

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
    items: [
        "some",
        "notes",
        "here"
    ]
}

const drawerWidth = 500;

export function App() {
    // functions for opening and closing drawers
    const [lOpen, setLOpen] = React.useState(false);
    const [rOpen, setROpen] = React.useState(false);

    const [db, setDB] = React.useState(ex1);

    return (
        <Container maxWidth={false}>

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
                <CategoryList item={db} depth={1} />
            </Drawer>

            <Drawer open={rOpen} variant="persistent" anchor="right" sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}>
                <Button variant="text" onClick={() => setROpen(false)}>Close</Button>
            </Drawer>

            <Editor />
        </Container>
    );
}
