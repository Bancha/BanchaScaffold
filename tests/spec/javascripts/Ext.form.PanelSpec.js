/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2014 codeQ e.U.
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * Ext.form.Panel extension tests
 *
 * @package       Bancha.scaffold.tests
 * @copyright     Copyright 2011-2014 codeQ e.U.
 * @link          http://scaffold.bancha.io
 * @since         Bancha Scaffold v 0.5.0
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha Scaffold v PRECOMPILER_ADD_BANCHA_SCAFFOLD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.bancha.io
 */

describe("Ext.form.Panel unit tests",function() {
    var model = BanchaScaffoldSpecHelper.getSampleModel, //shortcut
        panel = Ext.form.Panel,
        defaultBuildApiConfig = Bancha.scaffold.form.Config.prototype.buildApiConfig,
        testBuildApiConfig = function(model) {
            // same logic as in real function, but without a console warning
            var proxy = model.getProxy(),
                load = proxy && proxy.api && proxy.api.read ? proxy.api.read :
                        (proxy && proxy.directFn ? proxy.directFn : undefined);

            return load ? {load: load} : undefined;
        };

    beforeEach(function() {
        // set a different api builder to not clutter the console with warnings
        Bancha.scaffold.form.Config.setDefault('buildApiConfig', testBuildApiConfig);
    });

    it("should build field configs while considering the defined config", function() {
        // prepare
        model('MyTest.model.FormConfigSimpleTest');
        
        // build a test config
        var config = Ext.create('Bancha.scaffold.form.Config', {
            target: 'MyTest.model.FormConfigSimpleTest',
            fieldDefaults: {
                forAllFields: 'added'
            },
            textfieldDefaults: {
                justForText: true
            },
            datefieldDefaults: {}
        });

        // check that all default vallues are added, as well as name and label
        var field = Ext.create('Ext.data.Field', {
            type: 'string',
            name: 'someName'
        });
        expect(panel.buildFieldConfig(field, config)).toEqual({
            forAllFields: 'added',
            justForText: true,
            xtype : 'textfield',
            fieldLabel: 'Some name',
            name: 'someName'
        });

        // same for date field
        field = Ext.create('Ext.data.Field', {
            type: 'date',
            name: 'someName'
        });
        expect(panel.buildFieldConfig(field, config)).toEqual({
            forAllFields: 'added',
            xtype : 'datefield',
            fieldLabel: 'Some name',
            name: 'someName'
        });
    });

});
