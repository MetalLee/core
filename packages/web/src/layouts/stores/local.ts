/* eslint-disable indent */
import { openDB, IDBPDatabase } from "idb";
import { dbName, dbVersion, autoLayoutName } from "../constants";
import { LayoutsDB } from "../types";
import { Glue42Web } from "../../../web";

export class LocalStore {

    private _database: IDBPDatabase<LayoutsDB> | undefined;

    constructor() {
        if (!("indexedDB" in window)) {
            throw new Error("Cannot initialize the local storage, because IndexedDb is not supported");
        }
    }

    private get database(): Promise<IDBPDatabase<LayoutsDB>> {
        if (this._database) {
            return Promise.resolve(this._database);
        }

        return new Promise((resolve) => {

            openDB<LayoutsDB>(dbName, dbVersion, { upgrade: this.setUpDb.bind(this) })
                .then((database) => {
                    this._database = database;
                    resolve(this._database); 
                });
        });
    }

    public async getAll(layoutType: Glue42Web.Layouts.LayoutType): Promise<Glue42Web.Layouts.Layout[]> {
        switch (layoutType) {
            case "Workspace": return (await this.database).getAll("workspaceLayouts");
            case "Global": return (await this.database).getAll("globalLayouts");
            default: throw new Error(`The provided layout type is not recognized: ${layoutType}`);
        }
    }

    public async delete(name: string, layoutType: Glue42Web.Layouts.LayoutType): Promise<void> {
        switch (layoutType) {
            case "Workspace": return (await this.database).delete("workspaceLayouts", name);
            case "Global": return (await this.database).delete("globalLayouts", name);
            default: throw new Error(`The provided layout type is not recognized: ${layoutType}`);
        }
    }

    public async getAutoLayout(): Promise<Glue42Web.Layouts.Layout | undefined> {
        return (await this.database).get("autoLayouts", autoLayoutName);
    }

    public async storeAutoLayout(layout: Glue42Web.Layouts.Layout): Promise<string> {
        // todo validate
        return (await this.database).put("autoLayouts", layout, autoLayoutName);
    }

    public async get(name: string, layoutType: Glue42Web.Layouts.LayoutType): Promise<Glue42Web.Layouts.Layout | undefined> {
        switch (layoutType) {
            case "Workspace": return (await this.database).get("workspaceLayouts", name);
            case "Global": return (await this.database).get("globalLayouts", name);
            default: throw new Error(`The provided layout type is not recognized: ${layoutType}`);
        }
    }

    public async store(layout: Glue42Web.Layouts.Layout, layoutType: Glue42Web.Layouts.LayoutType): Promise<string> {
        // todo validate
        switch (layoutType) {
            case "Workspace": return (await this.database).put("workspaceLayouts", layout, layout.name);
            case "Global": return (await this.database).put("globalLayouts", layout, layout.name);
            default: throw new Error(`The provided layout type is not recognized: ${layoutType}`);
        }
    }

    private setUpDb(database: IDBPDatabase<LayoutsDB>): void {
        if (!database.objectStoreNames.contains("workspaceLayouts")) {
            database.createObjectStore("workspaceLayouts", { keyPath: "name" });
        }

        if (!database.objectStoreNames.contains("autoLayouts")) {
            database.createObjectStore("autoLayouts", { keyPath: "name" });
        }

        if (!database.objectStoreNames.contains("globalLayouts")) {
            database.createObjectStore("globalLayouts", { keyPath: "name" });
        }
    }

}