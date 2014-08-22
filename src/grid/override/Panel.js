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
 * @since         Bancha Scaffold v 0.3.0
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha Scaffold v PRECOMPILER_ADD_BANCHA_SCAFFOLD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.bancha.io
 */

/**
 * @private
 * @class Bancha.scaffold.grid.override.Panel
 *
 * This override adds support for defining a scaffold config in a gridpanel
 * configuration.
 *
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @docauthor Roland Schuetz <mail@rolandschuetz.at>
 */
Ext.define('Bancha.scaffold.grid.override.Panel', {
    requires: [
        'Ext.grid.Panel',
        'Bancha.scaffold.form.Config',
        'Bancha.scaffold.grid.Config',
        'Bancha.scaffold.data.Validators',
        'Bancha.scaffold.form.field.override.VTypes',
        'Bancha.scaffold.Util'
    ]
}, function() {

    /**
     * @class Ext.grid.Panel
     * **This is only available inside Ext JS.**
     *
     * After requiring *'Bancha.scaffold.grid.override.Panel'*, grid panels have
     * an additional scaffold configuration.
     *
     * The simplest usage is:
     *
     *     Ext.create("Ext.grid.Panel", {
     *         scaffold: 'MyApp.model.User', // the model name
     *     });
     *
     * A more complex usage example is:
     *
     *     Ext.create("Ext.grid.Panel", {
     *
     *         // for more configurations
     *         scaffold: {
     *
     *             // define the model name here
     *             target: 'MyApp.model.User',
     *
     *             // enable full CRUD on the grid (default)
     *             deletable: true,
     *             buttons: ['->','create','reset','save'],
     *
     *
     *             // and some more advanced configs
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
     *             },
     *             formConfig: {
     *                 textfieldDefaults: {
     *                     minLength: 3
     *                 }
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
     * If the editable property is true, a {@link Bancha.scaffold.form.Config}
     * config is used to create the editor fields.
     *
     * You have three possible interceptors:
     *
     *  - {@link Bancha.scaffold.form.Config#cfg-beforeBuild}         : executed before the config is build
     *  - {@link Bancha.scaffold.form.Config#cfg-transformFieldConfig}: executed after a field config is created
     *  - {@link Bancha.scaffold.form.Config#cfg-afterBuild}          : executed after the config is created
     *
     * @author Roland Schuetz <mail@rolandschuetz.at>
     * @docauthor Roland Schuetz <mail@rolandschuetz.at>
     */
    Ext.apply(Ext.grid.Panel, {
        /**
         * @cfg {Bancha.scaffold.grid.Config|Ext.data.Model|Object|String|False} scaffold
         *
         * The simplest configuration is to set a model class or model name as scaffold
         * config. All fields, validation rules and other configurations are taken from
         * this model.
         *
         * For more complex configurations you can set a {@link Bancha.scaffold.grid.Config}
         * config or instance. This config must have the model name defined as *target*
         * config. Any property from {@link Bancha.scaffold.grid.Config} can be defined here.
         */
        /**
         * @property {Bancha.scaffold.grid.Config|False} scaffold
         * If this panel was scaffolded, all initial configs are stored here, otherwise false.
         */
        scaffold: false
    });

    // add scaffolding support
    Ext.override(Ext.grid.Panel, {
        initComponent: function () {
            var isModel, config;

            if(this.scaffold) {
                // check is the scaffold config is a model class or string
                isModel = Ext.isString(this.scaffold) || Bancha.scaffold.Util.isModel(this.scaffold);

                // if there's a model or config object, transform to config class
                // normally we would use this.scaffold.isInstance instead of $className, but that was introduced in Ext JS 4.1
                if (isModel || (Ext.isObject(this.scaffold) && !this.scaffold.$className)) {
                    this.scaffold.triggeredFrom = 'Ext.grid.Panel';
                    this.scaffold = Ext.create('Bancha.scaffold.grid.Config', this.scaffold);
                }

                // apply scaffolding
                config = Ext.grid.Panel.buildConfig(this.scaffold, this.initialConfig);
                Ext.apply(this, config);
                Ext.apply(this.initialConfig, config);
            }

            // continue with standard behaviour
            this.callOverridden();
        },
        statics: {
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
             * @private
             * @property {Function} internalTransformColumnConfig
             * This function just hides id columns and makes it uneditable.
             * @param {Object} columnConfig the column config to transform
             * @param {String} modelType A standard model field type like 'string'
             * (also supports 'file' for compability with http://bancha.io)
             * @return {Object} Returns an Ext.grid.column.* configuration object
             */
            internalTransformColumnConfig: function (columnConfig, modelType) {
                if (columnConfig.dataIndex === 'id') {
                    columnConfig.hidden = true;
                    columnConfig.editor = undefined;
                }

                return columnConfig;
            },
            /**
             * @private
             * Builds a column with all defaults defined here
             * @param {String} type The model field type
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
             * @param {String}                       field         The model field
             * @param {Bancha.scaffold.grid.Config} config        The grid config object
             * @param {Object}                      gridListeners The grid listeners array, can be augmented by this function
             * @param {Array}                       validations   (optional) An array of Ext.data.validations of the model
             * @return {Object}                                   Returns an Ext.grid.column.* configuration object
             */
            buildColumnConfig: function (field, config, validations, gridListeners) {
                var fieldType = Ext.versions.extjs.major === 5 ? field.type : field.type.type,
                    column = this.buildDefaultColumnFromModelType(fieldType, config),
                    model = config.target,
                    associatedModel,
                    store,
                    fieldName;

                // infer name
                if (field.name) {
                    column.text = Bancha.scaffold.Util.humanize(field.name);
                    column.dataIndex = field.name;
                }

                // check for associations
                associatedModel = Bancha.scaffold.Util.getBelongsToModel(field, model);
                if(associatedModel) {
                    // load the store
                    store = Bancha.scaffold.Util.getStore(associatedModel, config);
                    // calculate the field name only once per column
                    fieldName = Bancha.scaffold.Util.getDisplayFieldName(associatedModel);

                    // build a renderer
                    column.renderer = function(id) {
                        var rec = store.getById(id);

                        // display either the found record name or Unknown
                        return rec ? rec.get(fieldName) : (Bancha.t ? Bancha.t('Unknown') : 'Unknown');
                    };

                    // For Ext JS 5, update after the id was changed
                    column.updater = function(cell, value, record, view) {
                        var name = column.renderer(value);
                        Ext.fly(cell).child('div').setHtml(name);
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
                    // build the editor field
                    Ext.syncRequire([
                        'Ext.form.Panel',
                        'Bancha.scaffold.form.override.Panel'
                    ]);
                    column.editor = Ext.form.Panel.buildFieldConfig(field, config.formConfig, validations, true);

                    if(column.editor) {
                        // if this should have an editor field
                        // now make custom field transforms
                        column.editor = Ext.form.Panel.internalTransformFieldConfig(column.editor, fieldType);
                        if (typeof config.formConfig.transformFieldConfig === 'function') {
                            column.editor = config.formConfig.transformFieldConfig(column.editor, fieldType);
                        }
                    }
                }

                // now make custom transforms
                column = Ext.grid.Panel.internalTransformColumnConfig(column, fieldType);
                if (typeof config.transformColumnConfig === 'function') {
                    column = config.transformColumnConfig(column, fieldType);
                }

                return column;
            },
            /**
             * @private
             * Builds grid columns from the model definition, for scaffolding purposes.
             * This does not unclude the support for create, update and/or destroy!
             *
             * @param {Bancha.scaffold.grid.Config} config        The grid config
             * @param {Object}                      gridListeners The grid listeners array, can be augmented by this function
             * @return {Array}                                    Returns an array of Ext.grid.column.* configs
             */
            buildColumns: function (config, gridListeners) {
                var columns = [],
                    model = config.target,
                    me = this,
                    prototypeFieldKeys,
                    fieldNames,
                    validations,
                    isExtJS5,
                    button;

                if(!Ext.isArray(config.exclude)) {
                    //<debug>
                    Ext.Error.raise({
                        plugin: 'Bancha Scaffold',
                        model: model,
                        msg: [
                            'Bancha Scaffold: When scaffolding a grid panel the exclude ',
                            'property should be an array of field names to exclude.'
                        ].join('')
                    });
                    //</debug>
                    config.exclude = [];
                }

                // in Firefox fields.keys is a native function with Ext JS 4
                prototypeFieldKeys = typeof model.prototype.fields.keys === 'function' ? false : model.prototype.fields.keys;

                // if there is a fields config, use this for ordering
                // Otherwise use fields.keys for Sencha Touch and Ext JS 4
                fieldNames = config.fields || prototypeFieldKeys || Ext.Object.getKeys(model.fieldsMap);

                // build all columns
                validations = model.prototype.validations || model.validators; // ST & Ext JS 4 || Ext JS 5
                isExtJS5 = Ext.versions.extjs.major === 5;
                Ext.each(fieldNames, function(fieldName) {
                    if(Ext.Array.indexOf(config.exclude, fieldName) === -1) { // if not excluded
                        var field = isExtJS5 ? model.getField(fieldName) : model.prototype.fields.getByKey(fieldName);
                        columns.push(
                            me.buildColumnConfig(field, config, validations, gridListeners)
                        );
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
             * @private
             * Builds a grid config from a model definition, for scaffolding purposes.
             * Guesses are made by model field configs and validation rules.
             *
             * @param {Ext.data.Model|String}       model              The model class or model name
             * @param {Bancha.scaffold.grid.Config} config             The grid config
             * @param {Object}                      initialPanelConfig (optional) Some additional grid panel configs
             * @return {Object}                                        Returns an Ext.grid.Panel configuration object
             */
            buildConfig: function (config, initialPanelConfig) {
                initialPanelConfig = initialPanelConfig || {};
                var model = Bancha.scaffold.Util.getModel(config.target),
                    gridConfig, cellEditing, store, scope, listeners;

                //<debug>
                if(!config.$className) { // normally we would use config.isInstance here, but that was introduced in Ext JS 4.1
                    Ext.Error.raise({
                        plugin: 'Bancha Scaffold',
                        msg: [
                            'Bancha Scaffold: Ext.grid.Panel#buildConfig expects a object ',
                            'of class Bancha.scaffold.form.Config.'
                        ].join('')
                    });
                }
                //</debug>

                // call beforeBuild callback
                gridConfig = config.beforeBuild(model, config, initialPanelConfig) || {};

                // basic config
                store = Bancha.scaffold.Util.getStore(model, config);
                listeners = {};
                Ext.apply(gridConfig, {
                    store: store,
                    columns: this.buildColumns(config, listeners),
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

                // replace button place holders and build toolbar
                if(config.buttons && config.buttons.length) {

                    scope = {
                        getCellEditing: function() {
                            return cellEditing;
                        },
                        getStore: function() {
                            return store;
                        }
                    };

                    // build buttons
                    if(!config.hasOwnProperty('buttons')) {
                        // this a default, so clone before instanciating
                        // See also test case "should clone all configs, so that you
                        // can create multiple forms from the same defaults"
                        config.buttons = Ext.clone(config.buttons || []);
                    }
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
        } // eo statics
    }); //eo override

    // Ext JS prior to 4.1 does not yet support statics, manually add them
    if(parseInt(Ext.versions.extjs.shortVersion,10) < 410) {
        Ext.apply(Ext.grid.Panel, Ext.grid.Panel.prototype.statics);
    }
});
