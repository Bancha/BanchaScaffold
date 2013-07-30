/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2013 codeQ e.U.
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * Bancha.scaffold.Form Tests
 *
 * @package       Bancha.scaffold.Test
 * @copyright     Copyright 2011-2013 codeQ e.U.
 * @link          http://scaffold.banchaproject.org
 * @since         Bancha.scaffold 0.5.0
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha v PRECOMPILER_ADD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.banchaproject.org
 */

describe("Bancha.scaffold.Form tests",function() {
    var model = BanchaScaffoldSpecHelper.getSampleModel, //shortcut
        formScaf = Bancha.scaffold.Form, //shortcut
        // take the defaults
        // (actually this is also copying all the function references, but it doesn't matter)
        originalFormScaf = Ext.clone(formScaf),
        testDefaults = Ext.clone(formScaf);
    
    beforeEach(function() {
        // re-enforce defaults
        Ext.apply(formScaf, testDefaults);
    });
    
    it("should build field configs while considering the defined config", function() {
        // build a config
        var config = Ext.clone(testDefaults);
        Ext.apply(config, {
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
        var model =  {}; // model is only used for associations
        expect(formScaf.buildFieldConfig(field, model, config)).toEqual({
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
        expect(formScaf.buildFieldConfig(field, model, config)).toEqual({
            forAllFields: 'added',
            xtype : 'datefield',
            fieldLabel: 'Some name',
            name: 'someName'
        });
    });
    
    it("should add an format property to all datefield configs, which are created for an form panel", function() {
        // check that all default vallues are added, as well as name and label
        var field = Ext.create('Ext.data.Field', {
            type: 'date',
            name: 'someName',
            dateFormat: 'Y-m-d H:i:s'
        });
        var model =  {}; // model is only used for associations
        expect(formScaf.buildFieldConfig(field, model, Ext.clone(testDefaults))).toEqual({
            xtype : 'datefield',
            fieldLabel: 'Some name',
            name: 'someName',
            format: 'Y-m-d H:i:s'
        });
    });

    // some form-sepcific helper functions
    var getButtonConfig = function(id) {
        return [{
            iconCls: 'icon-reset',
            text: 'Reset',
            scope: formScaf.buildButtonScope(id),
            handler: formScaf.onReset
        }, {
            iconCls: 'icon-save',
            text: 'Save',
            formBind: true,
            scope: formScaf.buildButtonScope(id),
            handler: formScaf.onSave
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
                fieldLabel: 'Id'
            },{
                xtype: 'textfield',
                name: 'name',
                fieldLabel: 'Name'
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

        expect(formScaf.buildConfig('x', {
            target: 'MyTest.model.FormConfigTest'
        }, {
            id: 'MyTest.model.FormConfigTest-id'
        })).toEqualConfig(getSimpleFormExpectation('MyTest.model.FormConfigTest'));
    });


    it("should consider the exclude property to exclude specific fields from the scaffolding", function() {
        // prepare
        model('MyTest.model.FormConfigExcludeTest');

        expect(formScaf.buildConfig('x', {
            target: 'MyTest.model.FormConfigExcludeTest',
            exclude: ['created','avatar']
        }, {
            id: 'MyTest.model.FormConfigTest-id'
        })).property('items.length').toEqual(6);
    });


    it("should clone all configs, so that you can create multiple forms from the same defaults "+
        "(component test)", function() {
        // prepare
        model('MyTest.model.FormConfigTwoTimesTest');
        
        // first
        expect(formScaf.buildConfig('x', {
            target: 'MyTest.model.FormConfigTwoTimesTest'
        }, {
            id: 'MyTest.model.FormConfigTwoTimesTest-id'
        })).toEqualConfig(getSimpleFormExpectation('MyTest.model.FormConfigTwoTimesTest'));
        
        // second
        expect(formScaf.buildConfig('x', {
            target: 'MyTest.model.FormConfigTwoTimesTest'
        }, {
            id: 'MyTest.model.FormConfigTwoTimesTest-id'
        })).toEqualConfig(getSimpleFormExpectation('MyTest.model.FormConfigTwoTimesTest'));
    });
    
    it("should build a form config, where it recognizes the type from the field type, when no "+
       "validation rules are set in the model (component test)", function() {
        // prepare
        model('MyTest.model.FormConfigWithValidationTest',{
            validations: [
                {type:'presence', name:'id'},
                {type:'presence', name:'name'},
                {type:'length', name:'name', min:3, max:64},
                {type:'presence', name:'login'},
                {type:'length', name:'login', min:3, max:64},
                {type:'format', name:'login', matcher: /^[a-zA-Z0-9_]+$/},
                {type:'presence', name:'email'},
                {type:'format', name:'email', matcher: 
                                    /^(\w+)([\-+.][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/},
                {type:'numberformat', name:'weight', precision:2},
                {type:'numberformat', name:'height', min:50, max:300},
                {type:'file', name:'avatar', extension:['gif', 'jpeg', 'png', 'jpg']}
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
        
        expect(formScaf.buildConfig('x', {
            target: 'MyTest.model.FormConfigWithValidationTest',
            fileuploadfieldDefaults: {
                emptyText: 'Select an image',
                buttonText: '',
                buttonConfig: {
                    iconCls: 'icon-upload'
                }
            }
        }, {
            id: 'MyTest.model.FormConfigWithValidationTest-id'
        })).toEqualConfig(expected);
        
        
        expect(formScaf.buildConfig('x', {
            target: 'MyTest.model.FormConfigWithValidationTest'
        }, {
            id: 'MyTest.model.FormConfigWithValidationTest-id'
        }).buttons[0].handler).toEqualConfig(expected.buttons[0].handler);
    });
    
    
    it("should use class interceptors when building a config (component test)", function() {
        // prepare
        model('MyTest.model.FormConfigWithClassInterceptorsTest');
        
        // the same when defining them on the class
        Ext.apply(formScaf,{
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
        var result = formScaf.buildConfig('x', {
            target: 'MyTest.model.FormConfigWithClassInterceptorsTest'
        });
        
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
        
        var result = formScaf.buildConfig('x', {
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
        
        // beforeBuild, afterBuild
        expect(result.interceptors).toEqual(['before','after']);
        
        // transformFieldConfig
        expect(result.items).toBeAnObject();
        Ext.each(result.items, function(item) {
            expect(item.isAugmented).toEqual(true);
        });
    });

    it('This just reset configs, since jasmin doesn\' provide a after suite function', function() {
        Ext.apply(formScaf, originalFormScaf);
    });
}); //eo scaffold form functions

//eof
