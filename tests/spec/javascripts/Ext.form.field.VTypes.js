/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2013 codeQ e.U.
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * Ext.form.field.VTypes extionsion tests
 *
 * @package       Bancha.scaffold.tests
 * @copyright     Copyright 2011-2013 codeQ e.U.
 * @link          http://scaffold.banchaproject.org
 * @since         Bancha Scaffold v 0.5.0
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha Scaffold v PRECOMPILER_ADD_BANCHA_SCAFFOLD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.banchaproject.org
 */

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

});
