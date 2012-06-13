/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2012 Roland Schuetz
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * Bancha.scaffold.Form Tests
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


describe("Bancha.scaffold.Form tests",function() {
    var model = BanchaScaffoldSpecHelper.getSampleModel, //shortcut
        formScaf = Bancha.scaffold.Form, //shortcut
        // take the defaults
        // (actually this is also copying all the function references, but it doesn't matter)
        testDefaults = Ext.clone(formScaf);
    
    beforeEach(function() {
        // re-enforce defaults
        Ext.apply(formScaf, testDefaults);
    });
    
    it("should build field configs while considering the defined defaults", function() {
        // define some defaults
        formScaf.fieldDefaults = {
            forAllFields: 'added'
        };
        formScaf.textfieldDefaults = {
            justForText: true
        };
        formScaf.datefieldDefaults = {};
        
        expect(formScaf.buildFieldConfig('string','someName')).toEqual({
            forAllFields: 'added',
            justForText: true,
            xtype : 'textfield',
            fieldLabel: 'Some name',
            name: 'someName'
        });
        
        // now there should be just added the first one
        expect(formScaf.buildFieldConfig('date','someName')).toEqual({
            forAllFields: 'added',
            xtype : 'datefield',
            fieldLabel: 'Some name',
            name: 'someName'
        });
    });
    
    it("should build field configs while considering special defaults per call", function() {
        formScaf.fieldDefaults = {
            forAllFields: 'added'
        };
        formScaf.textfieldDefaults = {
            justForText: true
        };
        var defaults = {
            textfieldDefaults: {
                justForThisTextBuild: true
            }
        };
        
        expect(formScaf.buildFieldConfig('string','someName',defaults)).toEqual({
            forAllFields: 'added',
            justForThisTextBuild: true, // <-- old defaults got overrided
            xtype : 'textfield',
            fieldLabel: 'Some name',
            name: 'someName'
        });

        // now there should be just added the first one
        expect(formScaf.buildFieldConfig('date','someName'),defaults).toEqual({
            forAllFields: 'added',
            xtype : 'datefield',
            fieldLabel: 'Some name',
            name: 'someName'
        });
    });
    
    // some form-spcific helper functions
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
    
    var getSimpleFormExpected = function(modelName,config) {
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
                fieldLabel: 'Created'
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

        expect(formScaf.buildConfig('MyTest.model.FormConfigTest',false,false,{
            id: 'MyTest.model.FormConfigTest-id'
        })).toEqualConfig(getSimpleFormExpected('MyTest.model.FormConfigTest'));
    });
    
    it("should clone all configs, so that you can create multiple forms from the same defaults "+
        "(component test)", function() {
        // prepare
        model('MyTest.model.FormConfigTwoTimesTest');
        
        // first
        expect(formScaf.buildConfig('MyTest.model.FormConfigTwoTimesTest',false,false,{
            id: 'MyTest.model.FormConfigTwoTimesTest-id'
        })).toEqualConfig(getSimpleFormExpected('MyTest.model.FormConfigTwoTimesTest'));
        
        // second
        expect(formScaf.buildConfig('MyTest.model.FormConfigTwoTimesTest',false,false,{
            id: 'MyTest.model.FormConfigTwoTimesTest-id'
        })).toEqualConfig(getSimpleFormExpected('MyTest.model.FormConfigTwoTimesTest'));
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
                name: 'created'
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
        
        expect(formScaf.buildConfig('MyTest.model.FormConfigWithValidationTest',false,{
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
        
        
        expect(formScaf.buildConfig('MyTest.model.FormConfigWithValidationTest',false,false,{
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
            guessFieldConfigs: function(config) {
                config.isAugmented = true;
                return config;
            }
        });
        var result = formScaf.buildConfig('MyTest.model.FormConfigWithClassInterceptorsTest');
        
        // beforeBuild, afterBuild
        expect(result.interceptors).toEqualConfig(['before','after']);
        
        // guessFieldConfg
        expect(result.items).toBeAnObject();
        Ext.each(result.items, function(item) {
            expect(item.isAugmented).toEqual(true);
        });
    });
    
    
    it("should use config interceptors when building a config (component test)", function() {
        // prepare
        model('MyTest.model.FormConfigWithConfigInterceptorsTest');
        
        var result = formScaf.buildConfig('MyTest.model.FormConfigWithConfigInterceptorsTest',false,{
            beforeBuild: function() {
                return {
                    interceptors: ['before'] // make sure that afterBuild only augemts
                };
            },
            afterBuild: function(config) {
                config.interceptors.push('after');
                return config;
            },
            guessFieldConfigs: function(config) {
                config.isAugmented = true;
                return config;
            }
        });
        
        // beforeBuild, afterBuild
        expect(result.interceptors).toEqual(['before','after']);
        
        // guessFieldConfg
        expect(result.items).toBeAnObject();
        Ext.each(result.items, function(item) {
            expect(item.isAugmented).toEqual(true);
        });
    });

}); //eo scaffold form functions

//eof
