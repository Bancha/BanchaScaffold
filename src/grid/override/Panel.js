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
        'Ext.form.Panel',
        'Bancha.scaffold.Grid',
        'Bancha.scaffold.Util',
    ]
}, function() {

    /**
     * @class Ext.grid.Panel
     * **This is only available inside Ext JS.**
     *
     * After requiring 'Bancha.scaffold.grid.override.Panel', grid panels have
     * an additional scaffold configuration. The simplest usage is:
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
     * If the editable property is true,
     * {@link Bancha.scaffold.Form} is used to create the editor fields.
     *
     * You have three possible interceptors:
     * 
     *  - beforeBuild         : executed before {@link #buildConfig}
     *  - transformFieldConfig: executed after a field config is created, see {@link #transformFieldConfigs}
     *  - afterBuild          : executed after {@link #buildConfig} created the config
     *
     * @author Roland Schuetz <mail@rolandschuetz.at>
     * @docauthor Roland Schuetz <mail@rolandschuetz.at>
     */
    Ext.apply(Ext.grid.Panel, {
        /**
         * @cfg {Object|String|False} scaffold
         * This can be eigther a model class name, a model class or a config object.
         * A config object must have the model name defined in config.target. Any property
         * from {@link Bancha.scaffold.Grid} can be defined here.
         *
         * The scaffolding guesses are made from model field configs and validation rules.
         *
         * See {@link Bancha.scaffold.Grid} for an example.
         */
        /**
         * @property {Object|False} scaffold
         * If this panel was scaffolded, all initial configs are stored here, otherwise False.
         */
        scaffold: false
    });

    // add scaffolding support
    Ext.override(Ext.grid.Panel, {
        initComponent: function () {
            var modelName;

            // if it is just a model or model name transform to a config object
            if (Ext.isString(this.scaffold) || (Ext.isDefined(this.scaffold) && Ext.ModelManager.isRegistered(Ext.ClassManager.getName(this.scaffold)))) {
                // IFDEBUG
                modelName = Ext.isString(this.scaffold) ? this.scaffold : Ext.ClassManager.getName(this.scaffold);
                if (!Ext.ModelManager.isRegistered(modelName)) {
                    Ext.Error.raise({
                        plugin: 'Bancha.scaffold',
                        msg: ['Bancha Scaffold: Expected grid panels scaffold property to be a valid model or model name, ',
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
                var config = Bancha.scaffold.Grid.buildConfig(this.scaffold.target, this.scaffold, this.initialConfig);
                Ext.apply(this, config);
                Ext.apply(this.initialConfig, config);
            }

            // continue with standard behaviour
            this.callOverridden();
        }
    });

});
