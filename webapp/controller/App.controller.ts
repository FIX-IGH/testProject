import Controller from "sap/ui/core/mvc/Controller";
import Dialog from "sap/m/Dialog";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import syncStyleClass from "sap/ui/core/syncStyleClass";
import Fragment from "sap/ui/core/Fragment";
import Button, { Button$PressEvent } from "sap/m/Button";

/**
 * @namespace tp.example.controller
 */

export default class App extends Controller {
    // private pDialog: Promise<Dialog> | null = null;
    onInit(): void | undefined {
        console.log("AppController");
    }

    /*
    public async onButtonPress(): Promise<void> {
        console.log("Test");
        const view = this.getView();
        if (!view) return;

        if (!this.pDialog) {
            this.pDialog = Fragment.load({
                id: view.getId(),
                name: "tp.example.fragment.SelectDialog",
                controller: this
            }).then((oDialog) => {
                const dialog = oDialog as Dialog;
                view.addDependent(dialog);
                return dialog;
            });
        }

        // Dialog anzeigen
        const dialog = await this.pDialog;
        dialog.open();
    }*/

    public onButtonPress(): void {
        console.log("Test")
    }

};
