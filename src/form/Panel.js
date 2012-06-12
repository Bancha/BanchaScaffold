/*
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2012 Roland Schuetz
 *
 * @package       Bancha.scaffold
 * @copyright     Copyright 2011-2012 Roland Schuetz
 * @link          http://banchaproject.org/bancha-scaffold.html
 * @since         Bancha.scaffold 0.3.0
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha.scaffold v PRECOMPILER_ADD_RELEASE_VERSION
 *
 * For more information go to http://banchaproject.org/bancha-scaffold.html
 */
/*jslint browser: true, vars: true, undef: true, nomen: true, eqeq: false, plusplus: true, bitwise: true, regexp: true, newcap: true, sloppy: true, white: true */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:true, regexp:true, undef:true, trailing:false */
/*global Ext:false, Bancha:false, window:false */


Ext.require(['Ext.form.Panel', 'Bancha.scaffold'], function () {

    /**
     * @class Ext.form.Panel
     * The Ext.form.Panel is extended for scaffolding. For an usage example see 
     * {@link Bancha.scaffold.Form}
     * @author Roland Schuetz <mail@rolandschuetz.at>
     * @docauthor Roland Schuetz <mail@rolandschuetz.at>
     */
    Ext.apply(Ext.form.Panel, {
        /**
         * @cfg {Object|String|False} scaffold
         * Define a config object or model name to build the config from.  
         * Guesses are made by model field configs and validation rules.
         *
         * The config object must have the model name defined in config.target. Any property
         * from {@link Bancha.scaffold.Form} can be defined here.
         *
         * See {@link Bancha.scaffold.Form} for an example.
         */
        /**
         * @property {Object|False} scaffold
         * If this panel was scaffolded, all initial configs are stored here, otherwise False.
         */
        scaffold: false,
        /**
         * @cfg {Boolean} enableReset
         * If true and scaffold is defined, a reset button will be added to all scaffolded grids
         * (only if enableCreate or enableUpdate is true).  
         * If undefined, the default from {@link Bancha.scaffold.Form} is used.
         */
        enableReset: undefined,
        /**
         * @cfg {String|Number|False} scaffoldLoadRecord
         * Define a record id here to autolaod this record for editing in this form, or choose
         * false to create a new record onSave (if default onSave is used).
         * (Default: false)
         */
        scaffoldLoadRecord: false
    });

    // add scaffolding support
    Ext.override(Ext.form.Panel, {
        initComponent: function () {
            if (Ext.isString(this.scaffold)) {
                this.scaffold = {
                    target: this.scaffold
                };
            }

            if (Ext.isObject(this.scaffold)) {
                // IFDEBUG
                if (!Ext.isDefined(this.scaffold.target)) {
                    Ext.Error.raise({
                        plugin: 'Bancha.scaffold',
                        msg: 'Bancha Scaffold: When using the form scaffolding please provide an model name in config.target.'
                    });
                }
                // ENDIF

                // push all basic configs in the scaffold config
                if (Ext.isDefined(this.enableReset)) {
                    this.scaffold.enableReset = this.enableReset;
                }
                // scaffold
                var config = Bancha.scaffold.Form.buildConfig(this.scaffold.target, this.scaffoldLoadRecord, this.scaffold, this.initialConfig);
                Ext.apply(this, config);
                Ext.apply(this.initialConfig, config);
            }
            // continue with standard behaviour
            this.callOverridden();
        }
    });
}); //eo require

//eof
