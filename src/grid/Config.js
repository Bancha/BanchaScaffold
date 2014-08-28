/*
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2014 codeQ e.U.
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @package       Bancha.scaffold
 * @copyright     Copyright 2011-2014 codeQ e.U.
 * @link          http://scaffold.bancha.io
 * @since         Bancha Scaffold v 1.0.0
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha Scaffold v PRECOMPILER_ADD_BANCHA_SCAFFOLD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.bancha.io
 */

/**
 * @singleton
 * @class Bancha.scaffold.grid.Config
 * **This is only available inside Ext JS.**
 *
 * This class is a config class for creating scaffoled {@link Ext.grid.Panel}s.
 *
 * For more information see {@link Ext.grid.Panel}.
 *
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @docauthor Roland Schuetz <mail@rolandschuetz.at>
 */
Ext.define('Bancha.scaffold.grid.Config', {
    uses: [
        'Ext.window.MessageBox'
    ],

    /**
     * Create a new config instance
     */
    constructor: function(config) {
        config = config || {};
        var triggeredFrom = config.triggeredFrom || 'Unknown Origin',
            modelName;

        // if the config is just a model or model name, transform to a config object
        if (Ext.isString(config) || Bancha.scaffold.Util.isModel(config)) {
            config = {
                target: config // this is a valid model
            };
        }

        //<debug>
        // check that a model is set
        if(!config.target) {
            Ext.Error.raise({
                plugin: 'Bancha Scaffold',
                msg: [
                    'Bancha Scaffold: If you set a grid scaffold config object ',
                    'for '+triggeredFrom+', the target property must be set!'
                ].join('')
            });
        }
        //</debug>

        // check that the configured model is valid
        modelName = config.target;
        modelName = Ext.isString(modelName) ? modelName : Ext.ClassManager.getName(modelName);

        // make sure it's loaded
        Ext.syncRequire(modelName);

        //<debug>
        if (!Bancha.scaffold.Util.isModel(modelName)) {
            Ext.Error.raise({
                plugin: 'Bancha Scaffold',
                msg: [
                    'Bancha Scaffold: If you set a grid scaffold config object ',
                    'for '+triggeredFrom+', the target property must be a model ',
                    'name or model class. Instead ' + config.target + ' of type ',
                    (typeof config.target) + ' was set.'
                ].join('')
            });
        }
        //</debug>

        // make sure that the model property is always a model class
        config.target = Bancha.scaffold.Util.getModel(modelName);

        // now build the form config

        // normally we would use config.isInstance here, but that was introduced in Ext JS 4.1
        if (!Ext.isObject(config.formConfig) || !config.formConfig.$className) {
            config.formConfig = config.formConfig || this.formConfig || {}; // instance config, or default, or {}
            config.formConfig.triggeredFrom = config.triggeredFrom;
            // take the model the grid config
            config.formConfig = Ext.apply(config.formConfig, {
                target: config.target
            });
            // build the instance
            config.formConfig = Ext.create('Bancha.scaffold.form.Config', config.formConfig);
        }

        // apply to the object
        Ext.apply(this, config);
    },

    statics: {
        /**
         * Set a new default for scaffolding forms
         */
        setDefault: function(configName, config) {
            // apply to the class prototype
            this.prototype[configName] = config;
        },
        /**
         * Set some defaults for scaffolding forms
         */
        setDefaults: function(config) {
            // apply to the class prototype
            Ext.apply(this.prototype, config);
        }
    },

    /**
     * @private
     * @cfg {String} triggeredFrom
     * (optional) Used for debugging messages as target
     */
    /**
     * @cfg {Ext.data.Model|String} target
     * The model to use
     */
    /**
     * @private
     * @property {Ext.data.Model} target
     * The model to use
     */
    /**
     * @cfg {String[]}
     * Exclude some model fields from scaffolding
     */
    exclude: [],
    /**
     * @cfg {String[]|false}
     * If this is set to an array, only those fields are displayed.
     *
     * The given order of fields is also applied, so to reorder your fields 
     * simply defined something like _fields: ['field2','field1']_
     *
     * Note that the exclude setting are still applied.
     */
    fields: false,
    /**
     * @cfg
     * This config is applied to each scaffolded column config
     */
    columnDefaults: {
        flex: 1 // foreFit the columns to take the whole available space
    },
    /**
     * @cfg
     * This config is applied to each scaffolded Ext.grid.column.Grid
     */
    gridcolumnDefaults: {},
    /**
     * @cfg
     * This config is applied to each scaffolded Ext.grid.column.Number
     */
    numbercolumnDefaults: {},
    /**
     * @cfg
     * This config is applied to each scaffolded Ext.grid.column.Boolean
     */
    booleancolumnDefaults: {},
    /**
     * @cfg
     * This config is applied to each scaffolded Ext.grid.column.Column
     */
    datecolumnDefaults: {},
    /**
     * @private
     * @property {Bancha.scaffold.form.Config} formConfig
     * If the editable property was true while building, these configurations
     * were applied for building the editor fields.
     */
    /**
     * @cfg {Bancha.scaffold.form.Config|Object}
     * If the editable property is true, these configurations will be applied
     * for building the editor fields.
     *
     * See {@link Bancha.scaffold.form.Config}
     * for all configuration options
     */
    formConfig: {},
    /**
     * @cfg
     * The defaults class to create an store for grid scaffolding.
     *
     * See also {@link Bancha.scaffold.Util#getStore}.
     *
     * Default: *"Ext.data.Store"*
     */
    storeDefaultClass: 'Ext.data.Store',
    /**
     * @cfg
     * Defaults for all grid stores created with this scaffolding.
     *
     * See also {@link Bancha.scaffold.Util#getStore}.
     *
     * Default:
     *
     *     {
     *       autoLoad: true
     *     }
     */
    storeDefaults: {
        autoLoad: true
    },
    /**
     * @cfg
     * True to use only one store per model (singleton),
     * false to create a new store each time.
     *
     * See also {@link Bancha.scaffold.Util#getStore}.
     *
     * Default: *true*
     */
    oneStorePerModel: true,
    /**
     * @cfg {Function} transformColumnConfig
     * Used to add some custom behaviour.
     *
     * This function can be overwritten by any custom function.
     * @param {Object} columnConfig the column config to transform
     * @param {String} modelType A standard model field type like 'string'
     * (also supports 'file' for compability with http://bancha.io)
     * @return {Object} Returns an Ext.grid.column.* configuration object
     */
    transformColumnConfig: function (columnConfig, modelType) {
        return columnConfig;
    },
    /**
     * @cfg
     * Editable function to be called when the create button is pressed.
     * To change the default scaffolding behaviour just replace this function.
     *
     * The scope provides two functions:
     *
     *  - this.getStore() to get the grids store
     *  - this.getCellEditing() to get the grids cell editing plugin
     */
    onCreate: function () {
        var edit = this.getCellEditing(),
            grid = edit.grid,
            store = this.getStore(),
            model = store.getProxy().getModel(),
            rec, visibleColumn = false;

        // Cancel any active editing.
        edit.cancelEdit();

        // create new entry
        rec = Ext.create(Ext.ClassManager.getName(model), {});

        // add entry
        store.insert(0, rec);

        // find first visible column
        Ext.each(grid.columns, function (el, i) {
            if (el.hidden !== true) {
                visibleColumn = i;
                return false;
            }
        });

        // start editing
        if (visibleColumn) {
            edit.startEditByPosition({
                row: 0,
                column: visibleColumn
            });
        }
    },
    /**
     * @cfg
     * Editable function to be called when the save button is pressed.
     * To change the default scaffolding behaviour just replace this function.
     *
     * The scope provides two functions:
     *
     *  - this.getStore() to get the grids store
     *  - this.getCellEditing() to get the grids cell editing plugin
     */
    onSave: function () {
        var valid = true,
            msg = '',
            name,
            store = this.getStore();

        // check if all changes are valid
        store.each(function (el) {
            if (!el.isValid()) {
                valid = false;
                name = el.get('name') || el.get('title') || (el.phantom ? 'New entry' : el.getId());
                msg += '<br><br><b>' + name + ':</b>';
                el.validate().each(function (error) {
                    msg += '<br>&nbsp;&nbsp;&nbsp;' + error.field + ' ' + error.message;
                });
            }
        });

        if (!valid) {
            Ext.MessageBox.show({
                title: 'Invalid Data',
                msg: '<div style="text-align:left; padding-left:50px;">There are errors in your data:' + msg + '</div>',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
        } else {
            // commit create and update
            store.sync();
        }
    },
    /**
     * @cfg
     * Editable function to be called when the reset button is pressed.
     * To change the default scaffolding behaviour just replace this function.
     *
     * The scope provides two functions:
     *
     *  - this.getStore() to get the grids store
     *  - this.getCellEditing() to get the grids cell editing plugin
     */
    onReset: function () {
        // reject all changes
        var store = this.getStore();
        store.each(function (rec) {
            if (rec && rec.modified) {
                rec.reject();
            }
            if (rec && rec.phantom) {
                store.remove(rec);
            }
        });

        // TODO fix this really ugly thing
        // there is a strange bug going on, when you change all records,
        // and then create a new one and then hit reset, the original first
        // record becomes undefined and is not reset
        // That's why we iterate here two times and check for rec beeing truthy
        store.each(function (rec) {
            if (rec && rec.modified) {
                rec.reject();
            }
            if (rec && rec.phantom) {
                store.remove(rec);
            }
        });
    },
    /**
     * @cfg
     * Editable function to be called when the delete button is pressed.
     * To change the default scaffolding behaviour just replace this function.
     *
     * Scope can be defined in *destroyButtonConfig.items[0].scope*, but normally
     * you don't need a scope here, since the arguments already provide everything.
     */
    onDelete: function (grid, rowIndex, colIndex) {
        var store = grid.getStore(),
            rec = store.getAt(rowIndex),
            name = Ext.getClassName(rec),
            displayName = Bancha.scaffold.Util.humanizeClassName(name);

        // instantly remove vom ui
        store.remove(rec);

        // sync to server
        // for before-Ext JS 4.1 the callbacks will be ignored,
        // since they were added in 4.1
        store.sync({
            success: function (batch, options) {
                Ext.MessageBox.show({
                    title: displayName + ' record deleted',
                    msg: displayName + ' record was successfully deleted.',
                    icon: Ext.MessageBox.INFO,
                    buttons: Ext.Msg.OK
                });
            },
            failure: function (batch, options) {

                // since it couldn't be deleted, add again
                store.add(rec);

                var msg = displayName + ' record could not be deleted.';
                if(batch.getOperations()[0].getError()) {
                    msg = batch.getOperations()[0].getError();
                }

                // inform user
                Ext.MessageBox.show({
                    title: displayName + ' record could not be deleted',
                    msg: msg,
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK
                });
            }
        });

    },
    /**
     * @cfg
     * If true all cells become editable by double-click. If false
     * Bancha doesn't create editor properties for columns.
     *
     * The buttons 'create' and 'save' expect this to be true.
     */
    editable: true,
    /**
     * @cfg
     * If true a destroy button is rendered for each record.
     * See also {@link #destroyButtonConfig}
     */
    deletable: true,
    /**
     * @cfg {String[]|Ext.button.Button[]}
     * If an array of elements, a footer toolbar is rendered.
     *
     * 'create','reset' and 'save' will be replaced by scaffolded
     * buttons, other elements are treated like default Ext JS items.
     *
     * Inside your own buttons you can set the scope property to
     * 'scaffold-scope-me', this scope provides two functions:
     *  - this.getStore() to get the grids store
     *  - this.getCellEditing() to get the grids cell editing plugin
     *
     * Default: ['->','create','reset','save']
     */
    buttons: ['->','create','reset','save'],
    /**
     * @cfg
     * Default create button config, used in buttons config.
     * If not defined scope and handler properties will be set by
     * the build function.
     */
    createButtonConfig: {
        iconCls: 'icon-add',
        text: 'Create'
    },
    /**
     * @cfg
     * Default save button config, used in buttons config
     * If not defined scope and handler properties will be set by
     * the build function.
     */
    saveButtonConfig: {
        iconCls: 'icon-save',
        text: 'Save'
    },
    /**
     * @cfg
     * Default reset button config, used in buttons config
     * If not defined scope and handler properties will be set by
     * the build function.
     */
    resetButtonConfig: {
        iconCls: 'icon-reset',
        text: 'Reset'
    },
    /**
     * @cfg
     * Default last column config, used if deletable is true to render a destroy
     * button at the end of the line.
     * The button handler is expected at destroyButtonConfig.items[0].handler, if it is
     * equal Ext.emptyFn it will be replace, otherwise the custom config is used.
     */
    destroyButtonConfig: {
        xtype: 'actioncolumn',
        width: 30,
        items: [{
            iconCls: 'icon-destroy',
            tooltip: 'Delete',
            handler: Ext.emptyFn // will be replaced by button handler
        }]
    },
    /**
     * @cfg {Function}
     * The function will be executed before scaffolding as interceptor.
     * @param {Ext.data.Model} model the model used for scaffolding
     * @param {Object} config the scaffold full config for this call
     * @param {Object} initialPanelConfig please ignore, this is a legacy argument, may having some additional Ext.grid.Panel configs
     * @return {Object|undefined} object with initial Ext.form.Panel configs
     */
    beforeBuild: function (model, config, initialPanelConfig) {},
    /**
     * @cfg {Function}
     * This function will be executed after scaffolding as interceptor.
     * @param {Object} gridConfig the just build grid panel config
     * @param {Ext.data.Model} model the model used for scaffolding
     * @param {Object} config the scaffold full config for this call
     * @param {Object} initialPanelConfig please ignore, this is a legacy argument, may having some additional Ext.grid.Panel configs
     * @return {Object|undefined} object with final Ext.grid.Panel configs or undefined to use the passed config
     */
    afterBuild: function (gridConfig, model, config, initialPanelConfig) {}
});
