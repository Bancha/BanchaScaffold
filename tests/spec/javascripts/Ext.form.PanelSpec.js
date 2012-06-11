/*!
 * Bancha.scaffold.Form Tests
 * Copyright(c) 2011-2012 Roland Schuetz
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @copyright (c) 2011-2012 Roland Schuetz
 */
/*jslint browser: true, vars: true, plusplus: true, white: true, sloppy: true */
/*global Ext, Bancha, describe, it, beforeEach, expect, jasmine, Mock, BanchaSpecHelper */

describe("Ext.form.Panel scaffold extension tests",function() {
    var model = BanchaScaffoldSpecHelper.getSampleModel, //shortcut
        formScaf = Bancha.scaffold.Form; //shortcut
    
    it("should help when creating a new scaffold panel", function() {
        // prepare
        model('MyTest.model.FormPanelTest');
        
        // since this function is using #buildConfig,
        // just test that it is applied

        expect(Ext.create('Ext.form.Panel', {
            scaffold: 'MyTest.model.FormPanelTest'
        })).property('items.items.length').toEqual(8);
    });
    
    it("should augment the class Ext.form.Panel and use simple scaffold:modelname", function() {
        model('MyTest.model.FormPanelExtensionTestUser');

        var panel = Ext.create("Ext.form.Panel", {
            scaffold: 'MyTest.model.FormPanelExtensionTestUser'
        });
        
        // check if the form really got scaffolded
        expect(panel.items.items.length).toEqual(8);
    });
    
    it("should augment the class Ext.form.Panel and use scaffold config object", function() {
        model('MyTest.model.FormPanelExtensionConfigObjectTestUser');
        
        var onSave = function() {};
        var panel = Ext.create("Ext.form.Panel", {
            enableReset: true,
            scaffoldLoadRecord: 3,
            scaffold: {
                target: 'MyTest.model.FormPanelExtensionConfigObjectTestUser',
                onSave: onSave
            }
        });
        
        Ext.panelD = panel;
        // check if the model got used
        expect(panel.items.items.length).toEqual(8);
        
        // check if the record id got used
        expect(panel.scaffold.recordId).toEqual(3);
        
        // check that the reset button is created
        expect(panel.getDockedItems()[0].items.items.length).toEqual(2);
        
        // check that the onSave function is used
        expect(panel.getDockedItems()[0].items.items[1].handler).toEqual(onSave);
    });

}); //eo scaffold form functions

//eof
