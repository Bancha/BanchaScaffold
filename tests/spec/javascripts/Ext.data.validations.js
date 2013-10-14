/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2013 codeQ e.U.
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * Ext.data.validations extionsion tests
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

describe("Ext.data.validations tests", function() {

    var validations = Ext.data.validations;

    // since file validation uses the same internal function as vtype we don't need extensive tests
    it("should allow validate file extensions", function() {
        var config = {type: 'file', field: 'avatar', extension:['jpg','jpeg','gif','png']};
        expect(validations.file(config,'user.gif')).toBeTruthy();
        expect(validations.file(config,'user.doc')).toBeFalsy();
    });

    it("should pass numberformats with no configs when they are numbers", function() {
        var config = {type: 'numberformat', field: 'euro'};
        expect(validations.numberformat(config,34)).toBeTruthy();
        expect(validations.numberformat(config,3.4)).toBeTruthy();
        expect(validations.numberformat(config,'3.4')).toBeTruthy();
    });

    it("should validate min of numberformats", function() {
        var config = {type: 'numberformat', field: 'euro', min:0};
        expect(validations.numberformat(config,3.4)).toBeTruthy();
        expect(validations.numberformat(config,0)).toBeTruthy();
        expect(validations.numberformat(config,-3.4)).toBeFalsy();
    });

    it("should validate max of numberformats", function() {
        var config = {type: 'numberformat', field: 'euro', max: 10};
        expect(validations.numberformat(config,2)).toBeTruthy();
        expect(validations.numberformat(config,10)).toBeTruthy();
        expect(validations.numberformat(config,11)).toBeFalsy();
    });

    it("should validate min and max of numberformats", function() {
        var config = {type: 'numberformat', field: 'euro', min:0, max: 10};
        expect(validations.numberformat(config,-3.4)).toBeFalsy();
        expect(validations.numberformat(config,0)).toBeTruthy();
        expect(validations.numberformat(config,10)).toBeTruthy();
        expect(validations.numberformat(config,11)).toBeFalsy();
    });
});
