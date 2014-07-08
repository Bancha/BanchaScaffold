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

// Fake missing classes for production
if(Ext.versions.extjs.major === 4) {
    Ext.define('Ext.data.validator.Validator', {});
}

/**
 * For Ext JS 5 only, for Ext JS 4 see {@class Ext.data.validations}.
 *
 * Validates that the filename is one of given {@link #extension}.
 */
Ext.define('Bancha.scaffold.data.validator.File', {
    extend: 'Ext.data.validator.Validator',
    alias: 'data.validator.file',
    alternateClassName: [
        'Bancha.data.validator.File' // Bancha.Scaffold uses the same class
    ],
    
    type: 'file',
    
    config: {
        /**
         * @cfg {String} message
         * The error message to return when the value is not a valid email
         */
        message: 'is not a valid file',
        /**
         * @cfg {Array} extensions
         * The allowed filename extensions.
         */
        extensions: [],
        /**
         * @cfg {Array} extension
         * @deprecated Please use #extensions instead
         * Backwards compatibility with Bancha before 2.3
         */
        extension: false
    },

    /**
     * Validates that the given filename is of the configured extension. Also validates
     * if no extension are defined and empty values.
     * 
     * @param {Object} value The value
     * @param {Ext.data.Model} record The record
     * @return {Boolean/String} `true` if the value is valid. A string may be returned if the value 
     * is not valid, to indicate an error message. Any other non `true` value indicates the value
     * is not valid.
     */
    validate: function(filename, record) {
        var validExtensions = this.getExtension() || this.getExtensions();
        if(!filename) {
            return true; // no file defined (emtpy string or undefined)
        }
        if(!Ext.isDefined(validExtensions)) {
            return true;
        }
        var ext = filename.split('.').pop();
        return Ext.Array.contains(validExtensions,ext) || this.getMessage();
    }
});
