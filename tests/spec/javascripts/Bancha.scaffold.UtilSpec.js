/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2012 Roland Schuetz
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * Bancha.scaffold.Util Tests
 *
 * @package       Bancha.scaffold.Test
 * @copyright     Copyright 2011-2012 Roland Schuetz
 * @link          http://scaffold.banchaproject.org
 * @since         Bancha.scaffold 0.5.0
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha v PRECOMPILER_ADD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.banchaproject.org
 */
/*jslint browser: true, vars: true, undef: true, nomen: true, eqeq: false, plusplus: true, bitwise: true, regexp: true, newcap: true, sloppy: true, white: true */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:true, regexp:true, undef:true, trailing:false */
/*global Ext, Bancha, describe, it, beforeEach, expect, jasmine, Mock, BanchaScaffoldSpecHelper */

describe("Bancha.scaffold.Util tests",function() {
    var util = Bancha.scaffold.Util;
        
    it("should pass all Bancha.scaffold.Util.toFirstUpper tests", function() {
        expect('User').toEqual(util.toFirstUpper('user'));
        expect('UserName').toEqual(util.toFirstUpper('userName'));
    });


    it("should pass all Bancha.scaffold.Util.humanize tests", function() {

        // first upper case
        expect('User').toEqual(util.humanize('user'));

        // ids
        expect('User').toEqual(util.humanize('user_id'));

        // underscores
        expect('User name').toEqual(util.humanize('user_name'));
        expect('Name with many spaces').toEqual(util.humanize('name_with_many_spaces'));

        // camel case
        expect('User name').toEqual(util.humanize('userName'));
        expect('Name with many spaces').toEqual(util.humanize('nameWithManySpaces'));

        // shouldn't change normal text
        expect('John Smith').toEqual(util.humanize('John Smith'));
        expect('This is a normal text with spaces, Upper case words and all UPPER CASE words!'
               ).toEqual(util.humanize('This is a normal text with spaces, Upper case words '+
               'and all UPPER CASE words!'));
    });
    
    it("should humanize class names", function() {
        // Standard namespaced and not namespaced
        expect('User').toEqual(util.humanizeClassName('Bancha.model.User'));
        expect('User').toEqual(util.humanizeClassName('Bancha.User'));
        expect('User').toEqual(util.humanizeClassName('User'));

        // check humanizing part
        expect('Awesome class').toEqual(util.humanizeClassName('Bancha.model.AwesomeClass'));
    });

    it("should replace button placeholder from an button config", function() {

        expect().toEqual(util.replaceButtonPlaceHolders()); //undefined
        expect([]).toEqual(util.replaceButtonPlaceHolders([])); //empty

        var config = {
            createButtonConfig: {
                myCreate: true
            },
            resetButtonConfig: {
                myReset: true
            },
            saveButtonConfig: {
                mySave: true
            },
            onCreate: function(a) {},
            onReset: function(b) {},
            onSave: function(c) {}
        };
        var scope =  {
            scoped:true
        };


        // test create button
        var expected = ['->',{
            myCreate: true,
            scope: scope,
            handler: config.onCreate
        }];
        expect(util.replaceButtonPlaceHolders(['->','create'], config, scope)).toEqual(expected);


        // test reset button
        expected.push({
            myReset: true,
            scope: scope,
            handler: config.onReset
        });
        expect(expected).toEqual(util.replaceButtonPlaceHolders(['->','create','reset'], config, scope));


        // test save button
        expected.push({
            mySave: true,
            scope: scope,
            handler: config.onSave
        });
        expect(expected).toEqual(util.replaceButtonPlaceHolders(['->','create','reset','save'], config, scope));

        // test with only the save button
        expected = [expected[3]];
        expect(expected).toEqual(util.replaceButtonPlaceHolders(['save'], config, scope));

        // test support for custom configs
        expected.push({
            myCustom: 'button-config'
        });
        expect(expected).toEqual(util.replaceButtonPlaceHolders(['save', {myCustom: 'button-config'}], config, scope));
    });
}); //eo scaffold util functions

//eof
