import React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Collapse from "@mui/material/Collapse";

import IconButton from "@mui/material/IconButton";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import NoteIcon from "@mui/icons-material/Note";
import FolderIcon from "@mui/icons-material/Folder";
import MoreIcon from "@mui/icons-material/MoreVert";

import { CategoryStructure, NoteStructure } from "./NoteStructure";

export interface NoteSwitcherProps {
    data: NoteStructure;
}

export interface CategoryListProps {
    menuOpener: (anchor: HTMLButtonElement) => void
    item: CategoryStructure
    depth: number
}

// export interface CategoryItemsProps {
//     open: boolean
//     item: CategoryStructure
//     depth: number
// }

export function CategoryList(props: CategoryListProps) {
    const [open, setOpen] = React.useState(props.depth === 1);

    function toggleOpen(): void {
        setOpen(!open);
    }

    function showMenu(e: React.MouseEvent<HTMLButtonElement>): void {
        e.stopPropagation();
        props.menuOpener(e.currentTarget);
    }

    return (
        <List component="div" disablePadding>
            <ListItem disablePadding key={props.item.name}>
                <ListItemButton onClick={toggleOpen} sx={{ pl: props.depth * 2 }}>
                    <ListItemIcon><FolderIcon /></ListItemIcon>
                    <ListItemText primary={props.item.name} />
                    {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    <IconButton onClick={showMenu}><MoreIcon /></IconButton>
                </ListItemButton>
            </ListItem>

            <Collapse in={open} timeout="auto">
                <List component="div" disablePadding>
                    {props.item.folders.map(folder =>
                        <CategoryList depth={props.depth + 1} item={folder} key={folder.name} menuOpener={props.menuOpener} />
                    )}

                    {props.item.items.map(note => {
                        return (
                            <ListItem key={note} disablePadding sx={{ pl: props.depth * 2 }}>
                                <ListItemButton>
                                    <ListItemIcon><NoteIcon /></ListItemIcon>
                                    <ListItemText primary={note} />
                                    <IconButton onClick={showMenu}><MoreIcon /></IconButton>
                                </ListItemButton>
                            </ListItem>
                        );

                    })}
                </List>
            </Collapse>

        </List>
    );
}
