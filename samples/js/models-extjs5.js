/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2014 codeQ e.U.
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @package       Bancha.scaffold.samples
 * @copyright     Copyright 2011-2014 codeQ e.U.
 * @link          http://scaffold.bancha.io
 * @since         Bancha Scaffold v 0.5.1
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha Scaffold v PRECOMPILER_ADD_BANCHA_SCAFFOLD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.bancha.io
 */

// init Ext.Direct Provider
Ext.syncRequire('Ext.direct.Manager');
Ext.direct.Manager.addProvider(Bancha.REMOTE_API);

// define the article model
Ext.define('Bancha.model.Article', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'direct',
        batchActions: false,
        api: {
            read    : Bancha.RemoteStubs.Article.read,
            create  : Bancha.RemoteStubs.Article.create,
            update  : Bancha.RemoteStubs.Article.update,
            destroy : Bancha.RemoteStubs.Article.destroy
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            rootProperty: 'data'
        }
    },
    idProperty:'id',
    fields: [
        {
            name:'id',
            type:'int'
        },{
            name:'title',
            type:'string'
        },{
            name:'date',
            type:'date',
            dateFormat:'Y-m-d H:i:s'
        },{
            name:'body',
            type:'string'
        },{
            name:'published',
            type:'boolean'
        },{
            name:'user_id',
            type:'int',
            reference: 'Bancha.model.User'
        }
    ],
    validators: {
        name: { type: 'presence' },
        user_id: { type: 'range', min: 0 }
    }
});

// define the user model
Ext.define('Bancha.model.User', {
    extend: 'Ext.data.Model',
    requires: ['Bancha.scaffold.data.Validators'],
    proxy: {
        type: 'direct',
        batchActions: false,
        api: {
            read    : Bancha.RemoteStubs.User.read,
            create  : Bancha.RemoteStubs.User.create,
            update  : Bancha.RemoteStubs.User.update,
            destroy : Bancha.RemoteStubs.User.destroy
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            rootProperty: 'data'
        }
    },
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'login',
            type: 'string'
        }, {
            name: 'created',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s'
        }, {
            name: 'email',
            type: 'string'
        }, {
            name: 'avatar',
            type: 'string'
        }, {
            name: 'weight',
            type: 'float'
        }, {
            name: 'height',
            type: 'int'
        }
    ],
    validators: {
        name: [
            { type: 'presence' },
            { type: 'length', min: 3, max: 64 }
        ],
        login: [
            { type: 'presence' },
            { type: 'length', min: 3, max: 64 },
            { type: 'format', matcher: /^[a-zA-Z0-9_]+$/ } // alphanum regex
        ],
        email: [
            { type: 'presence' },
            { type: 'format', matcher: /^(\w+)([\-+.][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/ } // email regex
        ],
        weight: { type: 'range', min: 0, 'precision': 2 },
        height: { type: 'range', min: 50, max: 300, 'precision': 0 },
        avatar: { type: 'file', extension: ['gif', 'jpeg', 'png', 'jpg'] }
    }
});


// define book model (for management panel)
Ext.define('Bancha.model.Book', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'direct',
        batchActions: false,
        api: {
            read: Bancha.RemoteStubs.Book.read
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message'
        }
    },
    idProperty: 'id',
    fields: [
        {
            name:'id',
            type:'int'
        },{
            name:'title',
            type:'string'
        },{
            name:'published',
            type:'boolean'
        },{
            name:'user_id',
            type:'int',
            reference: 'Bancha.model.User'
        }
    ],
    validators: {
        id: { type: 'range', min: 0, precision: 0 },
        title: [
            { type: 'presence' },
            { type: 'length', min: 3, max: 64 }
        ],
        user_id: { type: 'range', precision: 0 }
    }
});
