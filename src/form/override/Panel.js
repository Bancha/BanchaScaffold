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
 * @since         Bancha Scaffold v 0.3.0
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha Scaffold v PRECOMPILER_ADD_BANCHA_SCAFFOLD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.banchaproject.org
 */

/**
 * @private
 * @class Bancha.scaffold.form.override.Panel
 *
 * This override adds support for defining a scaffold config in a formpanel
 * configuration.
 *
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @docauthor Roland Schuetz <mail@rolandschuetz.at>
 */
Ext.define('Bancha.scaffold.form.override.Panel', {
    requires: [
        'Ext.form.Panel',
        'Bancha.scaffold.form.Config',
        'Bancha.scaffold.data.override.Validations',
        'Bancha.scaffold.form.field.override.VTypes',
        'Bancha.scaffold.Util'
    ]
}, function() {

    /**
     * @class Ext.form.Panel
     * **This is only available inside Ext JS.**
     *
     * After requiring *'Bancha.scaffold.form.override.Panel'*, form panels have
     * an additional scaffold configuration.
     *
     * The simplest usage is:
     *
     *     Ext.create("Ext.form.Panel", {
     *         scaffold: 'MyApp.model.User', // the model name
     *     });
     *
     * A more complex usage example:
     *
     *     Ext.create("Ext.form.Panel", {
     *
     *         scaffold: {
     *             // define the model name here
     *             target: 'MyApp.model.User',
     *
     *             // you can tell the form to automatically load a record for edting, by id
     *             loadRecord: 3,
     *
     *             // define which buttons should be displayed
     *             buttons: ['reset','save'],
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
     *
     *  - string
     *  - integer
     *  - float (precision is read from metadata)
     *  - boolean (checkboxes)
     *  - date
     *
     * It's recognizing following validation rules on the model to add validations
     * to the form fields:
     *
     *  - format
     *  - file
     *  - length
     *  - numberformat
     *  - presence
     *
     * You have three possible interceptors:
     *
     *  - {@link Bancha.scaffold.form.Config#cfg-beforeBuild}         : executed before #buildConfig
     *  - {@link Bancha.scaffold.form.Config#cfg-transformFieldConfig}: executed after a field config is created
     *  - {@link Bancha.scaffold.form.Config#cfg-afterBuild}          : executed after #buildConfig created the config
     *
     *  If you use the scaffold config and don't define an id,
     * it will be created and can not be changed anymore afterwards.
     *
     * @author Roland Schuetz <mail@rolandschuetz.at>
     * @docauthor Roland Schuetz <mail@rolandschuetz.at>
     */
    Ext.apply(Ext.form.Panel, {
        /**
         * @cfg {Bancha.scaffold.form.Config|Ext.data.Model|Object|String|false} scaffold
         *
         * The simplest configuration is to set a model class or model name as scaffold
         * config. All fields, validation rules and other configurations are taken from
         * this model.
         *
         * For more complex configurations you can set a {@link Bancha.scaffold.form.Config}
         * config or class. This config must have the model name defined as target
         * config. Any property from {@link Bancha.scaffold.form.Config} can be defined here.
         */
        /**
         * @property {Bancha.scaffold.form.Config|False} scaffold
         * If this panel was scaffolded, all initial configs are stored here, otherwise false.
         */
        scaffold: false
    });

    // add scaffolding support
    Ext.override(Ext.form.Panel, {
        /**
         * @private
         */
        initComponent: function () {
            var isModel, cls, config;

            if(this.scaffold) {
                // check if the scaffold config is a model class or string
                isModel = Ext.isString(this.scaffold) || Ext.ModelManager.isRegistered(Ext.ClassManager.getName(this.scaffold));

                // if there's a model or config object, transform to config class
                // normally we would use this.scaffold.isInstance instead of $className, but that was introduced in Ext JS 4.1
                if (isModel || (Ext.isObject(this.scaffold) && !this.scaffold.$className)) {
                    this.scaffold.triggeredFrom = 'Ext.form.Panel';
                    this.scaffold = Ext.create('Bancha.scaffold.form.Config', this.scaffold);
                }

                // apply scaffolding
                cls = Ext.ClassManager.getClass(this); //buildConfig is a static method
                config = cls.buildConfig(this.scaffold, this.initialConfig);
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
             * Maps model field configs with field types and additional configs
             */
            fieldToFieldConfigs: {
                'auto': {
                    xtype: 'textfield'
                },
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
             * @private
             * @property {Function} internalTransformFieldConfig
             * This function just hides id columns and makes it uneditable.
             * @param {Object} fieldConfig the field config to transform
             * @param {String} modelType A standard model field type like 'string'
             * (also supports 'file' for compability with http://banchaproject.org)
             * @return {Object} Returns an Ext.form.field.* configuration object
             */
            internalTransformFieldConfig: function (fieldConfig, modelType) {
                if (fieldConfig.name === 'id') {
                    fieldConfig.xtype = 'hiddenfield';
                }

                return fieldConfig;
            },
            /**
             * @private
             * Analysis the validation rules for a field and adds validation rules to the field config.
             * For what is supported see {@link Bancha.scaffold.form.Config}
             * @param {Object} field A Ext.form.field.* config
             * @param {Array} validations An array of Ext.data.validations of the model
             * @param {Bancha.scaffold.form.Config} config A Bancha.scaffold.form.Config config
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
                    var name = field.name, // it's used so often, make a shortcut
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
                            //<debug>
                            // length validation works only only on textfields
                            if (field.xtype !== 'textfield') {
                                msgAddition = (field.xtype === 'numberfield') ?
                                                'Use the rule numberformat to force minimal and maximal values.' : '';
                                Ext.Error.raise({
                                    plugin: 'Bancha Scaffold',
                                    msg: [
                                        'Bancha Scaffold: The model has a validation rule ',
                                        'length for the field ' + name + ', but this field ',
                                        'is of type ' + field.xtype + ', so the rule makes ',
                                        'no sense. ' + msgAddition
                                    ].join('')
                                });
                            }
                            //</debug>
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
                            //<debug>
                            // length validation works only only on textfields
                            if (field.xtype !== 'textfield') {
                                Ext.Error.raise({
                                    plugin: 'Bancha Scaffold',
                                    msg: [
                                        'Bancha Scaffold: The model has a validation rule ',
                                        'format for the field ' + name + ', but this field ',
                                        'is of type ' + field.xtype + ', so the rule makes ',
                                        'no sense.'
                                    ].join('')
                                });
                            }
                            //</debug>
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
                                //<debug>
                                if (Ext.global.console && Ext.isFunction(Ext.global.console.warn)) {
                                    Ext.global.console.warn([
                                        'Bancha Scaffold: Currently Bancha.scaffold.form.Config ',
                                        'only recognizes the model Ext.data.validations format ',
                                        'rules with the matcher regex of Ext.form.field.VType ',
                                        'alpha, alphanum, email and url. This rule with matcher ',
                                        rule.matcher.toString() + ' will just be ignored.'
                                    ].join(''));
                                }
                                //</debug>
                                break;
                            }
                            break;
                        case 'numberformat':
                            // numberformat validation works only only on numberfields
                            //<debug>
                            if (field.xtype !== 'numberfield') {
                                Ext.Error.raise({
                                    plugin: 'Bancha Scaffold',
                                    msg: [
                                        'Bancha Scaffold: The model has a validation rule ',
                                        'numberformat for the field ' + name + ', but this ',
                                        'field is of type ' + field.xtype + ', so the rule ',
                                        'makes no sense. A numberfield is expected.'
                                    ].join('')
                                });
                            }
                            //</debug>
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
                            //<debug>
                            if (Ext.global.console && Ext.isFunction(Ext.global.console.warn)) {
                                Ext.global.console.warn([
                                    'Bancha Scaffold: Could not recognize rule ',
                                    Ext.encode(rule) + ' when trying to create a ',
                                    'form field field.'
                                ].join(''));
                            }
                            //</debug>
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
             * @param {String} type The model field type
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
             * @param {String} type The model's current field
             * @param {Bancha.scaffold.form.Config} config A config object
             * @param {Array} validations (optional) An array of Ext.data.validations of the model
             * @param {Object} isEditorfield (optional) True to don't add field label (usefull e.g. in an editor grid)
             * @param {Object} nonEditorFieldModelField (optional) Dirty hack to set the fieldname on
             * form panel creations, should be refactored!
             * @return {Object} Returns a field config
             */
            buildFieldConfig: function (modelField, config, validations, isEditorfield) {
                var type = modelField.type.type,
                    model = config.target,
                    field = this.buildDefaultFieldFromModelType(type, config),
                    Util = Bancha.scaffold.Util,
                    association;

                // infer name
                field.name = modelField.name;
                if (!isEditorfield) {
                    field.fieldLabel = Util.humanize(modelField.name);
                }

                // infer date format into editor (not needed for editor fields)
                if(type==='date' && !isEditorfield && modelField.dateFormat) {
                    field.format = modelField.dateFormat;
                }

                // add some additional validation rules from model validation rules
                if (Ext.isDefined(validations) && validations.length) {
                    field = this.addValidationRuleConfigs(field, validations, config);
                }

                // check for associations
                association = Util.getBelongsToAssociation(field, model);
                if(association) {
                    Ext.apply(field, {
                        xtype: 'combobox',
                        store: Util.getStore(association.associatedModel, config),
                        displayField: Util.getDisplayFieldName(association.associatedModel),
                        valueField: association.associatedModel.prototype.idProperty || 'id',
                        queryMode: 'local'
                    });
                }

                // now make custom transforms
                field = this.internalTransformFieldConfig(field,type);
                if (typeof config.transformFieldConfig === 'function') {
                    field = config.transformFieldConfig(field, type);
                }

                // fileuploads are currently not supported in editor fields (ext doesn't render them usable)
                if (isEditorfield && field.xtype === 'fileuploadfield') {
                    field = undefined; // TODO Maybe on double click open a modal window for file uploads
                }

                return field;
            },
            /**
             * @private
             * This function is used if you are using Bancha.scaffold.form.Config with
             * the full Bancha library. It will automatically find all
             * api configurations
             */
            buildBanchaApiConfig: function(model, initialApi) {
                initialApi = initialApi || {};

                //<debug>
                if (!Bancha.initialized) {
                    // the user is using Bancha, but hasn't initialized yet
                    Ext.Error.raise({
                        plugin: 'Bancha Scaffold',
                        msg: [
                            'Bancha Scaffold: Bancha is not yet initalized, please ',
                            'init before using Ext.form.Panel with a scaffold config.'
                        ].join('')
                    });
                }
                //</debug>

                var modelName = Ext.ClassManager.getName(model),
                    stubName = modelName.substr(Bancha.modelNamespace.length + 1),
                    stub = Bancha.getStubsNamespace()[stubName];

                //<debug>
                if (!Ext.isDefined(stub)) {
                    Ext.Error.raise({
                        plugin: 'Bancha Scaffold',
                        msg: [
                            'Bancha Scaffold: Ext.form.Panel used with a scaffold config ',
                            'expects an remotable bancha model, but got an "normal" model ',
                            'or something else'
                        ].join('')
                    });
                }
                //</debug>

                return {
                    // The server-side method to call for load() requests
                    load: initialApi.read || stub.read,
                    // as first and only param you must add data: {id: id} when loading
                    // The server-side must mark the submit handler as a 'formHandler'
                    submit: initialApi.submit || stub.submit
                };
            },
            /**
             * @private
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
             * @private
             * Builds form configs from the metadata, for scaffolding purposes.
             * By default data is loaded from the server if an id is supplied and
             * onSave it pushed the data to the server.
             *
             * Guesses are made by model field configs and validation rules.
             * @param {Bancha.scaffold.form.Config} config The config object to apply
             * @param {Object} initialPanelConfig   (optional) Some additional Ext.form.Panel
             *                                      configs which are applied to the config
             * @return {Object}                     object with Ext.form.Panel configs
             */
            buildConfig: function (config, initialPanelConfig) {
                initialPanelConfig = initialPanelConfig || {};
                var fields = [],
                    model = Ext.ModelManager.getModel(config.target),
                    me = this,
                    formConfig, id, validations, loadFn;

                //<debug>
                if(!config.$className) { // normally we would use config.isInstance here, but that was introduced in Ext JS 4.1
                    Ext.Error.raise({
                        plugin: 'Bancha Scaffold',
                        msg: [
                            'Bancha Scaffold: Ext.form.Panel#buildConfig expects a object ',
                            'of class Bancha.scaffold.form.Config.'
                        ].join('')
                    });
                }
                //</debug>

                // build initial config
                formConfig = config.beforeBuild(model, config, initialPanelConfig) || {};

                // create all fields
                validations = model.prototype.validations;
                model.prototype.fields.each(function (field) {
                    if((!Ext.isArray(config.fields) || Ext.Array.indexOf(config.fields, field.name) !== -1) &&
                        Ext.Array.indexOf(config.exclude, field.name) === -1) {
                        fields.push(
                            me.buildFieldConfig(field, config, validations));
                    }
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
                id = initialPanelConfig.id || Ext.id(null, 'formpanel-');
                formConfig.id = id;

                // build buttons
                if(!config.hasOwnProperty('buttons')) {
                    // this a default, so clone before instanciating
                    // See also test case "should clone all configs, so that you
                    // can create multiple forms from the same defaults"
                    config.buttons = Ext.clone(config.buttons || []);
                }
                config.buttons = Bancha.scaffold.Util.replaceButtonPlaceHolders(config.buttons,
                                                            config, this.buildButtonScope(id));

                // extend formConfig
                Ext.apply(formConfig, initialPanelConfig, {
                    id: id,
                    api: config.buildApiConfig(model, initialPanelConfig.api),
                    paramOrder: ['data'],
                    items: fields,
                    buttons: config.buttons
                });

                // the scaffold config of the grid is saved as well
                formConfig.scaffold = config;

                // autoload the record
                if (Ext.isDefined(config.loadRecord) && config.loadRecord !== false) {
                    // load the record on component load
                    loadFn = function (component, options) {
                        component.load({
                            params: {
                                data: {
                                    data: {
                                        id: config.loadRecord
                                    }
                                } // bancha expects it this way
                            }
                        });
                    };
                    // if there's already a function, batch them
                    formConfig.listeners = formConfig.listeners || {};
                    if (formConfig.listeners.afterrender) {
                        formConfig.listeners.afterrender = Ext.Function.createSequence(formConfig.listeners.afterrender, loadFn);
                    } else {
                        formConfig.listeners.afterrender = loadFn;
                    }
                }

                // return after interceptor
                return config.afterBuild(formConfig, model, config, initialPanelConfig) || formConfig;
            }
        } // eo statics
    }); //eo override

    // Ext JS prior to 4.1 does not yet support statics, manually add them
    if(parseInt(Ext.versions.extjs.shortVersion,10) < 410) {
        Ext.apply(Ext.form.Panel, Ext.form.Panel.prototype.statics);
    }
});
