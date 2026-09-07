import UIComponent from "sap/ui/core/UIComponent";
/**
 * @namespace tp.example
 */
export default class Component extends UIComponent {
	public static metadata = {
		"interfaces": ["sap.ui.core.IAsyncContentCreation"],
		"manifest": "json" 
	};
	
	init(): void {
		super.init();
		console.log("Component");
	};

};