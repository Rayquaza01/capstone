import React from "react"
import * as dexie from "dexie";
import * as dexieReactHooks from "dexie-react-hooks";
import ReactDOM from "react-dom/client";

const db = new dexie.Dexie("db");
db.version(1).stores({ note: "++id, content" });
db.note.bulkPut([
    { id: 1, content: "hello" },
    { id: 2, content: "world" },
    { id: 3, content: "goodbye" }
]);

//db.note.get(1).then(v => console.log(v));

function Textarea(id) {
    const note = dexieReactHooks.useLiveQuery(async () => {
        const n = await db.note.where({ id: id }).toArray();

        console.log(n);

        return n;
    }, [id]);

    //React.useEffect(() => {
    //  document.querySelector("textarea").value = note?.content ?? ""
    //}, [id]);

    function update() {
        db.note.update(id, document.querySelector("textarea").value);
    }

    return (<textarea onChange={update}>{note?.content ?? ""}</textarea>);
}

function App() {
    const [id, setID] = React.useState(1);
    console.log(id);

    function inc() {
        if (id + 1 > 3) {
            setID(1);
        } else {
            setID(id + 1);
        }
    }

    return (
        <div>
            <button onClick={inc}>Current Value: {id}</button>
            <Textarea id={id} />
        </div>
    )
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<App />);
