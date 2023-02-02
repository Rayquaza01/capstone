// export function isCategoryStructure(obj: any) {
//     return Object.prototype.hasOwnProperty.call(obj, "name") &&
//         Object.prototype.hasOwnProperty.call(obj, "items") &&
//         (typeof obj.items === "string" || isCategoryStructure(obj.items));
// }

export interface CategoryStructure {
    name: string
    folders: CategoryStructure[]
    items: string[]
}

export interface NoteStructure {
    notebook: string
    categories: CategoryStructure[]
}
