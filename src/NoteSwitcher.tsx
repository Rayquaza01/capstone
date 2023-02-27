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

import { Database, Notebook, Note } from "./webdb";
import { useLiveQuery } from "dexie-react-hooks";

export interface NoteSwitcherProps {
    data: NoteStructure;
}

export interface CategoryListProps {
    menuOpener: (anchor: HTMLButtonElement) => void
    changeSelection: (id: number) => void
    menuChangeSelection: (id: number, name: string) => void
}

// export interface CategoryItemsProps {
//     open: boolean
//     item: CategoryStructure
//     depth: number
// }

// export function NoteItem(props: Note) {
//     return <ListItem></ListItem>
// }

// export function NotebookItem(props: Notebook) {
//     const [open, setOpen] = React.useState(props.depth === 1);

//     function toggleOpen() {
//         setOpen(!open);
//     }

//     const subNotebooks = useLiveQuery(() =>
//         Database.notebooks.where({ parent: props.id }).sortBy("name")
//     );

//     const notes = useLiveQuery(() =>
//         Database.notes.where({ parent: props.id }).sortBy("name")
//     );

//     return (
//         <List component="div" disablePadding>
//             <ListItem>
//                 <ListItemButton onClick={toggleOpen} key={props.name}>
//                     <ListItemIcon><FolderIcon htmlColor={props.color} /></ListItemIcon>
//                     <ListItemText primary={props.name} />
//                     { open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                     <IconButton onClick={showMenu}><MoreIcon /></IconButton>
//                 </ListItemButton>
//             </ListItem>

//             <Collapse in={open} timeout="auto">
//                 <List component="div" disablePadding>
//                     { subNotebooks?.map(item => <NotebookItem {...item} key={item.name} />) }

//                     { notes?.map(item => <NoteItem {...item} key={item.name} /> }
//                 </List>
//             </Collapse>
//         </List>
//     );
// }

// export function CategoryList(props: CategoryListProps) {
//     const [open, setOpen] = React.useState(props.depth === 1);

//     const notebooks = useLiveQuery(() =>
//         Database.notebooks.where({ parent: 0 }).sortBy("name")
//     );

//     function toggleOpen(): void {
//         setOpen(!open);
//     }

//     function showMenu(e: React.MouseEvent<HTMLButtonElement>): void {
//         e.stopPropagation();
//         props.menuOpener(e.currentTarget);
//     }

//     return (
//         <List component="div" disablePadding>
//             <ListItem disablePadding key={props.item.name}>
//                 <ListItemButton onClick={toggleOpen} sx={{ pl: props.depth * 2 }}>
//                     <ListItemIcon><FolderIcon /></ListItemIcon>
//                     <ListItemText primary={props.item.name} />
//                     {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                     <IconButton onClick={showMenu}><MoreIcon /></IconButton>
//                 </ListItemButton>
//             </ListItem>

//             <Collapse in={open} timeout="auto">
//                 <List component="div" disablePadding>
//                     {props.item.folders.map(folder =>
//                         <CategoryList depth={props.depth + 1} item={folder} key={folder.name} menuOpener={props.menuOpener} />
//                     )}

//                     {props.item.items.map(note => {
//                         return (
//                             <ListItem key={note} disablePadding sx={{ pl: props.depth * 2 }}>
//                                 <ListItemButton>
//                                     <ListItemIcon><NoteIcon /></ListItemIcon>
//                                     <ListItemText primary={note} />
//                                     <IconButton onClick={showMenu}><MoreIcon /></IconButton>
//                                 </ListItemButton>
//                             </ListItem>
//                         );

//                     })}
//                 </List>
//             </Collapse>

//         </List>
//     );
// }

export function CategoryList(props: CategoryListProps) {
    function showMenu(e: React.MouseEvent<HTMLButtonElement>, id: number, name: string): void {
        e.stopPropagation();
        props.menuOpener(e.currentTarget);
        props.menuChangeSelection(id, name);
    }

    function changeSelection(id?: number) {
        if (id !== undefined)
            props.changeSelection(id);
    }

    const notes = useLiveQuery(() => {
        return Database.notes.where({ parent: 0 }).sortBy("id");
    });

    return (
        <List component="div" disablePadding>
            {
                (notes ?? []).map(item => (
                    <ListItem key={item.id} disablePadding>
                        <ListItemButton onClick={() => changeSelection(item.id)}>
                            <ListItemIcon><NoteIcon /></ListItemIcon>
                            <ListItemText primary={item.name} />
                            <IconButton onClick={e => showMenu(e, item.id ?? -1, item.name)}><MoreIcon /></IconButton>
                        </ListItemButton>
                    </ListItem>
                ))
            }
        </List>
    );
}
