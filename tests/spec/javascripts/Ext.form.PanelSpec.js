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

    it("should add all format properties to all datefield configs, which are created for an form panel", function() {
        // prepare
        model('MyTest.model.FormConfigDateFieldTest');

        // check that all default values are added, as well as name and label
        var config = Ext.create('Bancha.scaffold.form.Config', {
            target: 'MyTest.model.FormConfigDateFieldTest'
        });
        var field = Ext.create('Ext.data.Field', {
            type: 'date',
            name: 'someName',
            dateFormat: 'Y-m-d H:i:s'
        });
        expect(panel.buildFieldConfig(field, config)).toEqual({
            xtype : 'datefield',
            fieldLabel: 'Some name',
            name: 'someName',
            format: 'Y-m-d H:i:s'
        });
    });

    it("should allow the user to change the datefield format and only enforce read and write formats", function() {
        // prepare
        model('MyTest.model.FormConfigDateFieldTest2');

        // check that all default values are added, as well as name and label
        var config = Ext.create('Bancha.scaffold.form.Config', {
            target: 'MyTest.model.FormConfigDateFieldTest',
            datefieldDefaults: {
                format: 'd.m.Y'
            }
        });
        var field = Ext.create('Ext.data.Field', {
            type: 'date',
            name: 'someName',
            dateFormat: 'Y-m-d H:i:s'
        });
        expect(panel.buildFieldConfig(field, config)).toEqual({
            xtype : 'datefield',
            fieldLabel: 'Some name',
            name: 'someName',
            format: 'd.m.Y',
            altFormats: 'm/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j|Y-m-d H:i:s',
            submitFormat: 'Y-m-d H:i:s'
        });
    });

    // some form-sepcific helper functions
    var defaultConfig = Bancha.scaffold.form.Config.prototype,
        getButtonConfig = function(id) {
        return [{
            iconCls: 'icon-reset',
            text: 'Reset',
            scope: panel.buildButtonScope(id),
            handler: defaultConfig.onReset
        }, {
            iconCls: 'icon-save',
            text: 'Save',
            formBind: true,
            scope: panel.buildButtonScope(id),
            handler: defaultConfig.onSave
        }];
    };

    var getSimpleFormExpectation = function(modelName,config) {
        return Ext.apply({
            id: modelName+'-id', // forced
            // configs for BasicForm
            api: {
                // The server-side method to call for load() requests
                load: BanchaScaffoldSpecHelper.sampleModelData.proxy.api.read
            },
            paramOrder : [ 'data' ],
            items: [{
                xtype: 'hiddenfield',
                allowDecimals : false,
                name: 'id',
                fieldLabel: 'Id',
                decimalPrecision: 0
            },{
                xtype: 'textfield',
                name: 'name',
                fieldLabel: 'Name',
                allowBlank: false,
                minLength: 2,
                maxLength: 64
            },{
                xtype: 'textfield',
                name: 'login',
                fieldLabel: 'Login'
            },{
                xtype: 'datefield',
                name: 'created',
                fieldLabel: 'Created',
                format: 'Y-m-d H:i:s'
            },{
                xtype: 'textfield',
                name: 'email',
                fieldLabel: 'Email'
            }, {
                xtype: 'textfield', // an fileuploadfield is recognized through validation rules
                name: 'avatar',
                fieldLabel: 'Avatar'
            }, {
                xtype: 'numberfield',
                name: 'weight',
                fieldLabel: 'Weight'
            }, {
                xtype: 'numberfield',
                allowDecimals : false,
                name: 'height',
                fieldLabel: 'Height'
            }],
            buttons: getButtonConfig(modelName+'-id')
        },config);
    }; // eo getSimpleFormExpected

    it("should build a form config, where it recognizes the type from the field type, when no "+
        "validation rules are set in the model (component test)", function() {
        // prepare
        model('MyTest.model.FormConfigTest');
try {
        var config = Ext.create('Bancha.scaffold.form.Config', {
            target: 'MyTest.model.FormConfigTest'
        });

        console.info('result:'+Ext.encode(panel.buildConfig(config, {
            id: 'MyTest.model.FormConfigTest-id'
        })));
        console.info('expected:'+Ext.encode(getSimpleFormExpectation('MyTest.model.FormConfigTest')));
        expect(panel.buildConfig(config, {
            id: 'MyTest.model.FormConfigTest-id'
        })).toEqualConfig(getSimpleFormExpectation('MyTest.model.FormConfigTest'));
    } catch(e) {
        console.error(e);
    }
    });

});
