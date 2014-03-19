/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2014 codeQ e.U.
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * Ext.data.validations extionsion tests
 *
 * @package       Bancha.scaffold.tests
 * @copyright     Copyright 2011-2014 codeQ e.U.
 * @link          http://scaffold.bancha.io
 * @since         Bancha Scaffold v 0.5.0
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha Scaffold v PRECOMPILER_ADD_BANCHA_SCAFFOLD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.bancha.io
 */

describe("Ext.data.validations tests", function() {

    var validations = Ext.data.validations;

    // since file validation uses the same internal function as vtype we don't need extensive tests
    it("should allow validate file extensions", function() {
        var config = {type: 'file', field: 'avatar', extension:['jpg','jpeg','gif','png']};
        expect(validations.file(config,'user.gif')).toBeTruthy();
        expect(validations.file(config,'user.doc')).toBeFalsy();
    });

    it("should pass ranges with no configs when they are numbers", function() {
        var config = {type: 'range', field: 'euro'};
        expect(validations.range(config,34)).toBeTruthy();
        expect(validations.range(config,3.4)).toBeTruthy();
        expect(validations.range(config,'3.4')).toBeTruthy();
    });

    it("should validate min of ranges", function() {
        var config = {type: 'range', field: 'euro', min:0};
        expect(validations.range(config,3.4)).toBeTruthy();
        expect(validations.range(config,0)).toBeTruthy();
        expect(validations.range(config,-3.4)).toBeFalsy();
    });

    it("should validate max of ranges", function() {
        var config = {type: 'range', field: 'euro', max: 10};
        expect(validations.range(config,2)).toBeTruthy();
        expect(validations.range(config,10)).toBeTruthy();
        expect(validations.range(config,11)).toBeFalsy();
    });

    it("should validate min and max of ranges", function() {
        var config = {type: 'range', field: 'euro', min:0, max: 10};
        expect(validations.range(config,-3.4)).toBeFalsy();
        expect(validations.range(config,0)).toBeTruthy();
        expect(validations.range(config,10)).toBeTruthy();
        expect(validations.range(config,11)).toBeFalsy();
    });
});
