import BusyDialog from "sap/m/BusyDialog";
import Controller from "sap/ui/core/mvc/Controller";
import Fragment from "sap/ui/core/Fragment";
import syncStyleClass from "sap/ui/core/syncStyleClass";
import View from "sap/ui/core/mvc/View";
import MessageBox from "sap/m/MessageBox";

/**
 * @namespace tp.example.controller
 */
export default class Checkout extends Controller {
    private pBusyDialog : Promise<BusyDialog> | null = null;
    private iTimeoutId : any;
    async onConfirmPurchase(): Promise<void> {
			// load BusyDialog fragment asynchronously
			if (!this.pBusyDialog) {
				this.pBusyDialog = Fragment.load({
					name: "tp.example.view.BusyDialog",
					controller: this
				}).then((pBusyDialog) => {
                    const dialog = pBusyDialog as BusyDialog;
					this.getView()?.addDependent(dialog);
					syncStyleClass("sapUiSizeCompact", this.getView() as View, dialog);
					return dialog;
				});
			}

            const dialog = await this.pBusyDialog;
            dialog.attachClose(() => {MessageBox.success("Payment processed successfully!")});
            dialog.open();
            setTimeout(async () => (await this.pBusyDialog)?.close(), 2000);
       
    }

}