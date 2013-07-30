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
 * @since         Bancha.scaffold 0.3.0
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha.scaffold v PRECOMPILER_ADD_RELEASE_VERSION
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
        'Bancha.scaffold.Form',
        'Bancha.scaffold.Util',
    ]
}, function() {

    /**
     * @class Ext.form.Panel
     * **This is only available inside Ext JS.**
     *
     * After requiring 'Bancha.scaffold.form.override.Panel', form panels have
     * an additional scaffold configuration. The simplest usage is:
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
     *  - beforeBuild         : executed before {@link #buildConfig}
     *  - transformFieldConfig: executed after a field config is created, see {@link #transformFieldConfig}
     *  - afterBuild          : executed after {@link #buildConfig} created the config
     *
     * @author Roland Schuetz <mail@rolandschuetz.at>
     * @docauthor Roland Schuetz <mail@rolandschuetz.at>
     */
    Ext.apply(Ext.form.Panel, {
        /**
         * @cfg {Object|String|False} scaffold
         * This can be eigther a model class name, a model class or a config object.
         * A config object must have the model name defined in config.target. Any property
         * from {@link Bancha.scaffold.Form} can be defined here.
         *
         * The scaffolding guesses are made from model field configs and validation rules.
         *
         * See {@link Bancha.scaffold.Form} for an example.
         */
        /**
         * @property {Object|False} scaffold
         * If this panel was scaffolded, all initial configs are stored here, otherwise False.
         */
        scaffold: false
    });

    // add scaffolding support
    Ext.override(Ext.form.Panel, {
        initComponent: function () {
            var modelName;

            // if it is just a model or model name transform to a config object
            if (Ext.isString(this.scaffold) || (Ext.isDefined(this.scaffold) && Ext.ModelManager.isRegistered(Ext.ClassManager.getName(this.scaffold)))) {
                // IFDEBUG
                modelName = Ext.isString(this.scaffold) ? this.scaffold : Ext.ClassManager.getName(this.scaffold);
                if (!Ext.ModelManager.isRegistered(modelName)) {
                    Ext.Error.raise({
                        plugin: 'Bancha.scaffold',
                        msg: ['Bancha Scaffold: Expected form panels scaffold property to be a valid model or model name, ',
                             'instead got ' + this.scaffold + ' (of type ' + (typeof this.scaffold) + ')'].join('')
                    });
                }
                // ENDIF
                this.scaffold = {
                    target: this.scaffold
                };
            }

            // if there is a config object apply scaffolding
            if (Ext.isObject(this.scaffold)) {
                // IFDEBUG
                modelName = Ext.isString(this.scaffold.target) ? this.scaffold.target : Ext.ClassManager.getName(this.scaffold.target);
                if (!Ext.ModelManager.isRegistered(modelName)) {
                    Ext.Error.raise({
                        plugin: 'Bancha.scaffold',
                        msg: ['Bancha Scaffold: Expected grid panels scaffold.target property to be a valid model or model name, ',
                             'instead got ' + this.scaffold.target + ' (of type ' + (typeof this.scaffold.target) + ')'].join('')
                    });
                }
                // ENDIF

                // scaffold
                var config = Bancha.scaffold.Form.buildConfig(this.scaffold.target, this.scaffold, this.initialConfig);
                Ext.apply(this, config);
                Ext.apply(this.initialConfig, config);
            }
            // continue with standard behaviour
            this.callOverridden();
        }
    });
});
