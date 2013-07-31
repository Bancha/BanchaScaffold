/*
 *
 * Bancha Scaffolding Library
 * Copyright 2011-2013 codeQ e.U.
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @package       Bancha.scaffold
 * @copyright     Copyright 2011-2013 codeQ e.U.
 * @link          http://scaffold.banchaproject.org
 * @since         Bancha Scaffold v 0.0.1
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha Scaffold v PRECOMPILER_ADD_BANCHA_SCAFFOLD_RELEASE_VERSION
 *
 * For more information go to http://scaffold.banchaproject.org
 */

/**
 * @singleton
 * @class Bancha.scaffold.Util
 * **This is only available inside Ext JS.**
 *
 * Some scaffolding util functions for {@link Ext.grid.Panel} and {@link Ext.form.Panel}.
 *
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @docauthor Roland Schuetz <mail@rolandschuetz.at>
 */
Ext.define('Bancha.scaffold.Util', {
    singleton: true,

    /**
     * Makes the first letter of an string upper case.
     * @param {String} str The string to transform
     * @return {String} The transformed string with a first letter upper case
     */
    toFirstUpper: function (str) {
        if (typeof str !== 'string') {
            return str;
        }
        if (str.length === 1) {
            return str.toUpperCase();
        }
        return str[0].toUpperCase() + str.substr(1);
    },
    /**
     * Capitalizes the first word, turns underscores into spaces and strips 
     * trailing *'_id'*.
     *
     * Also it converts camel case by finding upper case letters right after 
     * lower case and replaceing the upper case with an space and lower case.
     *
     * examples:
     *     "user_name"  -> "User name"
     *     "userName"   -> "User name"
     *     "John Smith" -> "John Smith"
     *
     * @param {String} str
     * @return {String} The transformed string
     */
    humanize: function (str) {
        str = str.replace(/_id/g, ''); // delete _id from the string
        str = str.replace(/_/g, ' '); // _ to spaces
        str = str.replace(/([a-z])([A-Z])/g, function (all, first, second) {
            return first + " " + second.toLowerCase();
        }); // convert camel case (only)
        return this.toFirstUpper(str);
    },
    /**
     * Transforms a namespacd class name like *'Bancha.model.AwesomeArticle'*
     * and transforms it into a name you can show to users, in this case
     * *'Awesome article'*.
     *
     * For details on how the transformation, see also {@link #humanize}
     *
     * @param {String} classname A full classname to humanize
     * @return {String} The transformed string
     */
    humanizeClassName: function(classname) {
        // get the class name without any namespacing
        if(classname.indexOf('.')) {
            classname = classname.substr(classname.lastIndexOf('.')+1);
        }
        return this.humanize(classname);
    },
    /**
     * Makes every words first letter upper case.
     *
     * @param {String} str String of words, separated by space
     * @return {String} The transformed string
     */
    toTitle: function(str) {
        return str.replace(/ ([a-z])/g, function (all, letter) {
            return ' ' + letter.toUpperCase();
        });
    },
    /**
     * @private
     * DEPRECATED - CURRENTLY NOT USED
     * This enables the developer to change the default scaffolding functions at any time
     * and the Scaffold Library will always use the current functions, since there are no references
     * @member Bancha.scaffold.Util
     */
    createFacade: function (scopeName, scope, method) {
        // IFDEBUG
        /*
         * totally stupid, but we need a singleton pattern in debug mode here, since
         * jasmine provides us only with VERY little compare options
         */
        this.singletonFns = this.singletonFns || {};
        this.singletonFns[scopeName] = this.singletonFns[scopeName] || {};
        this.singletonFns[scopeName][method] = this.singletonFns[scopeName][method] ||
        function () {
            return scope[method].apply(this, arguments);
        };
        return this.singletonFns[scopeName][method];
        // ENDIF
        /* IFPRODUCTION
        return function() {
        return scope[method].apply(scope,arguments);
        };
        ENDIF */
    },
    /**
     * @private
     * This function will search for 'create', 'reset' and 'save' and will
     * properly replace them with the values from the config object
     *
     * It will also inject the scope into all elements where the scope
     * equals 'scaffold-scope-me'
     *
     * @param {String[],Ext.button.Button[]} buttons the  button config, e.g. ['->','create','reset','save']
     * @param {Bancha.scaffold.form.Config|Bancha.scaffold.grid.Config} config The config with all necessary replacements (onCreate, createButtonConfig, onReset, ...)
     * @param buttonScope the scope, that's applied to all replaced buttons
     * @return {String[],Ext.button.Button[]} The build buttons array
     */
    replaceButtonPlaceHolders: function(buttons, config, buttonScope) {
        if(typeof buttons === 'undefined' || buttons.length===0) {
            return buttons;
        }

        for(var i=0, len=buttons.length; i<len; i++) {
            switch(buttons[i]) {
                case 'create':
                    buttons[i] = Ext.apply(config.createButtonConfig, {
                        scope: buttonScope,
                        handler: config.onCreate
                    });
                    break;
                case 'reset':
                    buttons[i] = Ext.apply(config.resetButtonConfig, {
                        scope: buttonScope,
                        handler: config.onReset
                    });
                    break;
                case 'save':
                    buttons[i] = Ext.apply(config.saveButtonConfig, {
                        scope: buttonScope,
                        handler: config.onSave
                    });
                    break;
                default:
                    // check if we should inject a scope
                    if(buttons[i].scope === 'scaffold-scope-me') {
                        buttons[i].scope = buttonScope;
                    }
            }
        }

        return buttons;
    },
    /**
     * @method
     * For separation of concerns, gets/creates a store.
     *
     * Used to build the grid store and to build associated stores.
     *
     * @param {Ext.data.Model} model A model
     * @param {Bancha.scaffold.form.Config|Bancha.scaffold.grid.Config} config (optional) 
     * A config object with the properties oneStorePerModel, storeDefaults and storeDefaultClass
     * @return {Ext.data.Store} The store
     */
    getStore: (function (model, config) {
        var stores = {};

        return function (model, config) {
            var modelName = Ext.ClassManager.getName(model),
                store;
            config = config || {};
            if (config.oneStorePerModel && stores[modelName]) {
                return stores[modelName];
            }

            store = Ext.create(config.storeDefaultClass || "Ext.data.Store", Ext.apply({
                model: modelName
            }, Ext.clone(config.storeDefaults || {})));

            if (config.oneStorePerModel) {
                stores[modelName] = store;
            }

            return store;
        };
    }()),
    /**
     * This method can be overriden by your own needs.
     *
     * Tries to find the most usefull model field for dispaying. This is
     * used in the Grid scaffolding renderer for associations and can be
     * overwritten at any time.
     *
     * By default it used the models "displayField" config, which just exists
     * in Bancha Scaffold and soon should be implemented in Bancha for CakePHP.
     *
     * @param {Ext.data.Model} model The model to look through
     * @return {String} The most accurate field name
     */
    getDisplayFieldName: function(model) { // Connect with CakePHP
        // if defined use the display field config
        if(Ext.isString(model.displayField)) {
            return model.displayField;
        }

        // get the field names
        var fieldNames = Ext.Array.pluck(model.getFields(), 'name');

        // try to find name, title or code
        if(fieldNames.indexOf('name') !== -1) {
            return 'name';
        }
        if(fieldNames.indexOf('title') !== -1) {
            return 'title';
        }
        if(fieldNames.indexOf('code') !== -1) {
            return 'code';
        }

        // nothing usefull found
        return model.idProperty || fieldNames[0];
    },
    /**
     * This function may need to be customized, it generates the expected model associations "name" value,
     * to check if this field has a association (this is used for replacing id values with actual data).
     *
     * The default uses CakePHP naming conventions, e.g.
     * fieldname *'book_author_id'* expects association name *'bookAuthors'*
     * @param {String} modelFieldName The fields name of an model, e.g. 'title'
     * @param {String} associationType The association type, e.g. belongsTo
     * @return {String} The guessed association name
     */
    fieldNameToModelAssociationName: function(modelFieldName, associationType) {
        if(!Ext.isString(modelFieldName)) {
            return;
        }

        var parts = modelFieldName.split('_');
        if(parts.length<2 || parts[parts.length-1] !== 'id') {
            return;
        }
        parts.pop(); // remove 'id'

        var name = parts.shift(); // the first stays lower case
        Ext.each(parts, function(part) {
            name += part.substr(0,1).toUpperCase() + part.substr(1);
        });

        return associationType==='belongsTo' ? name : name+'s';
    },
    /**
     * Returns the corresponding association for a given field, or false.
     *
     * @param {Ext.data.Field} field The model field to look for an association (belongsTo)
     * @param {Ext.data.Model} model The fields model
     * @return {Ext.data.association.belongsTo|False} The found association or false
     */
    getBelongsToAssociation: function(field, model) {
        var associationName = this.fieldNameToModelAssociationName(field.name, 'belongsTo'),
            associations = Ext.isFunction(model.getAssociations) ? model.getAssociations():
                            (model.prototype ? model.prototype.associations : false),
            association = (associationName && associations) ? associations.get(associationName) : false;

        return association;
    }
});
