define([
        "dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dijit/_OnDijitClickMixin",
        "dijit/_Container",
        "dojo/text!./template/group.html",
        "dojo/_base/lang",
        "dojo/topic"
    ],
 function(declare, _WidgetBase, _TemplatedMixin,
        _WidgetsInTemplateMixin,_OnDijitClickMixin,
         _Container, template, lang, topic) {
        return declare(
            "Group", [_WidgetBase, _TemplatedMixin, _OnDijitClickMixin,
                _WidgetsInTemplateMixin,_Container
            ], {

                templateString: template,
                constructor: function(options) {
                    lang.mixin(this, options);

                }

            });
    });
