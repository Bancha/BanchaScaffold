/*!
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

// This code below is a copy from the Bancha package!

/**
 * @private
 * @class Bancha.scaffold.data.Validators
 *
 * For Ext JS 5 it adds a File validation class,
 * for Ext JS 4 and Sencha Touch it adds a range and 
 * file validation rule to Ext.data.validations.
 *
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @docauthor Roland Schuetz <mail@rolandschuetz.at>
 */
Ext.define('Bancha.scaffold.data.Validators', {
    alternateClassName: [
        'Bancha.data.Validators' // Bancha.Scaffold uses the same class
    ]
}, function() {

    //<if ext>
    if(Ext.versions.extjs && Ext.versions.extjs.major === 5) {
        // Ext JS 5 doesn't have a validations class anymore, 
        // so use the range validator and add a file validator
        Ext.syncRequire('Bancha.scaffold.data.validator.File');

        /**
         * Fixes issues with the current Range validator
         *
         * See http://www.sencha.com/forum/showthread.php?288168
         * 
         * @author Roland Schuetz <mail@rolandschuetz.at>
         * @docauthor Roland Schuetz <mail@rolandschuetz.at>
         */
        Ext.define('Ext.data.validator.override.Bound', {
            override: 'Ext.data.validator.Bound',
            config: {
                /**
                 * @cfg {String} nanMessage
                 * The error message to return when the value is not a number.
                 */
                nanMessage: 'Must be a number'
            },
            validate: function(value) {
                if(isNaN(this.getValue(value))) {
                    return this._nanMessage;
                }
                return this.callParent(arguments);
            },
            getValue: function(value) {
                return parseFloat(value);
            }
        });
        Ext.define('Ext.data.validator.override.Range', {
            override: 'Ext.data.validator.Range'
        }, function() {
            // for some reason setting via config doesn't work
            this.prototype.setNanMessage('Must be a number');
        });

    } else {
    //</if>
        Ext.syncRequire('Bancha.scaffold.data.override.Validations');
    //<if ext>
    }
    //</if>
});
