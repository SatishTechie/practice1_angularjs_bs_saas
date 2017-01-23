define([
        "dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dijit/_OnDijitClickMixin",
        "dojo/text!./template/prop.html",
        "dojo/_base/lang",
        "dojo/topic"
    ],
    function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin,
        _WidgetsInTemplateMixin, template, lang, topic) {
        return declare(
            "Prop", [_WidgetBase, _TemplatedMixin, _OnDijitClickMixin,
                _WidgetsInTemplateMixin
            ], {

                templateString: template,
                constructor: function(options) {
                    lang.mixin(this, options);

                }
                
            });
    });
