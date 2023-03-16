import React, { useState } from "react";

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

import { Database, DBEntry, EntryTypes } from "./webdb";
import { useLiveQuery } from "dexie-react-hooks";

/**
 * The properties of a NotebookList
 */
export interface NotebookListProps {
    /**
     * Function that opens the menu for the given selection
     * @param anchor The button that the user clicked to open the menu. Where the menu will appear
     * @param type Which menu to open, either Note or Folder
     */
    menuOpener: (anchor: HTMLButtonElement, type: EntryTypes) => void

    /**
     * Changes which entry is currently selected for the title and editor
     * @param entry The db entry associated with the button the user clicked
     */
    changeSelection: (entry: DBEntry) => void

    /**
     * Changes which entry is currently selected for the menu and dialogs
     * @param entry The db entry associated with the button the user clicked
     */
    menuChangeSelection: (entry: DBEntry) => void

    selected: number;

    /** The parent to display the children of. Set to -1 for top level */
    parent: number
    /** The level of indentation to use */
    indentLevel: number
}

/**
 * The list of notebooks and notes that appears in the left sidebar of the application.
 * Notes within a notebook are collapsable
 * @param props
 */
export function NotebookList(props: NotebookListProps) {
    const [open, setOpen] = useState(true);

    function showMenu(e: React.MouseEvent<HTMLButtonElement>, entry?: DBEntry): void {
        e.stopPropagation();

        if (entry === undefined) return;
        props.menuOpener(e.currentTarget, entry.type);
        props.menuChangeSelection(entry);
    }

    function changeSelection(entry: DBEntry) {
        props.changeSelection(entry);
    }

    const notebook = useLiveQuery(() => {
        return Database.notes.get(props.parent) as Promise<DBEntry>;
    });

    const subNotebooks = useLiveQuery(() => {
        return Database.notes.where({ parent: props.parent, type: EntryTypes.FOLDER }).sortBy("name");
    });

    const notes = useLiveQuery(() => {
        return Database.notes.where({ parent: props.parent, type: EntryTypes.NOTE }).sortBy("name");
    });

    return (
        <List component="div" disablePadding>
            {
                (props.parent !== -1) &&
                    <ListItem key={props.parent} disablePadding sx={{ paddingLeft: 2 * props.indentLevel }}>
                        <ListItemButton onClick={() => setOpen(!open)}>
                            <ListItemIcon><FolderIcon style={{ color: notebook?.color }} /></ListItemIcon>
                            <ListItemText primary={notebook?.name} />
                            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            <IconButton onClick={e => showMenu(e, notebook)}><MoreIcon /></IconButton>
                        </ListItemButton>
                    </ListItem>
            }
            <Collapse in={open} timeout="auto">
                <List component="div" disablePadding>
                    {
                        subNotebooks?.map(item => {
                            if (typeof item.id === "number")
                                return <NotebookList {...props} parent={item.id} indentLevel={props.indentLevel + 1} key={item.id} />;
                        })
                    }

                    {
                        notes?.map(item => (
                            <ListItem key={item.id} disablePadding sx={{ paddingLeft: 2 * (props.indentLevel + 1) }}>
                                <ListItemButton selected={props.selected === item.id} onClick={() => changeSelection(item)}>
                                    <ListItemIcon><NoteIcon style={{ color: item.color }} /></ListItemIcon>
                                    <ListItemText primary={item.name} />
                                    <IconButton onClick={e => showMenu(e, item)}><MoreIcon /></IconButton>
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </List>
            </Collapse>
        </List>
    );
}

/**
 * The properties of MoveNoteList. Similar to NotebookList
 */
export interface MoveNoteListProps {
    /**
     * Changes which entry is currently selected for the title and editor
     * @param entry The db entry associated with the button the user clicked
     */
    changeSelection: (id: number) => void

    disallowed: number

    selected: number;

    /** The parent to display the children of. Set to -1 for top level */
    parent: number
    /** The level of indentation to use */
    indentLevel: number
}

export function MoveNoteList(props: MoveNoteListProps) {
    const notebook = useLiveQuery(() => {
        return Database.notes.get(props.parent) as Promise<DBEntry>;
    });

    const subNotebooks = useLiveQuery(() => {
        return Database.notes.where({ parent: props.parent, type: EntryTypes.FOLDER }).sortBy("name");
    });

    return (
        <List component="div" disablePadding>
            <ListItem key={props.parent} disablePadding sx={{ paddingLeft: 2 * props.indentLevel }}>
                <ListItemButton onClick={() => props.changeSelection(notebook?.id ?? -1)} selected={props.selected === notebook?.id ?? -1}>
                    <ListItemIcon><FolderIcon style={{ color: notebook?.color }} /></ListItemIcon>
                    <ListItemText primary={notebook?.name ?? "Top Level"} />
                </ListItemButton>
            </ListItem>
            {
                subNotebooks?.map(item => {
                    if (typeof item.id === "number" && item.id !== props.disallowed)
                        return <MoveNoteList {...props} parent={item.id} indentLevel={props.indentLevel + 1} key={item.id} />;
                })
            }
        </List>
    );

}
