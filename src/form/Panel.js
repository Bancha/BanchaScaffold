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
}); //eo require

//eof
