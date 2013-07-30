/*
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2013 codeQ e.U.
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @package       Bancha.scaffold
 * @copyright     Copyright 2011-2013 codeQ e.U.
 * @link          http://scaffold.banchaproject.org
 * @since         Bancha.scaffold 0.0.1
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha.scaffold v PRECOMPILER_ADD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.banchaproject.org
 */

/**
 * @singleton
 * @class Bancha.scaffold.Grid
 * **This is only available inside Ext JS.**
 *
 * This class is a factory for creating {@link Ext.grid.Panel}'s. It uses many 
 * data from the given model, including field configs and validation rules.
 *
 * For more information see {@link Ext.grid.Panel}.
 *
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @docauthor Roland Schuetz <mail@rolandschuetz.at>
 */
Ext.define('Bancha.scaffold.Grid', {
    singleton: true,
    uses: [
        'Ext.data.validations'
    ],

    /**
     * @private
     * @property
     * Maps model types with column types and additional configs for prototyping
     */
    fieldToColumnConfigs: {
        'auto': {
            xtype: 'gridcolumn'
        },
        'string': {
            xtype: 'gridcolumn'
        },
        'int': {
            xtype: 'numbercolumn',
            format: '0'
        },
        'float': {
            xtype: 'numbercolumn'
        },
        'boolean': {
            xtype: 'booleancolumn'
        },
        'bool': {
            xtype: 'booleancolumn'
        },
        // a synonym
        'date': {
            xtype: 'datecolumn'
        }
    },
    /**
     * @property {String[]}
     * Exclude some model fields from scaffolding
     */
    exclude: [],
    /**
     * @property {String[]|false}
     * If this is set to an array, only those fields are displayed.
     * Note that the exclude setting are still applied.
     */
    fields: false,
    /**
     * @property
     * This config is applied to each scaffolded column config
     */
    columnDefaults: {
        flex: 1 // foreFit the columns to take the whole available space
    },
    /**
     * @property
     * This config is applied to each scaffolded Ext.grid.column.Grid
     */
    gridcolumnDefaults: {},
    /**
     * @property
     * This config is applied to each scaffolded Ext.grid.column.Number
     */
    numbercolumnDefaults: {},
    /**
     * @property
     * This config is applied to each scaffolded Ext.grid.column.Boolean
     */
    booleancolumnDefaults: {},
    /**
     * @property
     * This config is applied to each scaffolded Ext.grid.column.Column
     */
    datecolumnDefaults: {},
    /**
     * @property {Object}
     * If the editable property is true, these configurations will be applied
     * for building the editor fields. See {@link #Bancha.scaffold.Form} for
     * all configuration options
     */
    formConfig: {},
    /**
     * @property
     * The defaults class to create an store for grid scaffolding. (Default: "Ext.data.Store")
     */
    storeDefaultClass: "Ext.data.Store",
    /**
     * @property
     * Defaults for all grid stores created with this scaffolding.
     * Default:
     *    {
     *      autoLoad: true
     *    }
     */
    storeDefaults: {
        autoLoad: true
    },
    /**
     * @property
     * True to use only one store per model (singleton),
     * false to create a new store each time.
     */
    oneStorePerModel: true,
    /**
     * @property {Function} transformColumnConfig Writable function used to add some custom behaviour.
     *
     * This function can be overwritten by any custom function.
     * @param {Object} columnConfig the column config to transform
     * @param {String} modelType A standard model field type like 'string' (also supports 'file' for compability with http://banchaproject.org)
     * @return {Object} Returns an Ext.grid.column.* configuration object
     */
    transformColumnConfig: function (columnConfig, modelType) {
        return columnConfig;
    },
    /**
     * @private
     * @property {Function} internalTransformColumnConfig
     * This function just hides id columns and makes it uneditable.
     * @param {Object} columnConfig the column config to transform
     * @param {String} modelType A standard model field type like 'string' (also supports 'file' for compability with http://banchaproject.org)
     * @return {Object} Returns an Ext.grid.column.* configuration object
     */
    internalTransformColumnConfig: function (columnConfig, modelType) {
        if (columnConfig.dataIndex === 'id') {
            columnConfig.hidden = true;
            columnConfig.field = undefined;
        }

        return columnConfig;
    },
    /**
     * @private
     * Builds a column with all defaults defined here
     * @param {Sring} type The model field type
     * @param {Object} defaults (optional) Defaults like numbercolumnDefaults as property of this config.
     * See {@link #buildConfig}'s config property
     * @return {Object} Returns an Ext.grid.column.* configuration object
     */
    buildDefaultColumnFromModelType: function (type, defaults) {
        defaults = defaults || {};
        var column = this.fieldToColumnConfigs[type],
            columnDefaults = Ext.clone(defaults.columnDefaults || this.columnDefaults),
            // make a new object of defaults
            columnTypeDefaults = defaults[column.xtype + 'Defaults'] || this[column.xtype + 'Defaults'];
        return Ext.apply(columnDefaults, column, columnTypeDefaults);
    },
    /**
     * @private
     * Creates a Ext.grid.Column config from an model field type
     * @param {Sring} The model field
     * @param {Sring} The field's model
     * @param {Object} config the grid config object
     *                 See {@link #buildConfig}'s config property
     * @param {Object} gridListeners the grid listeners array, can be
     *                 augmented by this function
     * @param {Array} (optional) validations An array of Ext.data.validations of the model
     * @return {Object} Returns an Ext.grid.column.* configuration object
     */
    buildColumnConfig: function (field, model, config, validations, gridListeners) {
        var fieldType = field.type.type,
            column = this.buildDefaultColumnFromModelType(fieldType, config),
            formConfig,
            association,
            store,
            fieldName;

        // infer name
        if (field.name) {
            column.text = Bancha.scaffold.Util.humanize(field.name);
            column.dataIndex = field.name;
        }

        // check for associations
        association = Bancha.scaffold.Util.getBelongsToAssociation(field, model);
        if(association) {
            // load the store
            store = Bancha.scaffold.Util.getStore(association.associatedModel, config);
            fieldName = Bancha.scaffold.Util.getDisplayFieldName(association.associatedModel); // calculate this only once per column

            // build a renderer
            column.renderer = function(id) {
                var rec = store.getById(id);

                // display either the found record name or Unknown
                return rec ? rec.get(fieldName) : (Bancha.t ? Bancha.t('Unknown') : 'Unknown');
            };

            // if necessary re-render when the data is available
            gridListeners.render = Ext.Function.createSequence(gridListeners.render || Ext.emptyFn, function(gridpanel) {
                if(store.getCount() === 0) {
                    store.on('load', function(store, records, successful, eOpts) {
                        if(successful) {
                            // re-render
                            gridpanel.getView().refresh();
                        }
                    });
                }
            });
        } //eo if association

        // add an editor
        if(config.editable) {
            formConfig = config.formConfig || {};
            formConfig = Ext.apply({}, formConfig, Ext.clone(Bancha.scaffold.Form));
            // take the store config from the grid config
            formConfig.storeDefaults = config.storeDefaults;
            formConfig.oneStorePerModel = config.oneStorePerModel;
            // build the editor field
            column.field = Bancha.scaffold.Form.buildFieldConfig(field, model, formConfig, validations, true);

            // now make custom field transforms
            column.field = formConfig.internalTransformFieldConfig(column.field, fieldType);
            if (typeof formConfig.transformFieldConfig === 'function') {
                column.field = formConfig.transformFieldConfig(column.field, fieldType);
            }
        }

        // now make custom transforms
        column = config.internalTransformColumnConfig(column, fieldType);
        if (typeof config.transformColumnConfig === 'function') {
            column = config.transformColumnConfig(column, fieldType);
        }

        return column;
    },
    /**
     * @property
     * Editable function to be called when the create button is pressed.
     * To change the default scaffolding behaviour just replace this function.
     *
     * The scope provides two functions:
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
     * @property
     * Editable function to be called when the save button is pressed.
     * To change the default scaffolding behaviour just replace this function.
     *
     * The scope provides two functions:
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
                name = el.get('name') || el.get('title') || (el.phantom ? "New entry" : el.getId());
                msg += "<br><br><b>" + name + ":</b>";
                el.validate().each(function (error) {
                    msg += "<br>&nbsp;&nbsp;&nbsp;" + error.field + " " + error.message;
                });
            }
        });

        if (!valid) {
            Ext.MessageBox.show({
                title: 'Invalid Data',
                msg: '<div style="text-align:left; padding-left:50px;">There are errors in your data:' + msg + "</div>",
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
        } else {
            // commit create and update
            store.sync();
        }
    },
    /**
     * @property
     * Editable function to be called when the reset button is pressed.
     * To change the default scaffolding behaviour just replace this function.
     *
     * The scope provides two functions:
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
     * @property
     * Editable function to be called when the delete button is pressed.
     * To change the default scaffolding behaviour just replace this function.
     *
     * Scope can be defined in destroyButtonConfig.items[0].scope, but normally
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
        // for before-ExtJS 4.1 the callbacks will be ignored,
        // since they were added in 4.1
        store.sync({
            success: function (record, operation) {
                Ext.MessageBox.show({
                    title: displayName + ' record deleted',
                    msg: displayName + ' record was successfully deleted.',
                    icon: Ext.MessageBox.INFO,
                    buttons: Ext.Msg.OK
                });
            },
            failure: function (record, operation) {

                // since it couldn't be deleted, add again
                store.add(rec);

                // inform user
                Ext.MessageBox.show({
                    title: displayName + ' record could not be deleted',
                    msg: operation.getError() || (displayName + ' record could not be deleted.'),
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK
                });
            }
        });

    },
    /**
     * @property
     * If true all cells become editable by double-click. If false
     * Bancha doesn't create editor properties for columns.
     * The buttons 'create' and 'save' expect this to be true
     */
    editable: true,
    /**
     * @property
     * If true a destroy button is rendered for each record.
     * See also {@link #destroyButtonConfig}
     */
    deletable: true,
    /**
     * @property
     * If an array of elements, a footer toolbar is rendered.
     * 'create','reset' and 'save' will be replaced by scaffolded
     * buttons, other elements are treated like default ExtJS items.
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
     * @property
     * Default create button config, used in buttons config.
     * If not defined scope and handler properties will be set by
     * the build function.
     */
    createButtonConfig: {
        iconCls: 'icon-add',
        text: 'Create'
    },
    /**
     * @property
     * Default save button config, used in buttons config
     * If not defined scope and handler properties will be set by
     * the build function.
     */
    saveButtonConfig: {
        iconCls: 'icon-save',
        text: 'Save'
    },
    /**
     * @property
     * Default reset button config, used in buttons config
     * If not defined scope and handler properties will be set by
     * the build function.
     */
    resetButtonConfig: {
        iconCls: 'icon-reset',
        text: 'Reset'
    },
    /**
     * @property
     * Default last column config, used if deletable is true to render a destroy
     * button at the end of the line.
     * The button handler is expected at destroyButtonConfig.items[0].handler, if it is
     * equal Ext.emptyFn it will be replace, otherwise the custom config is used.
     */
    destroyButtonConfig: {
        xtype: 'actioncolumn',
        width: 50,
        items: [{
            icon: '/img/icons/delete.png',
            tooltip: 'Delete',
            handler: Ext.emptyFn // will be replaced by button handler
        }]
    },
    /**
     * @private
     * Builds grid columns from the model definition, for scaffolding purposes.
     * Please use {@link #Ext.grid.Panel} or {@link #buildConfig} if you want
     * support for create,update and/or destroy!
     *
     * @param {Ext.data.Model|String} model The model class or model name
     * @param {Object} config (optional) Any applicable property of
     * Bancha.scaffold.Grid can be overrided for this call by declaring it
     * here. E.g.:
     *     {
     *         oneStorePerModel: true
     *     }
     * @param {Object} gridListeners the grid listeners array, can be
     *                 augmented by this function
     * @return {Array} Returns an array of Ext.grid.column.* configs
     */
    buildColumns: function (model, config, gridListeners) {
        var columns = [],
            validations, button;
        config = Ext.apply({}, config, Ext.clone(this)); // get all defaults for this call


        // IFDEBUG
        if (!Ext.isDefined(model) || ((Ext.isString(model) && !Ext.ModelManager.isRegistered(model)) && !model.isModel)) {
            Ext.Error.raise({
                plugin: 'Bancha.scaffold',
                msg: 'Bancha Scaffold: Bancha.scaffold.Grid.buildColumns() expected the model or model name as first argument, instead got ' + model + '(of type' + (typeof model) + ')'
            });
        }
        // ENDIF

        if (Ext.isString(model)) {
            // IFDEBUG
            if (!Ext.isDefined(Ext.ModelManager.getModel(model))) {
                Ext.Error.raise({
                    plugin: 'Bancha.scaffold',
                    model: model,
                    msg: 'Bancha Scaffold: First argument for Bancha.scaffold.Grid.buildColumns() is the string "' + model + '", which  is not a valid model class name. Please define a model first (for Bancha users: see Bancha.getModel() and Bancha.createModel())'
                });
            }
            // ENDIF
            model = Ext.ModelManager.getModel(model);
        }

        if(!Ext.isArray(config.exclude)) {
            // IFDEBUG
            Ext.Error.raise({
                plugin: 'Bancha.scaffold',
                model: model,
                msg: 'Bancha Scaffold: When scaffolding a grid panel the exclude property should be an array of field names to exclude.'
            });
            // ENDIF
            config.exclude = [];
        }

        // build all columns
        validations = model.prototype.validations;
        model.prototype.fields.each(function (field) {
            if((!Ext.isArray(config.fields) || config.fields.indexOf(field.name) !== -1) &&
                config.exclude.indexOf(field.name) === -1) {
                columns.push(
                    Bancha.scaffold.Grid.buildColumnConfig(field, model, config, validations, gridListeners));
            }
        });

        // add a destroy button
        if (config.deletable) {
            button = Ext.clone(config.destroyButtonConfig);
            if (button.items[0].handler === Ext.emptyFn) {
                button.items[0].handler = config.onDelete;
            }
            columns.push(button);
        }

        return columns;
    },
    /**
     * @method
     * You can replace this function! The function will be executed before each
     * {@link #buildConfig} as interceptor.
     * @param {Ext.data.Model} model see {@link #buildConfig}
     * @param {Object} config the scaffold full config for this call
     * @param {Object|Undefined} initialPanelConfig see {@link #buildConfig}'s initialPanelConfig property
     * @return {Object|Undefined} object with initial Ext.form.Panel configs
     */
    beforeBuild: function (model, config, initialPanelConfig) {},
    /**
     * @method
     * You can replace this fucntion! This function will be executed after each
     * {@link #buildConfig} as interceptor.
     * @param {Object} gridConfig the just build grid panel config
     * @param {Ext.data.Model} model see {@link #buildConfig}
     * @param {Object} config the scaffold full config for this call
     * @param {Object|Undefined} initialPanelConfig see {@link #buildConfig}'s initialPanelConfig property
     * @return {Object|Undefined} object with final Ext.grid.Panel configs or undefined to use the passed config
     */
    afterBuild: function (gridConfig, model, config, initialPanelConfig) {},
    /**
     * @deprecated Always use the scaffold property on Ext.grid.Panel, this function will undergo some refactoring
     * Builds a grid config from a model definition, for scaffolding purposes.
     * Guesses are made by model field configs and validation rules.
     *
     * @param {Ext.data.Model|String} model The model class or model name
     * @param {Object|False} config (optional) Any property of
     * {@link Bancha.scaffold.Grid} can be overrided for this call by declaring
     * it in this config. E.g
     *      {
     *          columnDefaults: {
     *              width: 200, // force a fixed with
     *          },
     *          onSave: function() {
     *              Ext.MessageBox.alert("Wohoo","You're pressed the save button :)");
     *          },
     *          formConfig: {
     *              textfieldDefaults: {
     *                  minLength: 3
     *              }
     *          }
     *      }
     *
     * You can add editorfield configs to the property formConfig, which will then used as standard
     * {@link Bancha.scaffold.Form} properties for this call.
     * @param {Object} initialPanelConfig (optional) Some additional grid configs which are applied to the config.
     * @return {Object} Returns an Ext.grid.Panel configuration object
     */
    buildConfig: function (/* deprecated, is read from config.target */ignoredModel, config, initialPanelConfig) {
        var gridConfig, modelName, buttons, button, cellEditing, store, scope, listeners;
        config = Ext.apply({}, config, Ext.clone(this)); // get all defaults for this call

        // get the model name and model class
        config.target = Ext.isString(config.target) ? config.target : Ext.ClassManager.getName(config.target);
        var model = Ext.ModelManager.getModel(config.target);

        // call beforeBuild callback
        gridConfig = config.beforeBuild(model, config, initialPanelConfig) || {};

        // basic config
        store = Bancha.scaffold.Util.getStore(model, config);
        listeners = {};
        Ext.apply(gridConfig, {
            store: store,
            columns: this.buildColumns(model, config, listeners),
            listeners: listeners // this is necessary for refreshing after associated stores are loaded
        });

        // add config for editable fields
        if (config.editable) {
            cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 2
            });
            Ext.apply(gridConfig, {
                selType: 'cellmodel',
                plugins: [cellEditing]
            });
        }

        // replace button place holders and build bar
        if(config.buttons && config.buttons.length) {

            scope = {
                getCellEditing: function() {
                    return cellEditing;
                },
                getStore: function() {
                    return store;
                }
            };
            config.buttons = Bancha.scaffold.Util.replaceButtonPlaceHolders(config.buttons, config, scope);

            gridConfig.dockedItems = [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: config.buttons
            }];
        }

        // apply user configs
        if (Ext.isObject(initialPanelConfig)) {
            gridConfig = Ext.apply(gridConfig, initialPanelConfig);
        }

        // the scaffold config of the grid is saved as well
        gridConfig.scaffold = config;

        // return after interceptor
        return config.afterBuild(gridConfig, model, config, initialPanelConfig) || gridConfig;
    }
});
