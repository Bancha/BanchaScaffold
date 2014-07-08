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

        var config = Ext.create('Bancha.scaffold.form.Config', {
            target: 'MyTest.model.FormConfigTest'
        });

        expect(panel.buildConfig(config, {
            id: 'MyTest.model.FormConfigTest-id'
        })).toEqualConfig(getSimpleFormExpectation('MyTest.model.FormConfigTest'));
    });


    it("should use only fields from the fields config (component test", function() {
        // prepare
        model('MyTest.model.FormConfigFieldsTest');

        var config = Ext.create('Bancha.scaffold.form.Config', {
            target: 'MyTest.model.FormConfigFieldsTest',
            fields: ['name', 'email', 'login']
        });

        // test
        var result = panel.buildConfig(config, {
            id: 'MyTest.model.FormConfigTest-id'
        });

        // check that not-defined fields got excluded
        expect(result).property('items.length').toEqual(3);

        // check that the order of the fields array was used
        expect(result).property('items.0.name').toEqual('name');
        expect(result).property('items.1.name').toEqual('email');
        expect(result).property('items.2.name').toEqual('login');
    });


    it("should consider the exclude property to exclude specific fields from the scaffolding", function() {
        // prepare
        model('MyTest.model.FormConfigExcludeTest');

        var config = Ext.create('Bancha.scaffold.form.Config', {
            target: 'MyTest.model.FormConfigExcludeTest',
            exclude: ['created','avatar']
        });

        expect(panel.buildConfig(config, {
            id: 'MyTest.model.FormConfigTest-id'
        })).property('items.length').toEqual(6);
    });


    it("should clone all configs, so that you can create multiple forms from the same defaults "+
        "(component test)", function() {
        // prepare
        model('MyTest.model.FormConfigTwoTimesTest');

        var config = Ext.create('Bancha.scaffold.form.Config', {
            target: 'MyTest.model.FormConfigTwoTimesTest'
        });

        // first
        expect(panel.buildConfig(config, {
            id: 'MyTest.model.FormConfigTwoTimesTest-id'
        })).toEqualConfig(getSimpleFormExpectation('MyTest.model.FormConfigTwoTimesTest'));

        // second
        expect(panel.buildConfig(config, {
            id: 'MyTest.model.FormConfigTwoTimesTest-id'
        })).toEqualConfig(getSimpleFormExpectation('MyTest.model.FormConfigTwoTimesTest'));
    });

    it("should build a form config, where it recognizes the type from the field type, when no "+
        "validation rules are set in the model (component test)", function() {
        // prepare
        model('MyTest.model.FormConfigWithValidationTest',{
            validations: [
                {type:'presence', field:'id'},
                {type:'presence', field:'name'},
                {type:'length', field:'name', min:3, max:64},
                {type:'presence', field:'login'},
                {type:'length', field:'login', min:3, max:64},
                {type:'format', field:'login', matcher: /^[a-zA-Z0-9_]+$/},
                {type:'presence', field:'email'},
                {type:'format', field:'email', matcher:
                                 /^(\w+)([\-+.][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/},
                {type:'range', field:'weight', precision:2},
                {type:'range', field:'height', min:50, max:300},
                {type:'file', field:'avatar', extension:['gif', 'jpeg', 'png', 'jpg']}
            ]
        });

        var expected = {
            // added from avatar validation rules
            isUpload: true,
            fileUpload: true,

            id: 'MyTest.model.FormConfigWithValidationTest-id', // forced
            // configs for BasicForm
            api: {
                load: BanchaScaffoldSpecHelper.sampleModelData.proxy.api.read
            },
            paramOrder : [ 'data' ],
            items: [{
                xtype: 'hiddenfield',
                allowDecimals: false,
                fieldLabel: 'Id',
                name: 'id',
                allowBlank:false
            },{
                xtype: 'textfield',
                fieldLabel: 'Name',
                name: 'name',
                allowBlank:false,
                minLength: 3,
                maxLength: 64
            },{
                xtype: 'textfield',
                fieldLabel: 'Login',
                name: 'login',
                allowBlank:false,
                minLength: 3,
                maxLength: 64,
                vtype: 'alphanum' // use toString to compare
            },{
                xtype: 'datefield',
                fieldLabel: 'Created',
                name: 'created',
                format: 'Y-m-d H:i:s'
            },{
                xtype: 'textfield',
                fieldLabel: 'Email',
                name: 'email',
                allowBlank: false,
                vtype: 'email'
            }, {
                xtype: 'fileuploadfield',
                fieldLabel: 'Avatar',
                name: 'avatar',
                emptyText: 'Select an image',
                buttonText: '',
                buttonConfig: {
                    iconCls: 'icon-upload'
                },
                vtype: 'fileExtension',
                validExtensions: ['gif', 'jpeg', 'png', 'jpg']
            }, {
                xtype: 'numberfield',
                fieldLabel: 'Weight',
                name: 'weight',
                decimalPrecision: 2
            }, {
                xtype: 'numberfield',
                allowDecimals: false,
                fieldLabel: 'Height',
                name: 'height',
                minValue: 50,
                maxValue: 300
            }],
            buttons: getButtonConfig('MyTest.model.FormConfigWithValidationTest-id')
        }; // eo expected

        var config = Ext.create('Bancha.scaffold.form.Config', {
            target: 'MyTest.model.FormConfigWithValidationTest',
            fileuploadfieldDefaults: {
                emptyText: 'Select an image',
                buttonText: '',
                buttonConfig: {
                    iconCls: 'icon-upload'
                }
            }
        });

        expect(panel.buildConfig(config, {
            id: 'MyTest.model.FormConfigWithValidationTest-id'
        })).toEqualConfig(expected);

        config = Ext.create('Bancha.scaffold.form.Config', {
            target: 'MyTest.model.FormConfigWithValidationTest'
        });

        expect(panel.buildConfig(config, {
            id: 'MyTest.model.FormConfigWithValidationTest-id'
        }).buttons[0].handler).toEqualConfig(expected.buttons[0].handler);
    });

    it("should use class interceptors when building a config (component test)", function() {
        // prepare
        model('MyTest.model.FormConfigWithClassInterceptorsTest');

        // the same when defining them on the class
        var config = Ext.create('Bancha.scaffold.form.Config', {
            target: 'MyTest.model.FormConfigWithClassInterceptorsTest',
            beforeBuild: function() {
                return {
                    interceptors: ['before'] // make sure that afterBuild only augemts
                };
            },
            afterBuild: function(config) {
                config.interceptors.push('after');
                return config;
            },
            transformFieldConfig: function(config) {
                config.isAugmented = true;
                return config;
            }
        });
        var result = panel.buildConfig(config);

        // beforeBuild, afterBuild
        expect(result.interceptors).toEqualConfig(['before','after']);

        // transformFieldConfig
        expect(result.items).toBeAnObject();
        Ext.each(result.items, function(item) {
            expect(item.isAugmented).toEqual(true);
        });
    });

    it("should use config interceptors when building a config (component test)", function() {
        // prepare
        model('MyTest.model.FormConfigWithConfigInterceptorsTest');

        var config = Ext.create('Bancha.scaffold.form.Config', {
            target: 'MyTest.model.FormConfigWithConfigInterceptorsTest',
            beforeBuild: function() {
                return {
                    interceptors: ['before'] // make sure that afterBuild only augemts
                };
            },
            afterBuild: function(config) {
                config.interceptors.push('after');
                return config;
            },
            transformFieldConfig: function(config) {
                config.isAugmented = true;
                return config;
            }
        });
        var result = panel.buildConfig(config);

        // beforeBuild, afterBuild
        expect(result.interceptors).toEqual(['before','after']);

         // transformFieldConfig
        expect(result.items).toBeAnObject();
        Ext.each(result.items, function(item) {
            expect(item.isAugmented).toEqual(true);
        });
    });
    
    it('Tear down function, since jasmin doesn\' provide a after suite function', function() {
        Bancha.scaffold.grid.Config.setDefault('buildApiConfig', defaultBuildApiConfig);
    });
});

describe("Ext.form.Panel scaffold extension tests",function() {
    var model = BanchaScaffoldSpecHelper.getSampleModel; //shortcut

    it("should augment the class Ext.form.Panel and use simple scaffold:modelname", function() {
        model('MyTest.model.FormPanelExtensionModelNameTestModel');

        var panel = Ext.create("Ext.form.Panel", {
            scaffold: 'MyTest.model.FormPanelExtensionModelNameTestModel'
        });

        // since this function is using #buildConfig,
        // just test that it is applied and no error was raised

        expect(panel).property('items.items.length').toEqual(8);
    });

    it("should augment the class Ext.form.Panel and use simple scaffold:modelClass", function() {
        model('MyTest.model.FormPanelExtensionModelClassTestModel');

        var panel = Ext.create("Ext.form.Panel", {
            scaffold: Ext.ClassManager.get('MyTest.model.FormPanelExtensionModelClassTestModel')
        });

        // since this function is using #buildConfig,
        // just test that it is applied and no error was raised

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

    it("should be cleanly subclassable", function() {
        // prepare
        model('MyTest.model.FormPanelSubclassingTestModel');

        Ext.define('Bancha.scaffold.test.FormPanel', {
            extend: 'Ext.form.Panel',
            scaffold: 'MyTest.model.FormPanelSubclassingTestModel'
        });

        // try subclassing
        var panel = Ext.create('Bancha.scaffold.test.FormPanel', {});

        // since this function is using #buildConfig,
        // just test that it is applied and no error was raised

        expect(panel).property('items.items.length').toEqual(8);
    });
});
