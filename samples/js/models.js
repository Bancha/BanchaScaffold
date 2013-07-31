/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2013 codeQ e.U.
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @package       Bancha.scaffold.samples
 * @copyright     Copyright 2011-2013 codeQ e.U.
 * @link          http://scaffold.banchaproject.org
 * @since         Bancha Scaffold v 0.5.1
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha Scaffold v PRECOMPILER_ADD_BANCHA_SCAFFOLD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.banchaproject.org
 */

// init Ext.Direct Provider
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
            root: 'data',
            messageProperty: 'message'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    },
    idProperty:'id',
    fields:[
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
            type:'int'
        }],
        validations:[{
            type:'presence',
            field:'title'
        },{
            type:'numberformat',
            field:'user_id'
        }
    ],
    associations:[
        {
          type:'belongsTo',
           model:'Bancha.model.User',
           name:'users'
        }
    ]
});

// define the user model
Ext.define('Bancha.model.User', {
    extend: 'Ext.data.Model',
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
            root: 'data',
            messageProperty: 'message'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
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
    validations: [
        {
            type: 'numberformat',
            field: 'id',
            'precision': 0
        }, {
            type: 'presence',
            field: 'name'
        }, {
            type: 'length',
            field: 'name',
            min: 3,
            max: 64
        }, {
            type: 'presence',
            field: 'login'
        }, {
            type: 'length',
            field: 'login',
            min: 3,
            max: 64
        }, {
            type: 'format',
            field: 'login',
            matcher: /^[a-zA-Z0-9_]+$/ // alphanum regex
        }, {
            type: 'presence',
            field: 'email'
        }, {
            type: 'format',
            field: 'email',
            matcher: /^(\w+)([\-+.][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/ // email regex
        }, {
            type: 'numberformat',
            field: 'weight',
            precision: 2
        }, {
            type: 'numberformat',
            field: 'height',
            precision: 0
        }, {
            type: 'numberformat',
            field: 'height',
            min: 50,
            max: 300
        }, {
            type: 'file', // todo should create a file upload field
            field: 'avatar',
            extension: ['gif', 'jpeg', 'png', 'jpg']
        }
    ],
    associations: [
        {
            type: 'hasMany',
            model: 'Bancha.model.Article',
            name: 'articles'
        }
    ]
});


// define book model (for management panel)
Ext.define('Bancha.model.Book', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'direct',
        batchActions: false,
        api: {
            read    : Bancha.RemoteStubs.Book.read
        },
        reader: {
            type: 'json',
            root: 'data',
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
            type:'int'
        }],
        validations:[{
            type:'presence',
            field:'title'
        },{
            type:'numberformat',
            field:'user_id'
        }
    ],
    associations:[
        {
          type:'belongsTo',
           model:'Bancha.model.User',
           name:'users'
        }
    ]
});


// eof
