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
 * @class Bancha.scaffold.form.Config
 * **This is only available inside Ext JS.**
 *
 * This class is a config class for creating scaffoled {@link Ext.form.Panel}s.
 *
 * For more information see {@link Ext.form.Panel}.
 *
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @docauthor Roland Schuetz <mail@rolandschuetz.at>
 */
Ext.define('Bancha.scaffold.form.Config', {
    uses: [
        'Ext.window.MessageBox'
    ],

    /**
     * Create a new config instance
     */
    constructor: function(config) {
        config = config || {};
        var triggeredFrom = config.triggeredFrom || 'Unknown Origin',
            me = this,
            modelName;

        // if the config is just a model name or model, transform to a config object
        if (Ext.isString(config) || Bancha.scaffold.Util.isModel(config)) {
            config = {
                target: config // use the model as target
            };
        }

        //<debug>
        // check that a model is set
        if(!config.target) {
            Ext.Error.raise({
                plugin: 'Bancha Scaffold',
                msg: [
                    'Bancha Scaffold: If you set a form scaffold config object ',
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
                    'Bancha Scaffold: If you set a form scaffold config object ',
                    'for '+triggeredFrom+', the target property must be a model ',
                    'name or model class. Instead ' + config.target + ' of type ',
                    (typeof config.target) + ' was set.'
                ].join('')
            });
        }
        //</debug>

        // make sure that the model property is always a model class
        config.target = Bancha.scaffold.Util.getModel(modelName);

        if(Ext.isDefined(config.exclude) && !Ext.isArray(config.exclude)) {
            //<debug>
            Ext.Error.raise({
                plugin: 'Bancha Scaffold',
                model: modelName,
                msg: [
                    'Bancha Scaffold: When scaffolding a ' + triggeredFrom,
                    ' the form scaffold exclude config should be an array ',
                    'of field names to exclude.'
                ].join('')
            });
            //</debug>
            config.exclude = [];
        }

        // apply to the object
        Ext.apply(me, config);
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
     * This config is applied to each scaffolded form field
     */
    fieldDefaults: {},
    /**
     * @cfg
     * This config is applied to each scaffolded Ext.form.field.Date
     */
    datefieldDefaults: {},
    /**
     * @cfg
     * This config is applied to each scaffolded Ext.form.field.File
     */
    fileuploadfieldDefaults: {
        emptyText: 'Select an file'
    },
    /**
     * @cfg
     * This config is applied to each scaffolded Ext.form.field.Text
     */
    textfieldDefaults: {},
    /**
     * @cfg
     * This config is applied to each scaffolded Ext.form.field.Number
     */
    numberfieldDefaults: {},
    /**
     * @cfg
     * This config is applied to each scaffolded Ext.form.field.Checkbox
     */
    checkboxfieldDefaults: {
        uncheckedValue: false
    },
    /**
     * @cfg
     * The defaults class to create a stores for associated model selects for
     * form scaffolding.
     *
     * See also {@link Bancha.scaffold.Util#getStore}.
     *
     * Default: *"Ext.data.Store"*
     */
    storeDefaultClass: 'Ext.data.Store',
    /**
     * @cfg
     * Defaults for all stores for associated model selects created with
     * this scaffolding.
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
     * false to create a new store each time a associated
     * model is found and a selects field with a store is
     * build.
     *
     * See also {@link Bancha.scaffold.Util#getStore}.
     *
     * Default: *true*
     */
    oneStorePerModel: true,
    /**
     * @cfg {Function} transformFieldConfig
     * Used to add some custom behaviour.
     *
     * This function can be overwritten by any custom function.
     * @param {Object} fieldConfig the field config to transform
     * @param {String} modelType A standard model field type like 'string'
     * (also supports 'file' for compability with http://bancha.io)
     * @return {Object} Returns an Ext.form.field.* configuration object
     */
    transformFieldConfig: function (fieldConfig, modelType) {
        return fieldConfig;
    },
    /**
     * @cfg
     * Editable function to be called when the save button is pressed.
     * To change the default scaffolding behaviour just replace this function.
     *
     * The default scope provides two functions:
     *
     *  - this.getPanel() to get the form panel
     *  - this.getForm() to get the basic form
     */
    onSave: function () {
        var me = this,
            form = me.getForm(),
            config = me.getPanel().scaffold;

        form.submit({
            waitMsg: form.hasUpload() ? 'Uploading files...' : 'Saving data..',
            success: function (form, action) {
                Ext.MessageBox.alert('Success', action.result.msg || 'Successfully saved data.');

                // load result as record into form
                var rec = Ext.create(config.target.getName(), action.result.data);
                form.loadRecord(rec);

                if(config.onSaved) {
                    config.onSaved.call(me, me, true, action);
                }
            },
            failure: function (form, action) {
                if(action.result.msg || !action.result.errors) {
                    // if there is a server-side message or no server-side validation errors are send,
                    // show a warning alert. Otherwise the errors are rendered in the form and no alert
                    // is necessary.
                    Ext.MessageBox.alert('Failed', action.result.msg || 'Could not save data, unknown error.');
                }

                if(config.onSaved) {
                    config.onSaved.call(me, me, false, action);
                }
            }
        });
    },
    /**
     * @cfg
     * Editable function to be called when the record was saved to the server.
     * To change the default scaffolding behaviour just replace this function.
     *
     * The arguments are:
     * 
     *  - this: The scope described below
     *  - success: True if successfully saved
     *  - action: The request action
     *  
     * The default scope provides two functions:
     *
     *  - this.getPanel() to get the form panel
     *  - this.getForm() to get the basic form
     *
     * Note: 
     * This function is called by onSave, so if you override onSave this function
     * might note be called anymore.
     */
    onSaved: Ext.emptyFn,
    /**
     * @cfg
     * Editable function to be called when the reset button is pressed.
     * To change the default scaffolding behaviour just replace this function.
     *
     * The default scope provides two functions:
     *
     *  - this.getPanel() to get the form panel
     *  - this.getForm() to get the basic form
     */
    onReset: function () {
        this.getForm().reset();
    },
    /**
     * @cfg {String[]|Ext.button.Button[]}
     * If an array of elements, a footer toolbar is rendered.
     *
     * 'reset' and 'save' will be replaced by scaffolded
     * buttons, other elements are treated like default Ext JS items.
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
     * @cfg
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
     * @cfg
     * Default reset button config, used in buttons config.
     * If not defined scope and handler properties will be set by
     * the build function.
     */
    resetButtonConfig: {
        iconCls: 'icon-reset',
        text: 'Reset'
    },
    /**
     * @cfg {Function}
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
    buildApiConfig: function (model, initialApi) {

        if(Bancha.getModel) {
            // the user is using the full Bancha stack
            // everything can be automatically done
            return Ext.form.Panel.buildBanchaApiConfig(model,initialApi);
        } else{

            if(initialApi) {
                // just use the configured api
                return initialApi;
            }

            //<debug>
            // warn the user that we can just guess part of the api
            if (Ext.global.console && Ext.isFunction(Ext.global.console.warn)) {
                Ext.global.console.warn([
                    'Bancha Scaffold: You have not defined any form api. If you want ',
                    'Bancha to guess it, please define Bancha.scaffold.form.Config.',
                    'buildApiConfig. Bancha Scaffold can only try to get the load ',
                    'function from the model proxy, but not the submit function.'
                ].join(''));
            }
            //</debug>
        }

        // try to find the proxy configuration for load
        var proxy = model.getProxy(),
            load = proxy && proxy.api && proxy.api.read ? proxy.api.read :
                    (proxy && proxy.directFn ? proxy.directFn : undefined);

        return load ? {load: load} : undefined;
    },
    /**
     * @cfg {String|Number|False}
     * Define a record id here to autolaod this record for editing in this form, or choose
     * false to create a new record onSave. You can also overwrite onSave to define your
     * own behavior
     * (Default: false)
     */
    loadRecord: false,
    /**
     * @cfg {Function}
     * The function will be executed before scaffolding as interceptor.
     * @param {Ext.data.Model} model the model used for scaffolding
     * @param {Bancha.scaffold.form.Config} config the scaffold full config for this call
     * @param {Object} initialPanelConfig please ignore, this is a legacy argument, may having some additional Ext.form.Panel configs
     * @return {Object|undefined} object with initial Ext.form.Panel configs
     */
    beforeBuild: function (model, config, initialPanelConfig) {},
    /**
     * @cfg {Function}
     * This function will be executed after scaffolding as interceptor.
     * @param {Object} formConfig the just build form panel config
     * @param {Ext.data.Model} model the model used for scaffolding
     * @param {Bancha.scaffold.form.Config} config the scaffold full config for this call
     * @param {Object} initialPanelConfig please ignore, this is a legacy argument, may having some additional Ext.form.Panel configs
     * @return {Object|undefined} object with final Ext.form.Panel configs or undefined to use the passed config
     */
    afterBuild: function (formConfig, model, config, initialPanelConfig) {}
});
