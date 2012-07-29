[![Bancha Scaffold - Easy Prototyping](http://scaffold.banchaproject.org/images/bancha-scaffold.jpg)](http://scaffold.banchaproject.org/)


Bancha Scaffold Library (Beta)
==============================

The Bancha ExtJS 4 Scaffold library helps you easily prototype Ext.grid.Panels and Ext.form.Panels, helping you creating beautiful prototypes in minutes. And it it completly free and open source!

Features
--------

* Scaffold grids configurations
* Scaffold form configurations
* Provides default create, edit and delete handling
* Recognizes and maps field types
* Provides interceptors
* and a lot of configurations!


Usage
-----

To use the latest stable code just include build/bancha-scaffold-debug.js into your project. 
For more information got to [http://scaffold.banchaproject.org](http://scaffold.banchaproject.org)

License
-------

For everything except the builder-folder:

__This library is open source and freely available both under the GPL and the MIT license.__
Please keep the original file headers and if you further develop or include it into another project, please provide a reference to the original project.

We are also happy for any additions, bug reports and feedback!


Setting up the samples
----------------------

To use the samples locally just point your apache root to this folder and open your browser with localhost/samples/


Building an release
-------------------

1. Install Phing
1. Configure builder/config/production.properties
1. Open the terminal/console and type

    cd builder
    phing
    (run "phing gitDeploy" for the github stable release folder)


------------------------------
For any further questions just ask us: mail@banchaproject.com