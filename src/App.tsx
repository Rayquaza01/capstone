import React from "react";

import { AppBar, Toolbar, Container, IconButton, Typography, Button, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { Editor } from "./Editor";

const drawerWidth = "25%";

export function App() {
    // functions for opening and closing drawers
    const [lOpen, setLOpen] = React.useState(false);
    const [rOpen, setROpen] = React.useState(false);

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
                <Button variant="text" onClick={() => setLOpen(false)}>Close</Button>
            </Drawer>

            <Drawer open={rOpen} variant="persistent" anchor="right" sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" } }}>
                <Button variant="text" onClick={() => setROpen(false)}>Close</Button>
            </Drawer>

            <Editor />
        </Container>
    );
}
