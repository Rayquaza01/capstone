import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Database } from "./webdb";

interface AppBarNameProps {
    id: number;
}
export function AppBarName(props: AppBarNameProps) {
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
