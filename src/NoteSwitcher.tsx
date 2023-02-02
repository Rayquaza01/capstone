import React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Collapse from "@mui/material/Collapse";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import NoteIcon from "@mui/icons-material/Note";
import FolderIcon from "@mui/icons-material/Folder";

import { CategoryStructure, NoteStructure } from "./NoteStructure";

export interface NoteSwitcherProps {
    data: NoteStructure;
}

export interface CategoryListProps {
    item: CategoryStructure
    depth: number
}

export interface CategoryItemsProps {
    open: boolean
    item: CategoryStructure
    depth: number
}

export function CategoryList(props: CategoryListProps) {
    const [open, setOpen] = React.useState(props.depth === 1);

    return (
        <List component="div" disablePadding>
            <ListItem disablePadding key={props.item.name}>
                <ListItemButton onClick={() => setOpen(!open)} sx={{ pl: props.depth * 2 }}>
                    <ListItemIcon><FolderIcon /></ListItemIcon>
                    <ListItemText primary={props.item.name} />
                    {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemButton>
            </ListItem>

            <Collapse in={open} timeout="auto">
                <List component="div" disablePadding>
                    {props.item.folders.map(folder =>
                        <CategoryList depth={props.depth + 1} item={folder} key={folder.name} />
                    )}

                    {props.item.items.map(note => {
                        return (
                            <ListItem key={note} disablePadding sx={{ pl: props.depth * 2 }}>
                                <ListItemButton>
                                    <ListItemIcon><NoteIcon /></ListItemIcon>
                                    <ListItemText primary={note} />
                                </ListItemButton>
                            </ListItem>
                        );

                    })}
                </List>
            </Collapse>

        </List>
    );
}

// export default function NoteSwitcher(props: NoteSwitcherProps) {
//     return (
//     )
// }
