/*
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2014 codeQ e.U.
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @package       Bancha.scaffold
 * @copyright     Copyright 2011-2014 codeQ e.U.
 * @link          http://scaffold.bancha.io
 * @since         Bancha Scaffold v 0.5.3
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha Scaffold v PRECOMPILER_ADD_BANCHA_SCAFFOLD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.bancha.io
 */

/**
 * @class Bancha.scaffold.grid.ManagementPanel
 * **This is only available inside Ext JS.**
 *
 * This will create a TabPanel with one tab per model.
 * It will autodetect the models capabilities from the proxy.
 *
 * Example:
 *
 *     Ext.create('Bancha.scaffold.grid.ManagementPanel', {
 *         models: [
 *             'MyApp.model.User',
 *             'MyApp.model.Post'
 *         ]
 *     });
 *
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @docauthor Roland Schuetz <mail@rolandschuetz.at>
 */
Ext.define('Bancha.scaffold.grid.ManagementPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.managementpanel',

    /**
     * @cfg {String[]|Ext.data.Model[]} models
     * Define the models which should be added to the panel.
     */
    models: [],
    /**
     * @cfg {Object} panelDefaults
     * This config will be applied to each model grid and will overwrite
     * scaffolded code
     */
    panelDefaults: {},
    /**
     * @cfg {Object} scaffoldDefaults
     * This config will be applied to each model grid's scaffold property
     * and will overwrite scaffolded code
     */
    scaffoldDefaults: {},
    initComponent: function () {
        //<debug>
        if(!Ext.isArray(this.models)) {
            Ext.Error.raise({
                plugin: 'Bancha Scaffold',
                msg: ['Bancha.scaffold.grid.ManagementPanel\'s models config has to be an array, ',
                     'instead got ' + this.scaffold + ' (of type ' + (typeof this.scaffold) + ')'
                ].join('')
            });
        }
        //</debug>
        this.models = this.models || [];
        this.items = this.items || [];

        // build up all screens
        var items = this.items,
            me = this;
        Ext.each(this.models, function(model) {
            var modelName = Ext.isString(model) ? model : model.getName();
            model = Bancha.scaffold.Util.getModel(modelName);

            // probably some newbies confuse the namespaced and unnamespaced model names
            // so for Bancha users also support not namespaced version
            if(!model && Bancha.modelNamespace) {
                model = Bancha.scaffold.Util.getModel(Bancha.modelNamespace + '.' + modelName);
            }

            //<debug>
            if(!model) {
                Ext.Error.raise({
                    plugin: 'Bancha Scaffold',
                    msg: ['Bancha.scaffold.grid.ManagementPanel\'s models config had a model input "',
                            modelName + '" (of type ' + (typeof modelName) + '), ',
                            'which is not a valid model name'].join('')
                });
            }
            //</debug>

            var tabitem = {
                xtype: 'gridpanel',
                title: Bancha.scaffold.Util.toTitle(
                            Bancha.scaffold.Util.humanizeClassName(modelName)),
                scaffold: {
                    target: modelName,
                    buttons: false,
                    deletable: true
                }
            };

            // create a new object
            var proxy = model.getProxy();
            if(proxy.api) {
                // it's an ext direct proxy
                var buttons = ['->'];
                if(proxy.api.create) {
                    buttons.push('create');
                }
                if(proxy.api.create || proxy.api.update) {
                    buttons.push('reset');
                    buttons.push('save');
                }
                if(buttons.length > 1) {
                    // the model supports create and/or save
                    tabitem.scaffold.buttons = buttons;
                } else {
                    tabitem.scaffold.editable = false;
                }
                if(!proxy.api.destroy) {
                    tabitem.scaffold.deletable = false;
                }
            } else if(proxy.writer) {
                // we can see that there is a writer, so provide all buttons
                delete tabitem.scaffold.buttons;
            }

            // add panel configs and possibly overwrite scaffolded code
            tabitem = Ext.apply(tabitem, me.panelDefaults);
            tabitem.scaffold = Ext.apply(tabitem.scaffold, me.scaffoldDefaults);

            // add tab to items
            items.push(tabitem);
        }); //eo each

        this.callParent();
    }
});
