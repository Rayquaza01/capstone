import React from "react"

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";

export interface Settings {
    fontSize: number
    spellcheck: boolean
    darkMode: boolean
}

export interface SettingsPanelProps {
    settings: Settings
    setSettings: (newVal: Partial<Settings>) => void
}

export function SettingsPanel(props: SettingsPanelProps) {
    function updateSettings(e: React.ChangeEvent<HTMLInputElement>) {
        // const newSettings: Partial<Settings> = {};
        // if (e.currentTarget.type === "checkbox") {
        //     newSettings[e.currentTarget.name] = e.currentTarget.checked;
        // } else {
        //     newSettings[e.currentTarget.name] = e.currentTarget.value;
        // }

        // console.log("New: ", newSettings);
        // props.setSettings(newSettings);
    }

    return (
        <Container>
            <FormGroup>
                <FormControlLabel control={<Switch name="spellcheck" checked={props.settings.spellcheck} onChange={updateSettings} />} label="Spellcheck" />
                <FormControlLabel control={<Switch name="darkMode" checked={props.settings.darkMode} onChange={updateSettings} />} label="Dark Mode" />
                <TextField name="fontSize" type="number" label="Font Size" value={props.settings.fontSize} onChange={updateSettings} />
            </FormGroup>
        </Container>
    );
}
