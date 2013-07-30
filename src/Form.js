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
 * @class Bancha.scaffold.Form
 * **This is only available inside Ext JS.**
 *
 * This class is a factory for creating {@link Ext.form.Panel}'s. It uses many 
 * data from the given model, including field configs and validation rules.
 *
 * For more information see {@link Ext.form.Panel}.
 *
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @docauthor Roland Schuetz <mail@rolandschuetz.at>
 */
Ext.define('Bancha.scaffold.Form', {
    singleton: true,
    uses: [
        'Ext.form.field.VTypes',
        'Ext.data.validations'
    ],

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
     * @property {Function} transformFieldConfig Writable function used to add some custom behaviour.
     *
     * This function can be overwritten by any custom function.
     * @param {Object} fieldConfig the field config to transform
     * @param {String} modelType A standard model field type like 'string' (also supports 'file' for compability with http://banchaproject.org)
     * @return {Object} Returns an Ext.form.field.* configuration object
     */
     transformFieldConfig: function (fieldConfig, modelType) {
        return fieldConfig;
     },
    /**
     * @private
     * @property {Function} internalTransformFieldConfig
     * This function just hides id columns and makes it uneditable.
     * @param {Object} fieldConfig the field config to transform
     * @param {String} modelType A standard model field type like 'string' (also supports 'file' for compability with http://banchaproject.org)
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
     * @param {Sring} type The model's current field
     * @param {String} model the model
     * @param {Object} config A config object with all fields, see {@link #buildConfig}'s config property
     * @param {Array} validations (optional) An array of Ext.data.validations of the model
     * @param {Object} isEditorfield (optional) True to don't add field label (usefull e.g. in an editor grid)
     * @param {Object} nonEditorFieldModelField (optional) Dirty hack to set the fieldname on form panel creations, should be refactored!
     * @return {Object} Returns a field config
     */
    buildFieldConfig: function (modelField, model, config, validations, isEditorfield) {
        var type = modelField.type.type,
            field = this.buildDefaultFieldFromModelType(type, config),
            association,
            store,
            fieldName;

        // infer name
        field.name = modelField.name;
        if (!isEditorfield) {
            field.fieldLabel = Bancha.scaffold.Util.humanize(modelField.name);
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
        association = Bancha.scaffold.Util.getBelongsToAssociation(field, model);
        if(association) {
            Ext.apply(field, {
                xtype: 'combobox',
                store: Bancha.scaffold.Util.getStore(association.associatedModel, config),
                displayField: Bancha.scaffold.Util.getDisplayFieldName(association.associatedModel),
                valueField: association.associatedModel.prototype.idProperty || 'id',
                queryMode: 'local'
            });
        }

        // now make custom transforms
        field = config.internalTransformFieldConfig(field,type);
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
     * If an array of elements, a footer toolbar is rendered.
     * reset' and 'save' will be replaced by scaffolded
     * buttons, other elements are treated like default ExtJS items.
     *
     * Inside your own buttons you can set the scope property to
     * 'scaffold-scope-me', this scope provides two functions:
     *  - this.getPanel() to get the form panel
     *  - this.getForm() to get the basic form
     *
     * Default: ['reset','save']
     */
    buttons: ['reset','save'],
    /**
     * @property
     * Default save button config, used in buttons.
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
     * Default reset button config, used in buttons config.
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
     *
     * For Bancha projects with an CakePHP backend this function will
     * scaffold everything
     *
     * Otherwise it will use the initial config, if provided. If not,
     * it will use the model proxies load method. There is no generic
     * way to guess the submit method, please either modify this function
     * or provide a propery form api config.
     *
     * @param {Ext.data.Model} model the model used for scaffolding
     * @param {Object} initialApi the initial Ext.form.Panel api config
     * @return the final Ext.form.Panel api config
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
                    'Bancha Scaffold: You have not defined any form api. If you want ',
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
        initialApi = initialApi || {};

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
            load: initialApi.read || stub.read,
            // as first and only param you must add data: {id: id} when loading
            // The server-side must mark the submit handler as a 'formHandler'
            submit: initialApi.submit || stub.submit
        };
    },
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
     * @property {String|Number|False}
     * Define a record id here to autolaod this record for editing in this form, or choose
     * false to create a new record onSave. You can also overwrite onSave to define your
     * own behavior
     * (Default: false)
     */
    loadRecord: false,
    /**
     * You can replace this function! The function will be executed before each
     * {@link #buildConfig} as interceptor.
     * @param {Ext.data.Model} model the model used for scaffolding
     * @param {Object} config the scaffold full config for this call
     * @param {Object} initialPanelConfig see {@link #buildConfig}'s initialPanelConfig property
     * @return {Object|undefined} object with initial Ext.form.Panel configs
     */
    beforeBuild: function (model, config, initialPanelConfig) {},
    /**
     * You can replace this function! This function will be executed after each
     * {@link #buildConfig} as interceptor
     * @param {Object} formConfig the just build form panel config
     * @param {Ext.data.Model} model the model used for scaffolding
     * @param {Object} config the scaffold full config for this call
     * @param {Object} initialPanelConfig see {@link #buildConfig}'s initialPanelConfig property
     * @return {Object|Undefined} object with final Ext.form.Panel configs or undefined to use the passed config
     */
    afterBuild: function (formConfig, model, config, initialPanelConfig) {},
    /**
     * @deprecated Always use the scaffold property on Ext.form.Panel, this function will undergo some refactoring
     * Builds form configs from the metadata, for scaffolding purposes.
     * By default data is loaded from the server if an id is supplied and
     * onSave it pushed the data to the server.
     *
     * Guesses are made by model field configs and validation rules.
     * @param {Ext.data.Model|String} model the model class or model name
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
     * @param {Object} initialPanelConfig (optional) Some additional Ext.form.Panel
     * configs which are applied to the config
     * @return {Object} object with Ext.form.Panel configs
     */
    buildConfig: function (/* deprecated, is read from config.target */ignoredModel, config, initialPanelConfig) {
        var fields = [],
            formConfig, id, validations, loadFn;
        config = Ext.apply({}, config, Ext.clone(this)); // get all defaults for this call
        initialPanelConfig = initialPanelConfig || {};

        // get the model name and model class
        config.target = Ext.isString(config.target) ? config.target : Ext.ClassManager.getName(config.target);
        var model = Ext.ModelManager.getModel(config.target);

        if(!Ext.isArray(config.exclude)) {
            // IFDEBUG
            Ext.Error.raise({
                plugin: 'Bancha.scaffold',
                model: model,
                msg: 'Bancha Scaffold: When scaffolding a form panel the exclude property should be an array of field names to exclude.'
            });
            // ENDIF
            config.exclude = [];
        }

        // build initial config
        formConfig = config.beforeBuild(model, config, initialPanelConfig) || {};

        // create all fields
        validations = model.prototype.validations;
        model.prototype.fields.each(function (field) {
            if((!Ext.isArray(config.fields) || config.fields.indexOf(field.name) !== -1) &&
                config.exclude.indexOf(field.name) === -1) {
                fields.push(
                    Bancha.scaffold.Form.buildFieldConfig(field, model, config, validations));
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
        config.buttons = Bancha.scaffold.Util.replaceButtonPlaceHolders(config.buttons || [],
                                                    config, this.buildButtonScope(id));

        // extend formConfig
        Ext.apply(formConfig, initialPanelConfig, {
            id: id,
            api: this.buildApiConfig(model,initialPanelConfig.api),
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
});
