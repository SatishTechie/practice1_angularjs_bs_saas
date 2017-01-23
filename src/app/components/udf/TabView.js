define([
        "dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dijit/_OnDijitClickMixin",
        "dojo/text!./template/tabview.html",
        "dojo/_base/lang",
        "dojo/topic",
        "dijit/layout/TabContainer",
        "dijit/layout/ContentPane",
        "dojo/request/xhr",
        "app/components/udf/Prop",
        "app/components/udf/Group",
        "app/components/udf/SubGroup",
        "dijit/form/Button"
    ],
    function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin,
        _WidgetsInTemplateMixin, template, lang, topic, TabContainer,
        ContentPane, xhr, Prop, Group, SubGroup) {
        return declare(
            "TabView", [_WidgetBase, _TemplatedMixin, _OnDijitClickMixin,
                _WidgetsInTemplateMixin
            ], {

                templateString: template,
                constructor: function(options) {
                    lang.mixin(this, options);

                },
                setChildren: function() {

                    var me = this;
                    var childs = this.tabNode.getChildren();
                    for (var i = 0; i < __app.jsonview.length; i++) {
                        var items = __app.jsonview[i].components;
                        var grp = new Group();
                        for (var key in __app.jsonview[i]) {
                            if (typeof(__app.jsonview[i][key]) != "object") {
                                //grp.grpCntNode.appendChild(new Prop({ key: key, val: __app.jsonview[i][key] }).domNode);
                                grp.addChild(new Prop({ key: key, val: __app.jsonview[i][key] }));
                            }
                        }
                        childs[i].addChild(grp);
                        for (var j = 0; j < items.length; j++) {
                            var item = items[j];
                            var sgrp = new SubGroup();
                            for (var key in item) {
                                console.log(key);
                                //sgrp.sgrpCntNode.appendChild(new Prop({ key: key, val: item[key] }).domNode);
                                sgrp.addChild(new Prop({ key: key, val: item[key] }));
                            }
                            childs[i].addChild(sgrp);
                        }
                    }

                },
                saveData: function() {

                    var res = [];

                    var tabs = this.tabNode.getChildren();
                    for (var i = 0; i < tabs.length; i++) {
                        var resObj = {};
                        res[res.length] = resObj;
                        var grps = tabs[i].getChildren();
                        var compts = [];
                        resObj["components"] = compts;
                        for (var j = 0; j < grps.length; j++) {
                            var props = grps[j].getChildren();

                            var obj = {};
                            for (var k = 0; k < props.length; k++) {

                                if (j == 0) {
                                    resObj[props[k].key] = props[k].inpNode.value;
                                } else {
                                    obj[props[k].key] = props[k].inpNode.value;

                                }
                            }
                            if (!this.isEmpty(obj)) {
                                compts[compts.length] = obj;
                            }
                        }
                    }
                    return res;
                },


                isEmpty: function(obj) {
                    var hasOwnProperty = Object.prototype.hasOwnProperty;
                    // null and undefined are "empty"
                    if (obj == null) return true;

                    // Assume if it has a length property with a non-zero value
                    // that that property is correct.
                    if (obj.length > 0) return false;
                    if (obj.length === 0) return true;

                    // Otherwise, does it have any properties of its own?
                    // Note that this doesn't handle
                    // toString and valueOf enumeration bugs in IE < 9
                    for (var key in obj) {
                        if (hasOwnProperty.call(obj, key)) return false;
                    }

                    return true;
                },
                serviceCall: function() {

                    var req = {
                        "tid": "SYMBOL",
                        "category": "SALES",
                        "appName": "TLS",
                        "appAttributes": {
                            "attKey": "test",
                            "value": "",
                            "displayName": "TEST View Layout Manager",
                            "type": "tabView",
                            "regex": "",
                            "isMandatory": "true",
                            "rule": ""
                        }
                    };
                    req.appAttributes["value"] = JSON.stringify(this.saveData());
                    console.log(req);
                    xhr("http://localhost:8090/config/v1/client/application/category/attribute.htm", {
                        handleAs: "json",
                        data: JSON.stringify(req),
                        headers: { 'Content-Type': 'application/json' },
                        method: "POST",
                    }).then(function(data) {
                        console.log(data);
                    }, function(err) {
                        console.log(err);
                        // Handle the error condition
                    }, function(evt) {
                        // Handle a progress event from the request if the
                        // browser supports XHR2
                    });

                }





            });
    });
