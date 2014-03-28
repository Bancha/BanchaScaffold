/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2014 codeQ e.U.
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * Ext.grid.Panel extension tests
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

describe("Ext.grid.Panel unit tests",function() {
    var model = BanchaScaffoldSpecHelper.getSampleModel, //shortcut
        panel = Ext.grid.Panel,
        defaults, testDefaults;

    //default values, used for tear down
    defaults = {
        editable: true,
        deletable: true,
        buttons: ['->','create','reset','save'],
        storeDefaults: {
            autoLoad: true
        }
    };
    // force easiert defaults for unit testing
    testDefaults = {
        editable: false,
        deletable: false,
        buttons: [],
        storeDefaults: {
            autoLoad: false // since we only want to unit-test and not load data
        }
    };
    beforeEach(function() {
        // re-enforce defaults
        Bancha.scaffold.grid.Config.setDefaults(testDefaults);
    });


    it("should build column configs while considering the defined config", function() {
        // prepare
        model('MyTest.model.GridConfigSimpleTest');

        // build a config
        var config = Ext.create('Bancha.scaffold.grid.Config', {
            target: 'MyTest.model.GridConfigSimpleTest',
            columnDefaults: {
                forAllFields: 'added'
            },
            gridcolumnDefaults: {
                justForText: true
            },
            datecolumnDefaults: {}
        });
        var field = Ext.create('Ext.data.Field', {
            type: 'string',
            name: 'someName'
        });

        expect(panel.buildColumnConfig(field, config)).toEqual({
            forAllFields: 'added',
            justForText: true,
            xtype : 'gridcolumn',
            text: 'Some name',
            dataIndex: 'someName'
        });

        // now there should be just added the first one
        field = Ext.create('Ext.data.Field', {
            type: 'date',
            name: 'someName'
        });
        expect(panel.buildColumnConfig(field, config)).toEqual({
            forAllFields: 'added',
            xtype : 'datecolumn',
            text: 'Some name',
            dataIndex: 'someName'
        });
    });

    // expected columns
    var expectedColumns = [{
        flex     : 1,
        xtype    : 'numbercolumn',
        format   : '0',
        text     : 'Id',
        dataIndex: 'id',
        hidden   : true
    }, {
        flex     : 1,
        xtype   : 'gridcolumn',
        text     : 'Name',
        dataIndex: 'name'
    }, {
        flex     : 1,
        xtype    : 'gridcolumn',
        text     : 'Login',
        dataIndex: 'login'
    }, {
        flex     : 1,
        xtype    : 'datecolumn',
        text     : 'Created',
        dataIndex: 'created'
    }, {
        flex     : 1,
        xtype    : 'gridcolumn',
        text     : 'Email',
        dataIndex: 'email'
    }, {
        flex     : 1,
        xtype    : 'gridcolumn',
        text     : 'Avatar',
        dataIndex: 'avatar'
    }, {
        flex     : 1,
        xtype    : 'numbercolumn',
        text     : 'Weight',
        dataIndex: 'weight'
    }, {
        flex     : 1,
        xtype    : 'numbercolumn',
        format   : '0',
        text     : 'Height',
        dataIndex: 'height'
    }];


    it("should build a grid column config with #buildColumns (component test)", function() {
        // prepare
        model('MyTest.model.GridColumnsConfigTest');

        var config = Ext.create('Bancha.scaffold.grid.Config', {
            target: 'MyTest.model.GridColumnsConfigTest'
        });

        // test
        var result = panel.buildColumns(config, {});

        // compare
        expect(result).toEqual(expectedColumns);
    });


    it("should use only fields from the fields config (component test)", function() {
        // prepare
        model('MyTest.model.GridColumnsConfigFieldsTest');

        var config = Ext.create('Bancha.scaffold.grid.Config', {
            target: 'MyTest.model.GridColumnsConfigFieldsTest',
            fields: ['name', 'email', 'login']
        });

        // test
        var result = panel.buildColumns(config, {});

        // check that not-defined fields got excluded
        expect(result.length).toEqual(3);

        // check that the order of the fields array was used
        expect(result).property('0.dataIndex').toEqual('name');
        expect(result).property('1.dataIndex').toEqual('email');
        expect(result).property('2.dataIndex').toEqual('login');
    });


    it("should exclude fields defined in the exclude property (component test)", function() {
        // prepare
        model('MyTest.model.GridColumnsConfigExcludeTest');

        var config = Ext.create('Bancha.scaffold.grid.Config', {
            target: 'MyTest.model.GridColumnsConfigExcludeTest',
            exclude: ['created','avatar']
        });

        // test
        var result = panel.buildColumns(config, {});

        // compare
        expect(result.length).toEqual(6);
    });


    it("should build a editable grid column config with #buildColumns with "+
        "delete icons (component test)", function() {
        // prepare
        model('MyTest.model.GridColumnsConfigWithUpdateDeleteTest');

        // expected columns
        var expectedColumnsWithUpdateDestroy = [{
            flex     : 1,
            xtype    : 'numbercolumn',
            format   : '0',
            text     : 'Id',
            dataIndex: 'id',
            editor   : undefined,
            hidden   : true
        }, {
            flex     : 1,
            xtype    : 'gridcolumn',
            text     : 'Name',
            dataIndex: 'name',
            editor   : {xtype:'textfield', name:'name', allowBlank: false, minLength: 2, maxLength: 64 }
        }, {
            flex     : 1,
            xtype    : 'gridcolumn',
            text     : 'Login',
            dataIndex: 'login',
            editor   : {xtype:'textfield', name:'login'}
        }, {
            flex     : 1,
            xtype    : 'datecolumn',
            text     : 'Created',
            dataIndex: 'created',
            editor   : {xtype:'datefield', name:'created'}
        }, {
            flex     : 1,
            xtype    : 'gridcolumn',
            text     : 'Email',
            dataIndex: 'email',
            editor   : {xtype:'textfield', name:'email'}
        }, {
            flex     : 1,
            xtype    : 'gridcolumn',
            text     : 'Avatar',
            dataIndex: 'avatar',
            editor   : {xtype:'textfield', name:'avatar'}
        }, {
            flex     : 1,
            xtype    : 'numbercolumn',
            text     : 'Weight',
            dataIndex: 'weight',
            editor   : {xtype:'numberfield', name:'weight'}
        }, {
            flex     : 1,
            xtype    : 'numbercolumn',
            format   : '0',
            text     : 'Height',
            dataIndex: 'height',
            editor   : {xtype:'numberfield', allowDecimals : false, name:'height'}
        }, {
            xtype: 'actioncolumn',
            width: 30,
            items: [{
                iconCls: 'icon-destroy',
                tooltip: 'Delete',
                handler: Bancha.scaffold.grid.Config.prototype.onDelete
            }]
        }];

        var config = Ext.create('Bancha.scaffold.grid.Config', {
            target: 'MyTest.model.GridColumnsConfigWithUpdateDeleteTest',
            editable  : true,
            deletable : true
        });

        // test
        var result = panel.buildColumns(config, {});

        // compare
        expect(result).toEqual(expectedColumnsWithUpdateDestroy);
    });


    it("should build a grid panel config with #buildConfig (component test)", function() {
        // prepare
        model('MyTest.model.GridConfigTest');

        var config = Ext.create('Bancha.scaffold.grid.Config', {
            target: 'MyTest.model.GridConfigTest'
        });

        // test
        var result = panel.buildConfig(config);

        // should have a store
        expect(result.store.getProxy().getModel()).toBeModelClass('MyTest.model.GridConfigTest');

        // just a simple column check, buildColumns is already tested above
        expect(result.columns).toEqual(expectedColumns);
    });


    it("should clone all configs, so that you can create multiple grids from the same defaults "+
        "(component test)", function() {
        // prepare
        model('MyTest.model.GridConfigTwoTimesTest');

        var config = Ext.create('Bancha.scaffold.grid.Config', {
            target: 'MyTest.model.GridConfigTwoTimesTest'
        });

        // first
        var result = panel.buildConfig(config);
        // should have a store
        expect(result.store.getProxy().getModel()).toBeModelClass(
                'MyTest.model.GridConfigTwoTimesTest');
        // just a simple column check, buildColumns is already tested above
        expect(result.columns).toEqual(expectedColumns);

        // second
        result = panel.buildConfig(config);
        // should have a store
        expect(result.store.getProxy().getModel()).toBeModelClass(
                'MyTest.model.GridConfigTwoTimesTest');
        // just a simple column check, buildColumns is already tested above
        expect(result.columns).toEqual(expectedColumns);
    });


    it("should build a editable grid panel config with update and delete support with "+
        "#buildConfig (component test)", function() {
        // prepare
        model('MyTest.model.GridConfigWithUpdateDeleteTest');

        var config = Ext.create('Bancha.scaffold.grid.Config', {
            target: 'MyTest.model.GridConfigWithUpdateDeleteTest',
            editable  : true,
            deletable : true,
            buttons: ['save']
        });

        // test
        var result = panel.buildConfig(config);

        // should have a store
        expect(result.store.getProxy().getModel()).toBeModelClass(
                'MyTest.model.GridConfigWithUpdateDeleteTest');

        // just a simple column check, buildColumns is already tested above
        expect(result.columns.length).toEqual(9);

        // should have all columns editable
        // (the first is the id-editor and therefore is guessed to don't have an editorfield)
        expect(result.columns[1].editor.xtype).toEqual("textfield");

        // should be editable
        expect(result.selType).toEqual('cellmodel');
        // expect a celleditor plugin for update support
        expect(result).property("plugins.0").toBeOfClass("Ext.grid.plugin.CellEditing");
        // standardwise two clicks are expected for update start
        expect(result).property("plugins.0.clicksToEdit").toEqual(2);

        // should have an update button
        expect(result).property("dockedItems.0.items.0.iconCls").toEqual('icon-save');
    });


    it("should build a grid panel config with full crud support with "+
        "#buildConfig (component test)", function() {
        // prepare
        model('MyTest.model.GridConfigWithCRUDTest');

        var config = Ext.create('Bancha.scaffold.grid.Config', {
            target: 'MyTest.model.GridConfigWithCRUDTest',
            editable  : true,
            deletable : true,
            buttons: ['->','create','reset','save']
        });

        // test
        var result = panel.buildConfig(config, {
            additionalGridConfig: true
        });

        // should have a store
        expect(result.store.getProxy().getModel()).toBeModelClass(
                'MyTest.model.GridConfigWithCRUDTest');

        // just a simple column check, buildColumns is already tested above
        expect(result.columns.length).toEqual(9);

        // should be editable (simple check)
        expect(result.selType).toEqual('cellmodel');
        expect(result.plugins[0]).toBeOfClass("Ext.grid.plugin.CellEditing");

        // should have an create button
        var buttons = result.dockedItems[0].items;
        expect(buttons[1].iconCls).toEqual('icon-add');

        // should have an reset button
        expect(buttons[2].iconCls).toEqual('icon-reset');

        // should have an update button
        expect(buttons[3].iconCls).toEqual("icon-save");

        // should have added the additional grid config
        expect(result.additionalGridConfig).toBeTruthy();
    });


    it("should use singleton class interceptors when building a config (component test)", function() {
        // prepare
        model('MyTest.model.GridConfigWithClassInterceptorsTest');

        // set up

        // get the defaults before overriding them
        var defaults = {
            beforeBuild: Bancha.scaffold.grid.Config.prototype.beforeBuild,
            afterBuild: Bancha.scaffold.grid.Config.prototype.afterBuild,
            transformColumnConfig: Bancha.scaffold.grid.Config.prototype.transformColumnConfig
        };

        // the same when defining them on the class
        Bancha.scaffold.grid.Config.setDefaults({
            beforeBuild: function() {
                return {
                    interceptors: ['before'] // make sure that afterBuild only augemts
                };
            },
            afterBuild: function(config) {
                config.interceptors.push('after');
                return config;
            },
            transformColumnConfig: function(config) {
                config.isAugmented = true;
                return config;
            }
        });

        var config = Ext.create('Bancha.scaffold.grid.Config', {
            target: 'MyTest.model.GridConfigWithClassInterceptorsTest'
        });

        var result = panel.buildConfig(config);

        // beforeBuild, afterBuild
        expect(result.interceptors).toEqual(['before','after']);

        // transformColumnConfig
        expect(result.columns).toBeAnObject();
        Ext.each(result.columns, function(column) {
            expect(column.isAugmented).toEqual(true);
        });

        // tear down
        Bancha.scaffold.grid.Config.setDefaults(defaults);
    });


    it("should use config interceptors when building a config (component test)", function() {
        // prepare
        model('MyTest.model.GridConfigWithConfigInterceptorsTest');


        var config = Ext.create('Bancha.scaffold.grid.Config', {
            target: 'MyTest.model.GridConfigWithConfigInterceptorsTest',
            beforeBuild: function() {
                return {
                    interceptors: ['before'] // make sure that afterBuild only augemts
                };
            },
            afterBuild: function(config) {
                config.interceptors.push('after');
                return config;
            },
            transformColumnConfig: function(config) {
                config.isAugmented = true;
                return config;
            }
        });

        // use a config specific only for this call
        var result = panel.buildConfig(config);

        // beforeBuild, afterBuild
        expect(result.interceptors).toEqual(['before','after']);

        // guessFieldConfg
        expect(result.columns).toBeAnObject();
        Ext.each(result.columns, function(column) {
            expect(column.isAugmented).toEqual(true);
        });
    });


    it("should use form class transformation interceptor for building editor fields from the config (component test)", function() {
        // prepare
        model('MyTest.model.GridConfigWithFormInterceptorTest1');

        var config = Ext.create('Bancha.scaffold.grid.Config', {
            target: 'MyTest.model.GridConfigWithFormInterceptorTest1',
            editable: true,
            formConfig: {
                transformFieldConfig: function(config) {
                    config = config || {}; // for the id column, where there is no editor field
                    config.isAugmented = true;
                    return config;
                }
            }
        });

        // test
        var result = panel.buildConfig(config);

        // transformFieldConfig
        expect(result.columns).toBeAnObject();
        Ext.each(result.columns, function(column) {
            if(column.dataIndex!=='id') { // since the id column doesn't have an editor, ignore it
                expect(column).property('editor.isAugmented').toEqual(true);
            }
        });
    });


    it("should use form class transformation interceptor for building editor fields from defaults (component test)", function() {
        // prepare
        model('MyTest.model.GridConfigWithFormInterceptorTest2');

        // set up

        // get the defaults before overriding them
        var defaults = {
            editable: Bancha.scaffold.grid.Config.prototype.editable,
            formConfig: Bancha.scaffold.grid.Config.prototype.formConfig
        };

        // the same when defining them on the class
        Bancha.scaffold.grid.Config.setDefaults({
            editable: true,
            formConfig: {
                transformFieldConfig: function(config) {
                    config = config || {}; // for the id column, where there is no editor field
                    config.isAugmented = true;
                    return config;
                }
            }
        });

        var config = Ext.create('Bancha.scaffold.grid.Config', {
            target: 'MyTest.model.GridConfigWithFormInterceptorTest2'
        });

        // test
        var result = panel.buildConfig(config);

        // transformFieldConfig
        expect(result.columns).toBeAnObject();
        Ext.each(result.columns, function(column) {
            if(column.dataIndex!=='id') { // since the id column doesn't have an editor, ignore it
                expect(column).property('editor.isAugmented').toEqual(true);
            }
        });

        //tear down
        Bancha.scaffold.grid.Config.setDefaults(defaults);
    });


    it('This just reset configs, since jasmin doesn\' provide a after suite function', function() {
        Bancha.scaffold.grid.Config.setDefaults(defaults);
    });

}); //eo scaffold grid functions


describe("Ext.grid.Panel scaffold extension tests",function() {
    var model = BanchaScaffoldSpecHelper.getSampleModel; //shortcut

    beforeEach(function() {
        Bancha.scaffold.grid.Config.setDefault('storeDefaults', {
            autoLoad: false // don't load anything on tests
        });
    });

	it("should augment the class Ext.grid.Panel and use simple scaffold:modelname", function() {
        // prepare
        model('MyTest.model.GridPanelExtensionModelNameTestModel');

        // this simply tests that the beforeEach correctly set up the storeDefaults
        expect(Bancha.scaffold.grid.Config.prototype.storeDefaults.autoLoad).toEqual(false);

		var panel = Ext.create("Ext.grid.Panel", {
			scaffold: 'MyTest.model.GridPanelExtensionModelNameTestModel'
		});

        // since this function is using #buildConfig,
        // just test that it is applied and no error was raised

		expect(panel).property('columns.length').toEqual(9); // 8 columns + destroy column
	});

	it("should augment the class Ext.grid.Panel and use simple scaffold:modelClass", function() {
        // prepare
        model('MyTest.model.GridPanelExtensionModelClassTestModel');

		var panel = Ext.create("Ext.grid.Panel", {
			scaffold: Ext.ClassManager.get('MyTest.model.GridPanelExtensionModelClassTestModel')
		});

        // since this function is using #buildConfig,
        // just test that it is applied and no error was raised

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

    it("should be cleanly subclassable", function() {
        // prepare
        model('MyTest.model.GridPanelSubclassingTestModel');

        Ext.define('Bancha.scaffold.test.GridPanel', {
            extend: 'Ext.grid.Panel',
            scaffold: 'MyTest.model.GridPanelSubclassingTestModel'
        });

        // try subclassing
        var panel = Ext.create('Bancha.scaffold.test.GridPanel', {});

        // since this function is using #buildConfig,
        // just test that it is applied and no error was raised

        expect(panel).property('columns.length').toEqual(9); // 8 columns + destroy column
    });

    it('Tear down function, since jasmin doesn\' provide a after suite function', function() {
        Bancha.scaffold.grid.Config.setDefault('storeDefaults', {
            autoLoad: true // reset
        });
    });

});
