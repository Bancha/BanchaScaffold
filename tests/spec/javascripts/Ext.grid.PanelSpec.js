/*!
 * Bancha.scaffold.Form Tests
 * Copyright(c) 2011-2012 Roland Schuetz
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @copyright (c) 2011-2012 Roland Schuetz
 */
/*jslint browser: true, vars: true, plusplus: true, white: true, sloppy: true */
/*global Ext, Bancha, describe, it, beforeEach, expect, jasmine, Mock, BanchaSpecHelper */

describe("Ext.grid.Panel scaffold extension tests",function() {
    var model = BanchaScaffoldSpecHelper.getSampleModel, //shortcut
        gridScaf = Bancha.scaffold.Grid; //shortcut
    
    it("should help when creating a new scaffold panel", function() {
        // prepare
        model('MyTest.model.GridPanelTest');
        
        // since this function is using #buildConfig,
        // just test that it is applied

        expect(Ext.create('Ext.grid.Panel', {
            scaffold: 'MyTest.model.GridPanelTest'
        })).property('columns.length').toEqual(8);
    });
	
	it("should augment the class Ext.grid.Panel and use simple scaffold:modelname", function() {
        model('MyTest.model.GridPanelExtensionTestUser');

		var panel = Ext.create("Ext.grid.Panel", {
			scaffold: 'MyTest.model.GridPanelExtensionTestUser'
		});
		
		// check if the grid really got scaffolded
		expect(panel.columns.length).toEqual(8);
	});
	
	it("should augment the class Ext.grid.Panel and use scaffold config object", function() {
        model('MyTest.model.GridPanelExtensionConfigObjectTestUser');
		
		var onSave = function() {};
		var panel = Ext.create("Ext.grid.Panel", {
            enableCreate : true,
            enableUpdate : true,
            enableReset  : true,
            enableDestroy: true,
			scaffold: {
				target: 'MyTest.model.GridPanelExtensionConfigObjectTestUser',
				onSave: onSave
			}
		});
		
		// check if the grid really got scaffolded including a delete button
		expect(panel.columns.length).toEqual(9);
		
		// check that the create, save and reset buttons are created (plus one filler)
		expect(panel.getDockedItems()[0].items.items.length).toEqual(4);
		
		// check that the onSave function is used
		expect(panel.getDockedItems()[0].items.items[3].handler).toEqual(onSave);
	});

}); //eo scaffold grid functions

//eof
