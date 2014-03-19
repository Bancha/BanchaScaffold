/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2014 codeQ e.U.
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * Bancha.scaffold.grid.ManagementPanel tests
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

describe("Bancha.scaffold.grid.ManagementPanel tests",function() {

    // setup some models
    Ext.define('Bancha.model.ManagementPanelUser', {
        extend: 'Ext.data.Model',
        idProperty:'id',
        proxy: {
            type: 'direct',
            batchActions: false,
            api: {
                read    : Ext.emptyFn,
                create  : Ext.emptyFn,
                update  : Ext.emptyFn,
                destroy : Ext.emptyFn
            }
        },
        fields:[{
            name:'id',
            type:'int'
        }]
    });
    Ext.define('Bancha.model.ManagementPanelArticle', {
        extend: 'Ext.data.Model',
        idProperty:'id',
        proxy: {
            type: 'direct',
            batchActions: false,
            api: {
                read    : Ext.emptyFn
            }
        },
        fields:[{
            name:'id',
            type:'int'
        }]
    });

    it('should recognize both model strings and model objects', function() {
        var panel = Ext.create('Bancha.scaffold.grid.ManagementPanel', {
            models: [
                'Bancha.model.ManagementPanelUser',
                Ext.ClassManager.get('Bancha.model.ManagementPanelArticle')
            ],
            scaffoldDefaults: { storeDefaults: {}} // prevent autoloading
        });

        // expect two tabs
        expect(panel).property('items.items.length').toEqual(2);

        // expect title to be set on both tabs
        expect(panel).property('items.items.0.title').toEqual('Management Panel User');
        expect(panel).property('items.items.1.title').toEqual('Management Panel Article');

        // expect scaffold model to be set on both tabs
        expect(panel).property('items.items.0.store.model').toEqual(Ext.ClassManager.get('Bancha.model.ManagementPanelUser'));
        expect(panel).property('items.items.1.store.model').toEqual(Ext.ClassManager.get('Bancha.model.ManagementPanelArticle'));
    });

    it('should recognize the models capabilities and provides only those functionality', function() {
        var panel = Ext.create('Bancha.scaffold.grid.ManagementPanel', {
            models: ['Bancha.model.ManagementPanelUser'],
            scaffoldDefaults: { storeDefaults: {}} // prevent autoloading
        });

        // expect a bottom toolbar
        expect(panel).property('items.items.0.dockedItems.items.length').toEqual(2);

        // expect full CRUD support for user model
        expect(panel).property('items.items.0.dockedItems.items.1.items.items.0.xtype').toEqual('tbfill');
        expect(panel).property('items.items.0.dockedItems.items.1.items.items.1.iconCls').toEqual('icon-add');
        expect(panel).property('items.items.0.dockedItems.items.1.items.items.2.iconCls').toEqual('icon-reset');
        expect(panel).property('items.items.0.dockedItems.items.1.items.items.3.iconCls').toEqual('icon-save');

        // records should be deletable (1 column + 1 delete icon)
        expect(panel).property('items.items.0.columns.length').toEqual(2);


        // test with a model with fewer capabilities
        panel = Ext.create('Bancha.scaffold.grid.ManagementPanel', {
            models: ['Bancha.model.ManagementPanelArticle'],
            scaffoldDefaults: { storeDefaults: {}} // prevent autoloading
        });

        // expect no toolbar at all
        expect(panel).property('items.items.0.dockedItems.items.length').toEqual(1);

        // check for not deleteable
        expect(panel).property('items.items.0.columns.length').toEqual(1);
    });

    it('should use the panelDefaults and inject them into every panel', function() {
        var panel = Ext.create('Bancha.scaffold.grid.ManagementPanel', {
            models: [
                'Bancha.model.ManagementPanelUser',
                'Bancha.model.ManagementPanelArticle'
            ],
            scaffoldDefaults: { storeDefaults: {}}, // prevent autoloading
            panelDefaults: {
                title: 'Overwritten',
                extended: true
            }
        });

        // expect title to be overwritten on both tabs
        expect(panel).property('items.items.0.title').toEqual('Overwritten');
        expect(panel).property('items.items.1.title').toEqual('Overwritten');


        // expect extended config to be set on every panel
        expect(panel).property('items.items.0.extended').toEqual(true);
        expect(panel).property('items.items.1.extended').toEqual(true);
    });

    it('should use the scaffoldDefaults and inject them into every panel', function() {
        var panel = Ext.create('Bancha.scaffold.grid.ManagementPanel', {
            models: [
                'Bancha.model.ManagementPanelUser',
                'Bancha.model.ManagementPanelArticle'
            ],
            scaffoldDefaults: {
                storeDefaults: {}, // prevent autoloading
                buttons: false
            }
        });

        // expect no toolbar at all
        expect(panel).property('items.items.0.dockedItems.items.length').toEqual(1);
        expect(panel).property('items.items.1.dockedItems.items.length').toEqual(1);
    });
});
