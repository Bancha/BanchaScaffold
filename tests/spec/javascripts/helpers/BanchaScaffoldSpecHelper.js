/*!
 * Helper for banchaspecific internal code
 * Copyright(c) 2011-2012 Roland Schuetz
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @copyright (c) 2011-2012 Roland Schuetz
 */
/*jslint browser: true, vars: true, undef: true, nomen: true, eqeqeq: false, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*global Ext, Bancha, describe, it, beforeEach, expect, jasmine, BanchaSpecHelper */

/** helpers */
BanchaScaffoldSpecHelper = {
    sampleModelData: {
        extend: 'Ext.data.Model',
        idProperty: 'id',
        proxy: {
            type: 'direct',
            api: {
                read: function() { console.info('read'); }
            }
        },
        fields: [
            {name:'id', type:'int'},
            {name:'name', type:'string'},
            {name:'login', type:'string'},
            {name:'created', type:'date'},
            {name:'email', type:'string'},
            {name:'avatar', type:'string'},
            {name:'weight', type:'float'},
            {name:'height', type:'int'}
        ],
        associations: [
            {type:'hasMany', model:'Post', name:'posts'},
            {type:'belongsTo', model:'Country', name:'country'}
        ],
        validations: [
            { type:"numberformat", field:"id", precision:0},
            { type:"presence",     field:"name"},
            { type:"length",       field:'name', min: 2},
            { type:"length",       field:"name", max:64},
            { type:"format",       field:"login", matcher:"banchaAlphanum"}
        ],
        sorters: [{
            property: 'name',
            direction: 'ASC'
        }]
    },
    getSampleModel: function(name,/*optional*/config) {
        return Ext.define(name,Ext.applyIf(config || {}, BanchaScaffoldSpecHelper.sampleModelData));
    }
};


beforeEach(function() {
    this.addMatchers({
        toEqualConfig: function(expected) {
            var config = Ext.clone(this.actual);
            delete config.scaffold;
            delete config.scaffoldLoadRecord;
            delete config.scaffold;
            delete config.scaffoldConfig; // deprecated
            delete config.enableCreate;
            delete config.enableUpdate;
            delete config.enableDestroy;
            delete config.enableReset;
            // test
            expect(config).toEqual(expected);
            // test is already done above
            return true;
        }
    });
});


//eof
