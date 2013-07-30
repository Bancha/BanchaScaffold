/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2012 Roland Schuetz
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * Ext.grid.Panel extension tests
 *
 * @package       Bancha.scaffold.Test
 * @copyright     Copyright 2011-2012 Roland Schuetz
 * @link          http://scaffold.banchaproject.org
 * @since         Bancha.scaffold 0.5.0
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha v PRECOMPILER_ADD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.banchaproject.org
 */
/*jslint browser: true, vars: true, undef: true, nomen: true, eqeq: false, plusplus: true, bitwise: true, regexp: true, newcap: true, sloppy: true, white: true */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:true, regexp:true, undef:true, trailing:false */
/*global Ext, Bancha, describe, it, beforeEach, expect, jasmine, Mock, BanchaScaffoldSpecHelper */

describe("Ext.grid.Panel scaffold extension tests",function() {
    var model = BanchaScaffoldSpecHelper.getSampleModel, //shortcut
        gridScaf = Bancha.scaffold.Grid; //shortcut
	
    beforeEach(function() {
        gridScaf.storeDefaults = {autoLoad: false}; // don't load anything on tests
    });

	it("should augment the class Ext.grid.Panel and use simple scaffold:modelname", function() {
        // prepare
        model('MyTest.model.GridPanelExtensionModelNameTestModel');
        
		var panel = Ext.create("Ext.grid.Panel", {
			scaffold: 'MyTest.model.GridPanelExtensionModelNameTestModel'
		});
		
        // since this function is using #buildConfig,
        // just test that it is applied
        
		expect(panel).property('columns.length').toEqual(9); // 8 columns + destroy column
	});

	it("should augment the class Ext.grid.Panel and use simple scaffold:modelClass", function() {
        // prepare
        model('MyTest.model.GridPanelExtensionModelClassTestModel');
        
		var panel = Ext.create("Ext.grid.Panel", {
			scaffold: Ext.ModelManager.getModel('MyTest.model.GridPanelExtensionModelClassTestModel')
		});
		
        // since this function is using #buildConfig,
        // just test that it is applied
        
		expect(panel).property('columns.length').toEqual(9); // 8 columns + destroy column
	});
	
	it("should augment the class Ext.grid.Panel and use scaffold config object", function() {
        model('MyTest.model.GridPanelExtensionConfigObjectTestModel');
		
		var onSave = function() {};
		var panel = Ext.create("Ext.grid.Panel", {
			scaffold: {
				target: 'MyTest.model.GridPanelExtensionConfigObjectTestModel',
				onSave: onSave,
				deletable: false
			}
		});
		
		// check if the grid really got scaffolded without a delete button
		expect(panel.columns.length).toEqual(8);

		// expect a header component and a footer toolbar
		expect(panel.getDockedItems().length).toEqual(2);

		// get the toolbar
		var toolbar;
		// Prior to Ext JS 4.1 this is the second element, later it's the first docked item, normalize
		if(panel.getDockedItems()[0].xtype === 'headercontainer') {
			// In Ext JS 4.1+ the toolbar is the first element
			toolbar = panel.getDockedItems()[1];
		} else {
			// In Ext JS prior this is the first one
			toolbar = panel.getDockedItems()[0];
			expect(panel.getDockedItems()[1].xtype).toEqual('headercontainer');
		}

		// check that the first (custom) element is your toolbar
		expect(toolbar).property('dock').toEqual('bottom');

		// check that the create, save and reset buttons are created (plus one filler)
		expect(toolbar).property('items.items.length').toEqual(4);

		// check that the onSave function is used
		expect(toolbar).property('items.items.3.handler').toEqual(onSave);
	});

    it('This just reset configs, since jasmin doesn\' provide a after suite function', function() {
        gridScaf.storeDefaults = {autoLoad: true}; // reset defaults
    });

}); //eo scaffold grid functions

//eof
