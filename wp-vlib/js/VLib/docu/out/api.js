YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "AbstractPlugin",
        "Config",
        "Controls",
        "Plot",
        "Plugin 3D",
        "Plugin Axes",
        "Plugin BasicMaterial",
        "Plugin CameraControl",
        "Plugin Color",
        "Plugin Dataset",
        "Plugin File",
        "Plugin Function",
        "Plugin Heatmap",
        "Plugin Light",
        "Plugin LinePlot",
        "Plugin Plane",
        "Plugin ScatterPlot",
        "Plugin SurfacePlot",
        "Plugin WireframeMaterial",
        "SceneGraph",
        "Templates",
        "Toolbox",
        "UTILS",
        "VLib",
        "VMediator"
    ],
    "modules": [
        "Controls",
        "Plot",
        "SceneGraph",
        "Templates",
        "Toolbox",
        "VLib",
        "main"
    ],
    "allModules": [
        {
            "displayName": "Controls",
            "name": "Controls",
            "description": "TODO<br />"
        },
        {
            "displayName": "main",
            "name": "main",
            "description": "Handles wordpress frontend. <br />\nThis module is a main entrypoint, which can be included into a webside.<br />\nIt will replace wordpress shorttags (<b>[vlib id=TEMPLATE_ID] </b>) by VLib plot modules. <br />\n<b>TEMPLATE_ID</b>s will be loaded from the server and forwarded to the coresponding plot instance."
        },
        {
            "displayName": "Plot",
            "name": "Plot",
            "description": "TODO<br />"
        },
        {
            "displayName": "SceneGraph",
            "name": "SceneGraph",
            "description": "TODO<br />"
        },
        {
            "displayName": "Templates",
            "name": "Templates",
            "description": "TODO<br />"
        },
        {
            "displayName": "Toolbox",
            "name": "Toolbox",
            "description": "TODO<br />"
        },
        {
            "displayName": "VLib",
            "name": "VLib",
            "description": "Base class of the framework.<br />\nOn the one hand vLib is an interface to the \"outside world\".\nOn the other it provides information to modules.<br />\nVLib registers it self as pseudo module and acts as a service provider.<br/>\nIt holds an instance of VMediator.<br />"
        }
    ]
} };
});