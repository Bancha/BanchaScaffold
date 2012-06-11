/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2012 Roland Schuetz
 *
 * @package       Scaffold
 * @copyright     Copyright 2011-2012 Roland Schuetz
 * @link          http://banchaproject.org/bancha-scaffold.html
 * @since         Scaffold 0.0.1
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Scaffold v 0.5.1
 *
 * For more information go to http://banchaproject.org/bancha-scaffold.html
 */
/*jslint browser: true, vars: true, undef: true, nomen: true, eqeq: false, plusplus: true, bitwise: true, regexp: true, newcap: true, sloppy: true, white: true */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:true, regexp:true, undef:true, trailing:false */
/*global Ext:false, Bancha:false, window:false */


Ext.require(['Ext.form.field.VTypes'], function () {

    var filenameHasExtension = function (filename, validExtensions) {
        if (!filename) {
            return true; // no file defined
        }
        if (!Ext.isDefined(validExtensions)) {
            return true;
        }
        var ext = filename.split('.').pop();
        return Ext.Array.contains(validExtensions, ext);
    };

    /**
     * @class Ext.form.field.VTypes
     * Custom VTypes for scaffolding support
     * @author Roland Schuetz <mail@rolandschuetz.at>
     * @docauthor Roland Schuetz <mail@rolandschuetz.at>
     */
    Ext.apply(Ext.form.field.VTypes, {
        /**
         * @method
         * Validates that the file extension is of one of field.validExtensions
         * Also true if field.validExtensions is undefined or if val is an empty string
         */
        fileExtension: function (val, field) {
            return filenameHasExtension(val, field.validExtensions);
        },
        /**
         * @property
         * The error text to display when the file extension validation function returns false. Defaults to: 'This file type is not allowed.'
         */
        fileExtensionText: 'This file type is not allowed.',
        /**
         * @property
         * The keystroke filter mask to be applied on alpha input. Defaults to: /[\^\r\n]/
         */
        fileExtensionMask: /[\^\r\n]/ // alow everything except new lines
    });
}); //eo require

//eof
