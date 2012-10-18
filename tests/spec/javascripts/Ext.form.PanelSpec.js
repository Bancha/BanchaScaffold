/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2012 Roland Schuetz
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * Ext.form.Panel extension tests
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

describe("Ext.form.Panel scaffold extension tests",function() {
    var model = BanchaScaffoldSpecHelper.getSampleModel, //shortcut
        formScaf = Bancha.scaffold.Form; //shortcut
    
    it("should augment the class Ext.form.Panel and use simple scaffold:modelname", function() {
        model('MyTest.model.FormPanelExtensionModelNameTestModel');

        var panel = Ext.create("Ext.form.Panel", {
            scaffold: 'MyTest.model.FormPanelExtensionModelNameTestModel'
        });
        
        // since this function is using #buildConfig,
        // just test that it is applied

        expect(panel).property('items.items.length').toEqual(8);
    });

    it("should augment the class Ext.form.Panel and use simple scaffold:modelClass", function() {
        model('MyTest.model.FormPanelExtensionModelClassTestModel');

        var panel = Ext.create("Ext.form.Panel", {
            scaffold: Ext.ModelManager.getModel('MyTest.model.FormPanelExtensionModelClassTestModel')
        });
        
        // since this function is using #buildConfig,
        // just test that it is applied

        expect(panel).property('items.items.length').toEqual(8);
    });
    
    it("should augment the class Ext.form.Panel and use the scaffold config object", function() {
        model('MyTest.model.FormPanelExtensionConfigObjectTestModel');
        
        var onSave = function() {};
        var panel = Ext.create("Ext.form.Panel", {
            scaffold: {
                target: 'MyTest.model.FormPanelExtensionConfigObjectTestModel',
                onSave: onSave,
                buttons: ['reset','->','save']
            }
        });
        
        // check if the model got used
        expect(panel).property('items.items.length').toEqual(8);
        
        // check that the buttons got correctly applied
        expect(panel.getDockedItems()[0]).property('items.items.length').toEqual(3);
        expect(panel.getDockedItems()[0]).property('items.items.0.iconCls').toEqual('icon-reset');
        
        // check that the onSave function is used
        expect(panel.getDockedItems()[0].items.items[2].handler).toEqual(onSave);
    });

}); //eo scaffold form functions

//eof
