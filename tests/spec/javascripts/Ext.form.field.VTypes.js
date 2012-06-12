/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2012 Roland Schuetz
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * Ext.form.field.VTypes extionsion Tests
 *
 * @copyright     Copyright 2011-2012 Roland Schuetz
 * @link          http://scaffold.banchaproject.org
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 *
 * For more information go to http://scaffold.banchaproject.org
 */
/*jslint browser: true, vars: true, undef: true, nomen: true, eqeq: false, plusplus: true, bitwise: true, regexp: true, newcap: true, sloppy: true, white: true */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:true, regexp:true, undef:true, trailing:false */
/*global Ext, Bancha, describe, it, beforeEach, expect, jasmine, Mock, BanchaScaffoldSpecHelper */

describe("Ext.form.field.VTypes tests",function() {
    
    var vtype = Ext.form.field.VTypes;
        
    it("should allow undefined file extensions when testing with #fileExtension", function() {
        expect(vtype.fileExtension('',{validExtensions:['jpg']})).toBeTruthy();
    });
    it("should allow valid file extensions when testing with #fileExtension", function() {
        expect(vtype.fileExtension('user.jpg',{validExtensions:['jpg']})).toBeTruthy();
        expect(vtype.fileExtension('user.jpg',{validExtensions:['jpg','jpeg','gif']})).toBeTruthy();
        expect(vtype.fileExtension('user.with.points.jpg',{validExtensions:['jpeg','jpg','gif']})).toBeTruthy();
    });
    it("should pass #fileExtension validation if no validExtensions property is undefined", function() {
        expect(vtype.fileExtension('user.jpg',{})).toBeTruthy();
    });
    it("should not allow wrong file extensions when testing with #fileExtension", function() {
        expect(vtype.fileExtension('user.jpg',{validExtensions:[]})).toBeFalsy();
        expect(vtype.fileExtension('user.doc',{validExtensions:['jpg','jpeg','gif']})).toBeFalsy();
        expect(vtype.fileExtension('user.jpg.txt',{validExtensions:['jpeg','jpg','gif']})).toBeFalsy();
    });

}); //eo vtype tests

//eof
