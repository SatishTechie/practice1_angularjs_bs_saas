define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_OnDijitClickMixin",
    "dojo/text!./template/SSOWidget.html",
    "dojo/_base/lang",
    "dojo/topic",
    "dojo/dom-style",
    "dijit/registry",
    "dijit/MenuBar",
    "dijit/PopupMenuBarItem",
    "dijit/Menu",
    "dijit/MenuItem",
    "dijit/MenuBarItem",
    "dijit/DropDownMenu",
    "dijit/PopupMenuItem",
    "dojo/request",
 "dojo/io-query",
 "dojo/dom-construct",
 "dojo/on",
   "dijit/form/ValidationTextBox"
],
        function (declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin,
                _WidgetsInTemplateMixin, template, lang, topic, domStyle, registry,
                MenuBar, PopupMenuBarItem, Menu, MenuItem, MenuBarItem, DropDownMenu,
                PopupMenuItem, request,ioQuery,domConstruct,on) {
            return declare(
                    "SSOWidget",
                    [_WidgetBase, _TemplatedMixin, _OnDijitClickMixin,
                        _WidgetsInTemplateMixin],
                    {
                        homeURL: document.location.protocol+"//"+document.location.host,
                        europaMenu: {},
                        clientApp: [],
                        clients: [],
                        ssoData: null,
                        templateString: template,
                        constructor: function (options) {
                            lang.mixin(this, options);
                           
                        },
                        postCreate: function () {
                            this.mainMenuBar = new MenuBar({
                                passivePopupDelay: 50
                            });
							var me = this;
							setTimeout(function(){ me.getSSOWidgetInfo();}, 1000);
                           
							
                        },
                        addUserMenu: function () {
                            //building user menu
                          this.europaMenu = new DropDownMenu({});
                            this.europaMenu.addChild(this.createMenuItem(this.ssoData.results.userCommonName, '', true));
                            for (var i = 0; i < this.ssoData.results.userSettingsInfo.length; i++) {
                                var userSettingsInfoItem = this.ssoData.results.userSettingsInfo[i];
                                var newTab = userSettingsInfoItem.linkOpenNewTab;
                                if(newTab != undefined && newTab != null && newTab != '' && newTab == 'YES') {
                                	var a = '<a href="' + userSettingsInfoItem.linkUrl + '" style="text-decoration: none;color: inherit;" target="_blank">' + userSettingsInfoItem.linkDisplayName + '</a>';
                                	this.europaMenu.addChild(new dijit.MenuItem({label: a, style: '', disabled: false }));
                                } else {
                                	this.europaMenu.addChild(this.createMenuItem(userSettingsInfoItem.linkDisplayName, '', false, userSettingsInfoItem.linkUrl));
                                }
                            }


                            this.userMenu = new PopupMenuBarItem({
                                label: '<img src="'+this.homeURL+'/uilibs/app/resources/css/images/settings.png" class="st-img">',
                                popup: this.europaMenu
                            });

                            domStyle.set(this.userMenu.domNode, 'float', 'right');
                            this.mainMenuBar.addChild(this.userMenu);
                        },
                        getSSOWidgetInfo: function () {
                            var me = this;
                             /* request(this.homeURL+"/v1/sso/menu").then(function (data) {
                                var result = JSON.parse(data);  */
								me.ssoData= {"message":{"msgKey":"ssoWidgetInfo","type":"success"},"statusCode":200,"results":{"ssoLogoutUrl":"https:\/\/dev-sso.zymesolutions.com:443\/sso\/UI\/Logout?goto=https:\/\/dev-apps.zymesolutions.local:8143\/logout?clientName=ZYME","userCommonName":"SATISH PAWAR","userEntitlementInfo":[{"appDisplayName":"ZymeNet","customerDisplayName":"LOGITECH","customerAppUrl":"https:\/\/dev.zymenet.local:8143\/pportal\/?tid=LOGITECH"},{"appDisplayName":"TrueData TLS","customerDisplayName":"LOGITECH","customerAppUrl":"https:\/\/dev.zymenet.local:8143\/tls\/?tid=LOGITECH"},{"appDisplayName":"Partner Onboarding","customerDisplayName":"LOGITECH","customerAppUrl":"https:\/\/dev-apps.zymesolutions.local:8143\/powb1\/?tid=LOGITECH"},{"appDisplayName":"User Management","customerDisplayName":"DUMMY","customerAppUrl":"https:\/\/dev-apps.zymesolutions.local:8143\/idmgmt\/?tid=DUMMY"},{"appDisplayName":"ZAP","customerDisplayName":"DUMMY","customerAppUrl":"https:\/\/dev-apps.zymesolutions.local:8143\/zap"},{"appDisplayName":"Profile","customerDisplayName":"DUMMY","customerAppUrl":"https:\/\/dev.zymenet.local:8143\/profile\/?tid=DUMMY"},{"appDisplayName":"Exceptions","customerDisplayName":"DELL_GCC","customerAppUrl":"https:\/\/dev-apps.zymesolutions.local:8143\/TrueData\/?tid=DELL_GCC"},{"appDisplayName":"Rebates","customerDisplayName":"XEROX","customerAppUrl":"https:\/\/dev-apps.zymesolutions.local:8143\/xrs\/?tid=XEROX"},{"appDisplayName":"Zyme Test App","customerDisplayName":"ZYMECUSTOMER","customerAppUrl":"https:\/\/dev-apps.zymesolutions.local:8143\/ztest\/?tid=ZYMECUSTOMER"}],"userSettingsInfo":[{"linkUrl":"\/editProfileDetails","linkDisplayName":"Edit Profile Details","linkOpenNewTab":"NO"},{"linkUrl":"\/files\/sso_faq.pdf","linkDisplayName":"SSO FAQ","linkOpenNewTab":"YES"}]}};
                                me.loginMenu();
                                me.addUserMenu();
                                me.processEntitlement(me.ssoData.results.userEntitlementInfo);
                                me.mainMenuBar.placeAt(me.mainMenuBarNode);
                                me.mainMenuBar.startup();
								domConstruct.destroy(me.loadingNode);
								me.attachEvent();
							/* 	
                            }, function (err) {
                                console.log(err);
                            }, function (evt) {
                                // handle a progress event
                            }); */
                            
                        },
                        processEntitlement: function (entitlement) {
                        	if(entitlement != undefined && entitlement != null && entitlement != "") {
                        		for (var i = 0; i < entitlement.length; i++) {
                                    var apps = [];
                                    var epart = entitlement[i];
                                    this.clients[this.clients.length] = epart.customerDisplayName;
                                    this.clientApp[this.clientApp.length] = {cname: epart.tid, apps: epart.appDisplayName, customerDisplayName: epart.customerDisplayName, customerAppUrl: epart.customerAppUrl}
                                }
                                this.clients.sort();
                                this.addClientMenu();
                        	}
                        },
                        getApps: function (client) {
                            var appsObj = {};
                            var apps = [];
                            for (var i = 0; i < this.clientApp.length; i++) {
                                if (this.clientApp[i].customerDisplayName == client) {
                                    apps[apps.length] = {appDisplayName: this.clientApp[i].apps, customerAppUrl: this.clientApp[i].customerAppUrl};
                                    appsObj.customerDisplayName = this.clientApp[i].customerDisplayName;
                                    appsObj.cname = this.clientApp[i].cname;
                                }
                            }
                            appsObj.apps = apps;
                            return appsObj;
                        },
                        addClientMenu: function () {
                            var me = this;
                            this.europaMenu = new DropDownMenu({});
                            this.clients = this.clients.filter(function (elem, pos) {
                                return me.clients.indexOf(elem) == pos;
                            });
                            for (var i = 0; i < this.clients.length; i++) {
                                var appsObj = this.getApps(this.clients[i]);
                                var europaSubMenu = new DropDownMenu({});
                                for (var ii = 0; ii < appsObj.apps.length; ii++) {
                                    europaSubMenu.addChild(this.createMenuItem(appsObj.apps[ii].appDisplayName, '', '', appsObj.apps[ii].customerAppUrl, appsObj.cname));
                                }
                                var ppmitm = new dijit.PopupMenuItem({
                                    label: '<div class="pr-el"><div class="el">' + appsObj.customerDisplayName + '</div></div>',
                                    popup: europaSubMenu
                                });
                                this.europaMenu.addChild(ppmitm);

                            }
                            
                            var tid = '';
                            var uri = window.location;
                            var query = uri.search;
                            if(query != null && query != undefined && query != '') {
                            	query = query.substring(1,uri.length);
                            	var queryObject = ioQuery.queryToObject(query);
                            	if(queryObject != undefined && queryObject != null && queryObject != '') {
                                	if(queryObject.tid) {
                                		tid = queryObject.tid;
                                	} else {
                                		tid = 'Applications';
                                	}
                            	} else {
                            		tid = 'Applications';
                            	}
                            } else {
                        		tid = 'Applications';
                        	}
                            this.userMenu = new PopupMenuBarItem({
                                label: tid,
                                popup: this.europaMenu
                            });

                            domStyle.set(this.userMenu.domNode, 'float', 'right');
                            this.mainMenuBar.addChild(this.userMenu);
                        },
                        loginMenu: function () {
                            //building user menu
                            this.europaMenu = new DropDownMenu({style:"border:0"});

                            this.userMenu = new PopupMenuBarItem({
                                label: '<a id="snAnch" style="text-decoration: none;color: inherit;">Sign Out</a>',
                                popup: this.europaMenu								
                            });

                            domStyle.set(this.userMenu.domNode, 'float', 'right');
                            this.mainMenuBar.addChild(this.userMenu);
                        },
                        createMenuItem: function (label, style, disabled, url, parent) {
                            return new dijit.MenuItem({
								label: '<div class="pr-el"><div class="el">' + label + '</div></div>',
								style: style,
                                disabled: disabled,
                                parent: parent,
                                url: url,
                                onClick: this.menuItemClickHandler
                            });
                        },
                        menuItemClickHandler: function (evt) {
                            window.location = this.url;
                        },
                        clearSession: function (param) {
							var me = this;
							try{
							var ssoScriptNode = document.getElementById("ssoScript");
							if(ssoScriptNode){
								var ssoScriptNodeAttr =  ssoScriptNode.getAttribute("data-logout-url");
								if(ssoScriptNodeAttr){
									request(ssoScriptNodeAttr).then(function (data) {	
									window.location = me.ssoData.results.ssoLogoutUrl;
									}, function(err){
										console.log(err);
										//window.location = me.ssoData.results.ssoLogoutUrl;
									});									
								}else{
									window.location = me.ssoData.results.ssoLogoutUrl;
								}
							}
							}catch(e){
								console.log("EXCEPTION ON SESSION CLEAR :"+e)
							}
                        },
                        attachEvent: function () {
							on(document.getElementById("snAnch"),"click", lang.hitch(this, this.clearSession));
                        }
                    });
        });
