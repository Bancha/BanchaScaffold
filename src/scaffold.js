/*
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2012 Roland Schuetz
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @package       Bancha.scaffold
 * @copyright     Copyright 2011-2012 Roland Schuetz
 * @link          http://scaffold.banchaproject.org
 * @since         Bancha.scaffold 0.0.1
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha.scaffold v PRECOMPILER_ADD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.banchaproject.org
 */
/*jslint browser: true, vars: true, undef: true, nomen: true, eqeq: false, plusplus: true, bitwise: true, regexp: true, newcap: true, sloppy: true, white: true */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:true, regexp:true, undef:true, trailing:false */
/*global Ext:false, Bancha:false, window:false */



// This file should be separated in three clean singleton classes



/**
 * @class Bancha.scaffold
 * 
 * The Bancha ExtJS 4 Scaffold library helps you easily prototype Ext.grid.Panels and Ext.form.Panels, 
 * helping you creating beautiful prototypes in minutes. And it it completly free and open source!
 * 
 * Example usage:
 *
 *     Ext.create('Ext.grid.Panel',{
 *         scaffold: 'User',
 *         title: 'User Grid',
 *         renderTo: 'gridpanel'
 *     });
 *
 * @singleton
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @docauthor Roland Schuetz <mail@rolandschuetz.at>
 */
Ext.define('Bancha.scaffold', {

    /* Begin Definitions */
    singleton: true,
    requires: ['Ext.form.field.VTypes','Ext.data.validations'],
    
    /**
     * @private
     * @singleton
     * @class Bancha.scaffold.Util
     * Some scaffolding util function
     * 
     * @author Roland Schuetz <mail@rolandschuetz.at>
     * @docauthor Roland Schuetz <mail@rolandschuetz.at>
     */
    Util: {
        /**
         * make the first letter of an String upper case
         * @param {String} str
         * @return {String} str with first letter upper case
         * @member Bancha.scaffold.Util
         */
        toFirstUpper: function (str) {
            if (typeof str !== 'string') {
                return str;
            }
            if (str.length === 1) {
                return str.toUpperCase();
            }
            return str[0].toUpperCase() + str.substr(1);
        },
        /**
         * Capitalizes the first word and turns underscores into spaces and strips a trailing ‚Äú_id‚Äù, if any.  
         * Also it converts camel case by finding upper case letters right after lower case and repalceing the upper case with an space and lower case.  
         * examples:  
         * "user_name"  -> "User name"  
         * "userName"   -> "User name"  
         * "John Smith" -> "John Smith"  
         *
         * @param {String} str
         * @return {String} str transformed string
         * @member Bancha.scaffold.Util
         */
        humanize: function (str) {
            str = str.replace(/_id/g, ''); // delete _id from the string
            str = str.replace(/_/g, ' '); // _ to spaces
            str = str.replace(/([a-z])([A-Z])/g, function (all, first, second) {
                return first + " " + second.toLowerCase();
            }); // convert camel case (only)
            return this.toFirstUpper(str);
        },
        /**
         * DEPRECATED - CURRENTLY NOT USED  
         * This enables the developer to change the default scaffolding functions at any time
         * and the Scaffold Library will always use the current functions, since there are no references
         * @member Bancha.scaffold.Util
         */
        createFacade: function (scopeName, scope, method) {
            // IFDEBUG
            /*
             * totally stupid, but we need a singleton pattern in debug mode here, since
             * jasmine provides us only with VERY little compare options
             */
            this.singletonFns = this.singletonFns || {};
            this.singletonFns[scopeName] = this.singletonFns[scopeName] || {};
            this.singletonFns[scopeName][method] = this.singletonFns[scopeName][method] ||
            function () {
                return scope[method].apply(this, arguments);
            };
            return this.singletonFns[scopeName][method];
            // ENDIF
            /* IFPRODUCTION
            return function() {
            return scope[method].apply(scope,arguments);
            };
            ENDIF */
        }
    },
    /**
     * @class Bancha.scaffold.Grid
     * @singleton
     * 
     * This class is a factory for creating Ext.grid.Panel's. It uses many data from
     * the given model, including field configs and validation rules. 
     * 
     * In most cases you will use our configurations on {@link Ext.grid.Panel}. The
     * simplest usage is:
     *     Ext.create("Ext.grid.Panel", {
     *         scaffold: 'User', // the model name
     *     });
     *
     * A more complex usage example is:
     *     Ext.create("Ext.grid.Panel", {
     *
     *         // basic scaffold configs can be set directly
     *         enableCreate : true,
     *         enableUpdate : true,
     *         enableReset  : true,
     *         enableDestroy: true,
     *     
     *         scaffold: {
     *             // define the model name here
     *             target: 'MyApp.model.User',
     *
     *             // advanced configs can be set here:
     *             columnDefaults: {
     *                 width: 200
     *             },
     *             datecolumnDefaults: {
     *                 format: 'm/d/Y'
     *             },
     *             // use the same store for all grids
     *             oneStorePerModel: true,
     *             // custom onSave function
     *             onSave: function() {
     *                 Ext.MessageBox.alert("Tada","You've pressed the save button");
     *             }
     *         },
     *     
     *         // and add some styling
     *         height   : 350,
     *         width    : 650,
     *         frame    : true,
     *         title    : 'User Grid',
     *         renderTo : 'gridpanel'
     *     });
     *    
     * If enableCreate or enableUpdate is true, this class will use 
     * {@link Bancha.scaffold.Form} to create the editor fields.
     *
     * You have three possible interceptors:  
     *  - beforeBuild      : executed before {@link #buildConfig}  
     *  - guessFieldConfigs: executed after a column config is created, see {@link #guessFieldConfigs}  
     *  - afterBuild       : executed after {@link #buildConfig} created the config
     * 
     * @author Roland Schuetz <mail@rolandschuetz.at>
     * @docauthor Roland Schuetz <mail@rolandschuetz.at>
     */
    Grid: {
        /**
         * @private
         * DEPRECATED - CURRENTLY NOT USED  
         * Shorthand for {@llink Bancha.scaffold.Util#createFacade}
         */
        createFacade: function (method) {
            return Bancha.scaffold.Util.createFacade('Grid', this, method);
        },
        /**
         * @private
         * @property
         * Maps model types with column types and additional configs for prototyping
         */
        fieldToColumnConfigs: {
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
         * @private
         * for separation of concerns, gets/create a store for the grid
         */
        getStore: (function (model, config) {
            this.stores = {};
            var stores = this.stores;

            return function (model, config) {
                var modelName = Ext.ClassManager.getName(model),
                    store;
                if (config.oneStorePerModel && stores[modelName]) {
                    return stores[modelName];
                }

                store = Ext.create(config.storeDefaultClass, Ext.apply({
                    model: modelName
                }, Ext.clone(config.storeDefaults)));

                if (config.oneStorePerModel) {
                    stores[modelName] = store;
                }

                return store;
            };
        }()),
        /**
         * @property {Function|False} guessFieldConfigs Writable function used to guess some default behaviour.
         * Can be set to false to don't guess at all.
         * Default function just hides id columns and makes it uneditable.
         * @param {Object} configs A column config
         * @param {String} modelType A standard model field type like 'string' (also supports 'file' from compability with http://banchaproject.org)
         * @return {Object} Returns an Ext.grid.column.* configuration object
         */
        guessColumnConfigs: function (configs, modelType) {
            if (configs.dataIndex === 'id') {
                configs.hidden = true;
                configs.field = undefined;
            }

            return configs;
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
         * @param {Sring} type The model field type
         * @param {String} columnName (optional) The name of the column
         * @param {Object} defaults (optional) Defaults like numbercolumnDefaults as property of this config.
         * See {@link #buildConfig}'s config property
         * @param {Array} (optional) validations An array of Ext.data.validations of the model
         * @return {Object} Returns an Ext.grid.column.* configuration object
         */
        buildColumnConfig: function (type, columnName, defaults, validations) {
            defaults = defaults || {};
            var column = this.buildDefaultColumnFromModelType(type, defaults),
                enableCreate, enableUpdate;

            // infer name
            if (columnName) {
                column.text = Bancha.scaffold.Util.humanize(columnName);
                column.dataIndex = columnName;
            }

            // add an editor
            enableCreate = (typeof defaults.enableCreate !== 'undefined') ? defaults.enableCreate : this.enableCreate;
            enableUpdate = (typeof defaults.enableUpdate !== 'undefined') ? defaults.enableUpdate : this.enableUpdate;
            if (enableCreate || enableUpdate) {
                column.field = Bancha.scaffold.Form.buildFieldConfig(type, columnName, defaults.formConfig, validations, true);
            }

            // now make some crazy guesses ;)
            if (typeof defaults.guessColumnConfigs === 'function') {
                column = defaults.guessColumnConfigs(column, type);
            }

            return column;
        },
        /**
         * @property
         * Editable function to be called when the create button is pressed.  
         * To change the default scaffolding behaviour just replace this function.  
         *   
         * Default scope is following object:
         *     {  
         *      store:       the grids store  
         *      cellEditing: the grids cell editing plugin  
         *     }
         */
        onCreate: function () { // scope is a config object
            var edit = this.cellEditing,
                grid = edit.grid,
                store = this.store,
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
         * Default scope is the store.
         */
        onSave: function () { // scope is the store
            var valid = true,
                msg = "",
                name, store = this;

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
         * Default scope is the store.
         */
        onReset: function () { // scope is the store
            // reject all changes
            var store = this;
            store.each(function (rec) {
                if (rec.modified) {
                    rec.reject();
                }
                if (rec.phantom) {
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
                name = Ext.getClassName(rec);

            // instantly remove vom ui
            store.remove(rec);

            // sync to server
            // for before-ExtJS 4.1 the callbacks will be ignored, 
            // since they were added in 4.1
            store.sync({
                success: function (record, operation) {

                    Ext.MessageBox.show({
                        title: name + ' record deleted',
                        msg: name + ' record was successfully deleted.',
                        icon: Ext.MessageBox.INFO,
                        buttons: Ext.Msg.OK
                    });
                },
                failure: function (record, operation) {

                    // since it couldn't be deleted, add again
                    store.add(rec);

                    // inform user
                    Ext.MessageBox.show({
                        title: name + ' record could not be deleted',
                        msg: operation.getError() || (name + ' record could not be deleted.'),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            });

        },
        /**
         * @property
         * If true a create button will be added to all scaffolded grids.  
         * See class descrition on how the fields are created.
         */
        enableCreate: true,
        /**
         * @property
         * If true a editor field is added to all columns for scaffolded grids.  
         * See class descrition on how the fields are created.
         */
        enableUpdate: true,
        /**
         * @property
         * If true a delete button is added to all rows for scaffolded grids.
         */
        enableDestroy: true,
        /**
         * @property
         * If true a reset button will be added to all scaffolded grids
         * (only if enableCreate or enableUpdate is true).
         */
        enableReset: true,
        /**
         * @property
         * Default create button config, used if enableCreate is true.  
         * If not defined scope and handler properties will be set by 
         * the build function.
         */
        createButtonConfig: {
            iconCls: 'icon-add',
            text: 'Create'
        },
        /**
         * @property
         * Default save button config, used if enableCreate and/or 
         * enableUpdate are true.  
         * If not defined scope and handler properties will be set by 
         * the build function.
         */
        saveButtonConfig: {
            iconCls: 'icon-save',
            text: 'Save'
        },
        /**
         * @property
         * Default reset button config, used if enableReset is true.  
         * If not defined scope and handler properties will be set by 
         * the build function.
         */
        resetButtonConfig: {
            iconCls: 'icon-reset',
            text: 'Reset'
        },
        /**
         * @property
         * Default last column config, used if enableDestroy is true to render a destroy 
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
         * Builds grid columns from the model definition, for scaffolding purposes.  
         * Please use {@link #Ext.grid.Panel} or {@link #buildConfig} if you want 
         * support for create,update and/or destroy!
         * 
         * @param {Ext.data.Model|String} model The model class or model name
         * @param {Object} config (optional) Any applicable property of 
         * Bancha.scaffold.Grid can be overrided for this call by declaring it
         * here. E.g.:
         *     {
         *         enableDestroy: true
         *     }
         * @return {Array} Returns an array of Ext.grid.column.* configs
         */
        buildColumns: function (model, config) {
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

            validations = model.prototype.validations;
            model.prototype.fields.each(function (field) {
                columns.push(
                Bancha.scaffold.Grid.buildColumnConfig(field.type.type, field.name, config, validations));
            });

            if (config.enableDestroy) {
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
         * @param {Object} {Ext.data.Model} model see {@link #buildConfig}
         * @param {Object} {Object} config see {@link #buildConfig}
         * @param {Object} additionalGridConfig see {@link #buildConfig}
         * @return {Object|undefined} object with initial Ext.form.Panel configs
         */
        beforeBuild: function (model, config, additionalGridConfig) {},
        /**
         * @method
         * You can replace this fucntion! This function will be executed after each 
         * {@link #buildConfig} as interceptor.
         * @param {Object} columnConfig just build grid panel config
         * @param {Object} {Ext.data.Model} model see {@link #buildConfig}
         * @param {Object} {Object} config (optional) see {@link #buildConfig}
         * @param {Object} additionalGridConfig (optional) see {@link #buildConfig}
         * @return {Object|undefined} object with final Ext.grid.Panel configs
         */
        afterBuild: function (columnConfig, model, config, additionalGridConfig) {},
        /**
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
         *          enableUpdate: true,
         *          formConfig: {
         *              textfieldDefaults: {
         *                  minLength: 3
         *              }
         *          }
         *      }
         *  
         * You can add editorfield configs to the property formConfig, which will then used as standard
         * {@link Bancha.scaffold.Form} properties for this call.
         * @param {Object} additionalGridConfig (optional) Some additional grid configs which are applied to the config.
         * @return {Object} Returns an Ext.grid.Panel configuration object
         */
        buildConfig: function (model, config, additionalGridConfig) {
            var gridConfig, modelName, buttons, button, cellEditing, store;
            config = Ext.apply({}, config, Ext.clone(this)); // get all defaults for this call

            // define model and modelName
            if (Ext.isString(model)) {
                modelName = model;
                model = Ext.ClassManager.get(modelName);
            } else {
                modelName = Ext.getClassName(model);
            }
            config.target = modelName;

            // call beforeBuild callback
            gridConfig = config.beforeBuild(model, config, additionalGridConfig) || {};

            // basic config
            store = config.getStore(model, config);
            Ext.apply(gridConfig, {
                store: store,
                columns: this.buildColumns(model, config)
            });

            // add config for editable fields
            if (config.enableCreate || config.enableUpdate) {
                cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 2
                });
                Ext.apply(gridConfig, {
                    selType: 'cellmodel',
                    plugins: [cellEditing]
                });
            }

            // add buttons
            if (config.enableCreate || config.enableUpdate) {
                buttons = ['->'];

                if (config.enableCreate) {
                    button = Ext.apply(config.createButtonConfig, {
                        scope: {
                            cellEditing: cellEditing,
                            store: store
                        },
                        handler: config.onCreate
                    });
                    buttons.push(button);
                }

                if (config.enableReset) {
                    button = Ext.apply(config.resetButtonConfig, {
                        scope: store,
                        handler: config.onReset
                    });
                    buttons.push(button);
                }

                // save is used for create and update
                button = Ext.apply(config.saveButtonConfig, {
                    scope: store,
                    handler: config.onSave
                });
                buttons.push(button);

                gridConfig.dockedItems = [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    items: buttons
                }];
            }

            // apply user configs
            if (Ext.isObject(additionalGridConfig)) {
                gridConfig = Ext.apply(gridConfig, additionalGridConfig);
            }

            // the scaffold config of the grid is saved as well
            gridConfig.scaffold = config;

            // always force that the basic scaffold configs are set on the grid config
            gridConfig.enableCreate = config.enableCreate;
            gridConfig.enableUpdate = config.enableUpdate;
            gridConfig.enableReset = config.enableReset;
            gridConfig.enableDestroy = config.enableDestroy;

            // return after interceptor
            return config.afterBuild(gridConfig, model, config, additionalGridConfig) || gridConfig;
        }
    },
    //eo Grid 
    /**
     * @class Bancha.scaffold.Form
     * @singleton
     * 
     * This class is a factory for creating Ext.form.Panel's. It uses many data from
     * the given model, including field configs and validation rules.  
     * 
     * In most cases you will use our configurations on {@link Ext.form.Panel}. The 
     * simplest usage is:
     *     Ext.create("Ext.form.Panel", {
     *         scaffold: 'User', // the model name
     *     });
     * 
     * A more complex usage example:
     *     Ext.create("Ext.form.Panel", {
     *
     *         // basic scaffold configs can be set directly
     *         enableReset: true,
     *         // you can also define which record should be loaded for editing
     *         scaffoldLoadRecord: 3,
     *     
     *         scaffold: {
     *             // define the model name here
     *             target: 'MyApp.model.User',
     * 
     *             // advanced configs can be set here:
     *             textfieldDefaults: {
     *                 emptyText: 'Please fill this out'
     *             },
     *             datefieldDefaults: {
     *                 format: 'm/d/Y'
     *             },
     *             onSave: function() {
     *                 Ext.MessageBox.alert("Tada","You've pressed the form save button");
     *             }
     *         },
     *     
     *         // and add some styling
     *         height: 350,
     *         width: 650,
     *         frame:true,
     *         title: 'Form Panel',
     *         renderTo: 'formpanel',
     *         bodyStyle:'padding:5px 5px 0',
     *         fieldDefaults: {
     *             msgTarget: 'side',
     *             labelWidth: 75
     *         },
     *         defaults: {
     *             anchor: '100%'
     *         }
     *     });
     *
     * It currently creates fields for:  
     *  - string  
     *  - integer  
     *  - float (precision is read from metadata)  
     *  - boolean (checkboxes)  
     *  - date  
     * 
     * It's recognizing following validation rules on the model to add validations
     * to the form fields:  
     *  - format  
     *  - file  
     *  - length  
     *  - numberformat  
     *  - presence  
     *
     * You have three possible interceptors:  
     *  - beforeBuild      : executed before {@link #buildConfig}  
     *  - guessFieldConfigs: executed after a field config is created, see {@link #guessFieldConfigs}  
     *  - afterBuild       : executed after {@link #buildConfig} created the config  
     * 
     * @author Roland Schuetz <mail@rolandschuetz.at>
     * @docauthor Roland Schuetz <mail@rolandschuetz.at>
     */
    Form: {
        /**
         * @private
         * @property
         * Maps model field configs with field types and additional configs
         */
        fieldToFieldConfigs: {
            'string': {
                xtype: 'textfield'
            },
            'int': {
                xtype: 'numberfield',
                allowDecimals: false
            },
            'float': {
                xtype: 'numberfield'
            },
            'boolean': {
                xtype: 'checkboxfield'
            },
            'bool': {
                xtype: 'checkboxfield'
            },
            // a synonym
            'date': {
                xtype: 'datefield'
            }
            // TODO OPTIMIZE Add combobox support
        },
        /**
         * @property
         * This config is applied to each scaffolded form field
         */
        fieldDefaults: {},
        /**
         * @property
         * This config is applied to each scaffolded Ext.form.field.Date
         */
        datefieldDefaults: {},
        /**
         * @property
         * This config is applied to each scaffolded Ext.form.field.File
         */
        fileuploadfieldDefaults: {
            emptyText: 'Select an file'
        },
        /**
         * @property
         * This config is applied to each scaffolded Ext.form.field.Text
         */
        textfieldDefaults: {},
        /**
         * @property
         * This config is applied to each scaffolded Ext.form.field.Number
         */
        numberfieldDefaults: {},
        /**
         * @property
         * This config is applied to each scaffolded Ext.form.field.Checkbox
         */
        checkboxfieldDefaults: {
            uncheckedValue: false
        },
        /**
         * @property {Function|False} guessFieldConfigs Writable function used to guess some default behaviour.
         * Can be set to false to don't guess at all.  
         * Default function just hides id fields.
         * @param {Object} configs a form field config
         * @param {String} modelType A standard model field type like 'string' (also supports 'file' from compability with http://banchaproject.org)
         * @return {Object} Returns a field config
         */
        guessFieldConfigs: function (configs, modelType) {
            if (configs.name === 'id') {
                configs.xtype = 'hiddenfield';
            }

            return configs;
        },
        /**
         * @private
         * Analysis the validation rules for a field and adds validation rules to the field config.
         * For what is supported see {@link Bancha.scaffold.Form}
         * @param {Object} field A Ext.form.field.* config
         * @param {Array} validations An array of Ext.data.validations of the model
         * @param {Object} config A Bancha.scaffold.Form config
         * @return {Object} Returns a Ext.form.field.* config
         */
        addValidationRuleConfigs: (function () {
            /*
             * closure these in so they are only created once.
             * we first create the regex and then get the string of them to not have to delete the backslashes 
             * have a bit cleaner code. It doesn't matter for performance cause it's done only once
             */
            var alpha = /^[a-zA-Z_]+$/.toString(),
                alphanum = /^[a-zA-Z0-9_]+$/.toString(),
                email = /^(\w+)([\-+.][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/.toString(),
                url = /(((^https?)|(^ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i.toString();

            return function (field, validations, config) {
                var name = field.name,
                    // it's used so often, make a shortcut
                    msgAddition;

                Ext.Array.forEach(validations, function (rule) {
                    if (rule.name !== name) {
                        return;
                    }
                    switch (rule.type) {
                    case 'presence':
                        field.allowBlank = false;
                        break;
                    case 'length':
                        // IFDEBUG
                        // length validation works only only on textfields
                        if (field.xtype !== 'textfield') {
                            msgAddition = (field.xtype === 'numberfield') ? 'Use the rule numberformat to force minimal and maximal values.' : '';
                            Ext.Error.raise({
                                plugin: 'Bancha.scaffold',
                                msg: 'Bancha Scaffold: The model has a validation rule length for the field ' + name + ', but this field is of type ' + field.xtype + ', so the rule makes no sense. ' + msgAddition
                            });
                        }
                        // ENDIF
                        if (field.xtype === 'textfield') {
                            if (Ext.isDefined(rule.min)) {
                                field.minLength = rule.min;
                            }
                            if (Ext.isDefined(rule.max)) {
                                field.maxLength = rule.max;
                            }
                        }
                        break;
                    case 'format':
                        // IFDEBUG
                        // length validation works only only on textfields
                        if (field.xtype !== 'textfield') {
                            Ext.Error.raise({
                                plugin: 'Bancha.scaffold',
                                msg: 'Bancha Scaffold: The model has a validation rule format for the field ' + name + ', but this field is of type ' + field.xtype + ', so the rule makes no sense.'
                            });
                        }
                        // ENDIF
                        switch (rule.matcher.toString()) {
                        case alpha:
                            field.vtype = 'alpha';
                            break;
                        case alphanum:
                            field.vtype = 'alphanum';
                            break;
                        case email:
                            field.vtype = 'email';
                            break;
                        case url:
                            field.vtype = 'url';
                            break;
                        default:
                            // IFDEBUG
                            if (window.console && Ext.isFunction(window.console.warn)) {
                                window.console.warn('Bancha Scaffold: Currently Bancha.scaffold.Form only recognizes the model Ext.data.validations format rules ' + 'with the matcher regex of Ext.form.field.VType alpha, alphanum, email and url. This rule with matcher ' + rule.matcher.toString() + ' will just be ignored.');
                            }
                            // ENDIF
                            break;
                        }
                        break;
                    case 'numberformat':
                        // numberformat validation works only only on numberfields
                        // IFDEBUG
                        if (field.xtype !== 'numberfield') {
                            Ext.Error.raise({
                                plugin: 'Bancha.scaffold',
                                msg: 'Bancha Scaffold: The model has a validation rule numberformat for the field ' + name + ', but this field is of type ' + field.xtype + ', so the rule makes no sense. A numberfield is expected.'
                            });
                        }
                        // ENDIF
                        if (field.xtype === 'numberfield') {
                            if (Ext.isDefined(rule.min)) {
                                field.minValue = rule.min;
                            }
                            if (Ext.isDefined(rule.max)) {
                                field.maxValue = rule.max;
                            }
                            if (Ext.isDefined(rule.precision)) {
                                field.decimalPrecision = rule.precision;
                            }
                        }
                        break;
                    case 'file':
                        // make the field a fileuploadfield
                        field.xtype = 'fileuploadfield';
                        Ext.apply(field, config.fileuploadfieldDefaults);

                        // add validation rules
                        if (Ext.isString(rule.extension)) {
                            rule.extension = [rule.extension];
                        }
                        if (Ext.isArray(rule.extension)) {
                            field.vtype = 'fileExtension';
                            field.validExtensions = rule.extension;
                        }
                        break;
                    default:
                        // IFDEBUG
                        if (window.console && Ext.isFunction(window.console.warn)) {
                            window.console.warn("Bancha Scaffold: Could not recognize rule " + Ext.encode(rule) + ' when trying to create a form field field.');
                        }
                        // ENDIF
                        break;
                    }
                    // TODO OPTIMIZE Also include inclusion and exclusion
                }); //eo forEach
                return field;
            }; //eo return fn
        }()),
        /**
         * @private
         * Builds a field with all defaults defined here
         * @param {Sring} type The model field type
         * @param {Object} defaults (optional) Defaults like textfieldDefaults as property of this config. 
         * See {@link #buildConfig}'s config property
         * @return {Object} Returns a Ext.form.field.* config
         */
        buildDefaultFieldFromModelType: function (type, defaults) {
            defaults = defaults || {};
            var field = Ext.clone(this.fieldToFieldConfigs[type]),
                fieldDefaults = Ext.clone(defaults.fieldDefaults || this.fieldDefaults),
                // make a new object of defaults
                fieldTypeDefaults = Ext.clone(defaults[field.xtype + 'Defaults'] || this[field.xtype + 'Defaults']);
            return Ext.apply(fieldDefaults, field, fieldTypeDefaults);
        },
        /**
         * @private
         * Creates a Ext.form.Field config from an model field type
         * @param {Sring} type The model field type
         * @param {String} fieldName (optional) the name of the field, neccessary for applying validation rules
         * @param {Object} defaults (optional) Defaults like textfieldDefaults as 
         *                 property of this config. See {@link #buildConfig}'s config property
         * @param {Array} validations (optional) An array of Ext.data.validations of the model
         * @param {Object} isEditorfield (optional) True to don't add field label (usefull e.g. in an editor grid)
         * @return {Object} Returns a field config
         */
        buildFieldConfig: function (type, fieldName, defaults, validations, isEditorfield) {
            defaults = Ext.applyIf({}, defaults, Ext.clone(this));
            var field = this.buildDefaultFieldFromModelType(type, defaults);

            // infer name
            field.name = fieldName;
            if (!isEditorfield) {
                field.fieldLabel = Bancha.scaffold.Util.humanize(fieldName);
            }

            // add some additional validation rules from model validation rules
            if (Ext.isDefined(validations) && validations.length) {
                field = this.addValidationRuleConfigs(field, validations, defaults);
            }

            // now make some crazy guesses ;)
            if (typeof defaults.guessFieldConfigs === 'function') {
                field = defaults.guessFieldConfigs(field, type);
            }

            // fileuploads are currently not siupported in editor fields (ext doesn't render them usable)
            if (isEditorfield && field.xtype === 'fileuploadfield') {
                field = undefined;
            }

            return field;
        },
        /**
         * @property
         * Editable function to be called when the save button is pressed.  
         * To change the default scaffolding behaviour just replace this function.  
         *   
         * The default scope provides two functions:  
         *  - this.getPanel() to get the form panel  
         *  - this.getForm() to get the basic form
         */
        onSave: function () {
            var form = this.getForm(),
                msg;
            if (form.isValid()) {
                msg = form.hasUpload() ? 'Uploading files...' : 'Saving data..';
                form.submit({
                    waitMsg: msg,
                    success: function (form, action) {
                        Ext.MessageBox.alert('Success', action.result.msg || 'Successfully saved data.');
                    },
                    failure: function (form, action) {
                        Ext.MessageBox.alert('Failed', action.result.msg || 'Could not save data, unknown error.');
                    }
                });
            }
        },
        /**
         * @property
         * Editable function to be called when the reset button is pressed.  
         * To change the default scaffolding behaviour just replace this function.  
         *   
         * The default scope provides two functions:  
         *  - this.getPanel() to get the form panel  
         *  - this.getForm() to get the basic form
         */
        onReset: function () {
            this.getForm().reset();
        },
        /**
         * @property
         * If true a reset button will be added to all scaffolded form (Default: true)
         */
        enableReset: true,
        /**
         * @property
         * Default save button config.  
         * If not defined scope and handler properties will be set by 
         * the build function.
         */
        saveButtonConfig: {
            iconCls: 'icon-save',
            text: 'Save',
            formBind: true
        },
        /**
         * @property
         * Default reset button config, used if enableReset is true.
         * If not defined scope and handler properties will be set by 
         * the build function.
         */
        resetButtonConfig: {
            iconCls: 'icon-reset',
            text: 'Reset'
        },
        /**
         * Build the form api config, used only by buildConfig()
         * just for separation of concern, since this is the only 
         * part which deals with proxies
         */
        buildApiConfig: function (model,initialApi) {

            if(Bancha.getModel) {
                // the user is using the full Bancha stack
                return this.buildBanchaApiConfig(model,initialApi);
            } else{

                if(initialApi) {
                    // just use the configured api
                    return initialApi;
                }
                
                // IFDEBUG
                // warn the user that we can just guess part of the api
                if (window.console && Ext.isFunction(window.console.warn)) {
                    window.console.warn([
                        'Bancha Scaffold: You have not defined any form api. If you want',
                        'Bancha Scaffold to guess it, please define Bancha.scaffold.Form.',
                        'buildApiConfig. Bancha Scaffold can only try to get the load ',
                        'function from the model proxy, but not the submit function.'
                        ].join(''));
                }
                // ENDIF
            }

            // try to find the proxy configuration for load
            var proxy = model.getProxy(),
                load = proxy && proxy.api && proxy.api.read ? proxy.api.read :
                        (proxy && proxy.directFn ? proxy.directFn : undefined);

            return load ? {load: load} : undefined;
        },

        /**
         * @private
         * This function is used if you are using Bancha.scaffold.Form with 
         * the full Bancha library. It will automatically find all 
         * api configurations
         */
         buildBanchaApiConfig: function(model, initialApi) {
            initialApi = initialApi || {};

            // IFDEBUG
            if (!Bancha.initialized) {
                // the user is using Bancha, but hasn't initialized yet
                Ext.Error.raise({
                    plugin: 'Bancha.scaffold',
                    msg: 'Bancha Scaffold: Bancha is not yet initalized, please init before using Bancha.scaffold.Form.buildConfig().'
                });
            }
            // ENDIF

            var modelName = Ext.ClassManager.getName(model),
                stubName = modelName.substr(Bancha.modelNamespace.length + 1),
                stub = Bancha.getStubsNamespace()[stubName];

            // IFDEBUG
            if (!Ext.isDefined(stub)) {
                Ext.Error.raise({
                    plugin: 'Bancha.scaffold',
                    msg: 'Bancha Scaffold: Bancha.scaffold.Form.buildConfig() expects an remotable bancha model, but got an "normal" model or something else'
                });
            }
            // ENDIF

            return {
                // The server-side method to call for load() requests
                load: initialApi.read || stub.read,
                // as first and only param you must add data: {id: id} when loading
                // The server-side must mark the submit handler as a 'formHandler'
                submit: initialApi.submit || stub.submit
            };
        },
        /**
         * You can replace this function! The function will be executed before each 
         * {@link #buildConfig} as interceptor. 
         * @param {Object} {Ext.data.Model} model see {@link #buildConfig}
         * @param {Object} {Number|String} recordId see {@link #buildConfig}
         * @param {Object} {Object} config see {@link #buildConfig}
         * @param {Object} additionalFormConfig see {@link #buildConfig}
         * @return {Object|undefined} object with initial Ext.form.Panel configs
         */
        beforeBuild: function (model, recordId, config, additionalFormConfig) {},
        /**
         * You can replace this function! This function will be executed after each 
         * {@link #buildConfig} as interceptor
         * @param {Object} formConfig just build form panel config
         * @param {Object} {Ext.data.Model|String} model see {@link #buildConfig}
         * @param {Object} {Number|String} recordId (optional) see {@link #buildConfig}
         * @param {Object} {Object} config (optional) see {@link #buildConfig}
         * @param {Object} additionalFormConfig (optional) see {@link #buildConfig}
         * @return {Object|undefined} object with final Ext.form.Panel configs
         */
        afterBuild: function (formConfig, model, recordId, config, additionalFormConfig) {},
        /**
         * You only need this is you're adding additional buttoms to the form inside the
         * afterBuild function.  
         * Since the form panel doesn't give us an useful scope to get the form panel,
         * this function will create an proper scope. The scope provides two functions:  
         *  - this.getPanel() to get the form panel  
         *  - this.getForm() to get the basic form  
         * 
         * @param {Function} handler A button handler function to apply the scope to
         * @param {Number|String} id The form panel id
         */
        buildButtonScope: (function () {
            var scopePrototype = {
                getPanel: function () {
                    return this.panel || Ext.ComponentManager.get(this.id);
                },
                getForm: function () {
                    return this.form || this.getPanel().getForm();
                }
            };

            return function (id) {
                return Ext.apply({
                    id: id
                }, scopePrototype);
            };
        }()),
        /**
         * Builds form configs from the metadata, for scaffolding purposes.  
         * By default data is loaded from the server if an id is supplied and 
         * onSvae it pushed the data to the server.  
         *  
         * Guesses are made by model field configs and validation rules. 
         * @param {Ext.data.Model|String} model the model class or model name
         * @param {Number|String|False} recordId (optional) Record id of an row to load 
         * data from server, false to don't load anything (for creating new rows)
         * @param {Object|False} config (optional) Any property of 
         * {@link Bancha.scaffold.Form} can be overrided for this call by declaring it 
         * here. E.g.:
         *      {
         *          fieldDefaults: {
         *              disabled: true; // disable all fields by default
         *          },
         *          onSave: function() {
         *              Ext.MessageBox.alert("Wohoo","You're pressed the save button :)");
         *          }
         *      }
         *
         * If you don't define an id here it will be created and can not be changed anymore afterwards.
         *
         * @param {Object} additionalFormConfig (optional) Some additional Ext.form.Panel 
         * configs which are applied to the config
         * @return {Object} object with Ext.form.Panel configs
         */
        buildConfig: function (model, recordId, config, additionalFormConfig) {
            var fields = [],
                formConfig, id, validations, buttonScope, button, buttons, loadFn;
            config = Ext.apply({}, config, Ext.clone(this)); // get all defaults for this call
            additionalFormConfig = additionalFormConfig || {};

            // add model and recordId to config
            config.target = Ext.isString(model) ? model : Ext.ClassManager.getName(model);
            config.recordId = Ext.isDefined(recordId) ? recordId : config.recordId;

            // IFDEBUG
            if (!Ext.isDefined(model)) {
                Ext.Error.raise({
                    plugin: 'Bancha.scaffold',
                    msg: 'Bancha Scaffold: Bancha.scaffold.Form.buildConfig() expected the model or model name as first argument, instead got undefined'
                });
            }
            // ENDIF
            if (Ext.isString(model)) {
                // IFDEBUG
                if (!Ext.isDefined(Ext.ModelManager.getModel(model))) {
                    Ext.Error.raise({
                        plugin: 'Bancha.scaffold',
                        model: model,
                        msg: 'Bancha Scaffold: First argument for Bancha.scaffold.Form.buildConfig() is the string "' + model + '", which  is not a valid model class name. Please define a model first (for Bancha users: see Bancha.getModel() and Bancha.createModel())'
                    });
                }
                // ENDIF
                model = Ext.ModelManager.getModel(model);
            }
            // IFDEBUG
            if (!model.prototype || !model.prototype.isModel) {
                Ext.Error.raise({
                    plugin: 'Bancha.scaffold',
                    model: model,
                    msg: 'Bancha Scaffold: First argument for Bancha.scaffold.Form.buildConfig() is the string "' + model + '", which  is not a valid model class name. Please define a model first (for Bancha users: see Bancha.getModel() and Bancha.createModel())'
                });
            }
            // ENDIF

            // build initial config
            formConfig = config.beforeBuild(model, recordId, config, additionalFormConfig) || {};

            // create all fields
            validations = model.prototype.validations;
            model.prototype.fields.each(function (field) {
                fields.push(
                Bancha.scaffold.Form.buildFieldConfig(field.type.type, field.name, config, validations));
            });

            // probably not neccessary in extjs4!
            // if one of the fields is a fileupload, mark the form
            Ext.each(fields, function (field) {
                if (field.xtype === 'fileuploadfield') {
                    formConfig.isUpload = true;
                    formConfig.fileUpload = true;
                    return false;
                }
                return true;
            });

            // for scoping reason we have to force an id here
            id = additionalFormConfig.id || Ext.id(null, 'formpanel-');
            formConfig.id = id;

            // build buttons
            buttons = [];
            buttonScope = this.buildButtonScope(id);
            // reset button
            if (config.enableReset) {
                button = Ext.apply(config.resetButtonConfig, {
                    scope: buttonScope,
                    handler: config.onReset
                });
                buttons.push(button);
            }
            // save button
            button = Ext.apply(config.saveButtonConfig, {
                scope: buttonScope,
                handler: config.onSave
            });
            buttons.push(button);

            // extend formConfig
            Ext.apply(formConfig, additionalFormConfig, {
                id: id,
                api: this.buildApiConfig(model,additionalFormConfig.api),
                paramOrder: ['data'],
                items: fields,
                buttons: buttons
            });

            // the scaffold config of the grid is saved as well
            formConfig.scaffold = config;

            // always force that the basic scaffold configs are set on the grid config
            formConfig.enableReset = config.enableReset;
            formConfig.scaffoldLoadRecord = config.recordId;


            // autoload the record
            if (Ext.isDefined(recordId) && recordId !== false) {
                formConfig.listeners = formConfig.listeners || {};
                // if there's already a function, batch them
                loadFn = function (component, options) {
                    component.load({
                        params: {
                            data: {
                                data: {
                                    id: recordId
                                }
                            } // bancha expects it this way
                        }
                    });
                };
                if (formConfig.listeners.afterrender) {
                    formConfig.listeners.afterrender = Ext.Function.createSequence(formConfig.listeners.afterrender, loadFn);
                } else {
                    formConfig.listeners.afterrender = loadFn;
                }
            }

            // return after interceptor
            return config.afterBuild(formConfig, model, recordId, config, additionalFormConfig) || formConfig;
        }
    } //eo Form
}); //eo scaffold

// eof
