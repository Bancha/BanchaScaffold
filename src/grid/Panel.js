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
 * @since         Bancha.scaffold 0.3.0
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha.scaffold v PRECOMPILER_ADD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.banchaproject.org
 */
/*jslint browser: true, vars: true, undef: true, nomen: true, eqeq: false, plusplus: true, bitwise: true, regexp: true, newcap: true, sloppy: true, white: true */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:true, regexp:true, undef:true, trailing:false */
/*global Ext:false, Bancha:false, window:false */


Ext.require(['Ext.grid.Panel', 'Bancha.scaffold'], function () {


    /**
     * @class Ext.grid.Panel
     * The Ext.grid.Panel is extended for scaffolding. For an usage example see
     * {@link Bancha.scaffold.Grid}
     * @author Roland Schuetz <mail@rolandschuetz.at>
     * @docauthor Roland Schuetz <mail@rolandschuetz.at>
     */
    Ext.apply(Ext.grid.Panel, {
        /**
         * @cfg {Object|String|False} scaffold
         * Define a config object or model name to build the config from.
         * Guesses are made by model field configs and validation rules.
         *
         * The config object must have the model name defined in config.target. Any property
         * from {@link Bancha.scaffold.Grid} can be defined here.
         *
         * See {@link Bancha.scaffold.Grid} for an example.
         */
        /**
         * @property {Object|False} scaffold
         * If this panel was scaffolded, all initial configs are stored here, otherwise False.
         */
        scaffold: false
        /**
         * @cfg {Boolean} enableCreate
         * If true and scaffold is defined, a create button will be added to all scaffolded grids.  
         * See class descrition on how the fields are created.  
         * If undefined, the default from {@link Bancha.scaffold.Grid} is used.
         */
        /**
         * @cfg {Boolean} enableUpdate
         * If true and scaffold is defined, a editor field is added to all columns for scaffolded grids.  
         * See {@link Bancha.scaffold.Grid} on how the fields are created.  
         * If undefined, the default from {@link Bancha.scaffold.Grid} is used.
         */
        /**
         * @cfg {Boolean} enableDestroy
         * If true and scaffold is defined, a delete button is added to all rows for scaffolded grids.  
         * If undefined, the default from {@link Bancha.scaffold.Grid} is used.
         */
        /**
         * @cfg {Boolean} enableReset
         * If true and scaffold is defined, a reset button will be added to all scaffolded grids
         * (only if enableCreate or enableUpdate is true).  
         * If undefined, the default from {@link Bancha.scaffold.Grid} is used.
         */
    });

    // add scaffolding support
    Ext.override(Ext.grid.Panel, {
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
                        plugin: 'Scaffold',
                        msg: 'Scaffold: When using the grid scaffolding please provide an model name in config.target.'
                    });
                }
                // ENDIF

                // push all basic configs in the scaffold config
                if (Ext.isDefined(this.enableCreate)) {
                    this.scaffold.enableCreate = this.enableCreate;
                }
                if (Ext.isDefined(this.enableUpdate)) {
                    this.scaffold.enableUpdate = this.enableUpdate;
                }
                if (Ext.isDefined(this.enableDestroy)) {
                    this.scaffold.enableDestroy = this.enableDestroy;
                }
                if (Ext.isDefined(this.enableReset)) {
                    this.scaffold.enableReset = this.enableReset;
                }
                // scaffold
                var config = Bancha.scaffold.Grid.buildConfig(this.scaffold.target, this.scaffold, this.initialConfig);
                Ext.apply(this, config);
                Ext.apply(this.initialConfig, config);
            }
            // continue with standard behaviour
            this.callOverridden();
        }
    });

}); //eo require

//eof
