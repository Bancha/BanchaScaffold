/*!
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2012 Roland Schuetz
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @package       Bancha.scaffold.samples
 * @copyright     Copyright 2011-2012 Roland Schuetz
 * @link          http://scaffold.banchaproject.org
 * @since         Bancha.scaffold 0.5.1
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha v PRECOMPILER_ADD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.banchaproject.org
 */
/*jslint browser: true, vars: true, undef: true, nomen: true, eqeq: false, plusplus: true, bitwise: true, regexp: true, newcap: true, sloppy: true, white: true */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:true, regexp:true, undef:true, trailing:false */
/*global Ext, Bancha */

// API and Bancha is already included,
// now load sample dependencies
Ext.require([
    'Ext.form.*',
    'Ext.grid.*'
]);

// init Provider
Ext.direct.Manager.addProvider(Bancha.REMOTE_API);


// setup the path to the delete image in local environments
Bancha.scaffold.Grid.destroyButtonConfig.items[0].icon = 'img/icons/delete.png';

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
            type: 'file',
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

Ext.onReady(function() {

    // ... create a full featured users grid
    Ext.create('Ext.grid.Panel', {
        title: 'Easily scaffold full CRUD support, based on the models proxy',

        scaffold: 'Bancha.model.User', // model name
        
        // basic scaffold configs con be set directly
        enableCreate : true,
        enableUpdate : true,
        enableDestroy: true,
        enableReset  : true,
        
        // some additional styles
        height: 350,
        width: 650,
        frame: true,
        renderTo: 'gridpanel'
    });

    // ... a simple example how you can extend it with regular code
    Ext.create('Ext.grid.Panel', {
        title: 'Starting from the Scaffoldign you can easily add your own code',
        
        // we don't need an editable grid for this example
        enableCreate: false,
        enableUpdate: false,
        enableDestroy: false,
        
        // configure scaffolding
        scaffold: {
            // model name
            target: 'Bancha.model.Article',

            // configure paging
            storeDefaults: {
                autoLoad: true,
                pageSize: 10,
                remoteSort: true
            },

            // add a paging bar
            afterBuild: function(config) {
                // paging bar on the bottom
                config.bbar = Ext.create('Ext.PagingToolbar', {
                    store: config.store,
                    displayInfo: true,
                    displayMsg: 'Displaying entry {0} - {1} of {2}',
                    emptyMsg: 'No entires to display'
                });
                return config;
            } //eo afterBuild
        },
        
        // add some styling
        height: 300,
        width: 650,
        frame: true,
        renderTo: 'paginated-gridpanel'
    });

    // and a form panel
    Ext.create('Ext.form.Panel', {
        title: 'Demonstration of a scaffolded Form',
        
        // basic scaffold configs can be set directly
        banchaLoadRecord: false,
        enableReset: true,
        
        // model name and advanced configs can be set here
        scaffold: {
            // model name
            target: 'Bancha.model.User',
            
            // we're using the after interceptor for more complex changes
            afterBuild: function(formConfig) {
                
                // add another button
                formConfig.buttons.unshift({
                    text: 'Load Sample Record',
                    iconCls: 'icon-edit-user',
                    handler: function() {
                        var panel = this.getPanel(), // scopeButtonHandler enables this
                            form = this.getForm(); // scopeButtonHandler enables this
                        
                        // load the form
                        panel.load({
                            params: {
                                data: { data: { id:1 } }
                            }
                        });
                        
                        // change the header title
                        panel.setTitle('Demonstration of a scaffolded Form - Change Record 1');
                    },
                    scope: this.buildButtonScope(formConfig.id) // this is currently not very elegant, we will solve this in future releases
                });
                
                return formConfig;
            } //eo afterBuild
        }, // eo scaffoldConfig
        
        api: {
            load    : Bancha.RemoteStubs.User.read,
            submit  : Bancha.RemoteStubs.User.submit
        },
        
        // some additional styles
        width: 650,
        frame:true,
        renderTo: 'formpanel',
        id: 'form',
        bodyStyle:'padding:5px 5px 0',
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 75
        },
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        }
    }); // eo create

});

// eof
