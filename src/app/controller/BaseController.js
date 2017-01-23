define(['dojo/_base/declare', "dojo/topic", "dojo/dom-construct",
        'dojo/_base/lang', "dojo/store/Memory", "dijit/form/ComboBox",
        'dijit/layout/BorderContainer', 'dijit/layout/ContentPane',
        'app/components/udf/TabView'
    ],
    function(declare, topic,
        domConstruct, lang, Memory, ComboBox,
        BorderContainer, ContentPane, TabView) {

        return declare('BaseController', [], {
            constructor: function() {
                //this.createLayout();
		var ldingDiv = document.getElementById("lding");
		ldingDiv.innerHTML="";
		//this.setViewFilter();
            },
            setViewFilter: function() {
            	var me = this;
                var stateStore = new Memory({
                    data: [
                        { name: "Tab View", id: "tabv" },
                        { name: "Section View", id: "secv" }

                    ]
                });

                var comboBox = new ComboBox({
                    store: stateStore,
                    searchAttr: "name",
                    onChange: function(e) {
                        me.centerTopPane.addChild(new TabView());
                    }
                }, "viewSelect");

                //this.topPane.addChild(comboBox);
            },
            createLayout: function() {
                // create a BorderContainer as the top widget in the hierarchy
                this.container = new BorderContainer({
                    style: "height: 100%; width: 100%; padding:0px;",
                    id: 'mainContainer',
                    gutters: false,
                    isLayoutContainer: true,
                    focused: true,
                    splitter: false
                }, 'mainLayout');

                // create a ContentPane as the left pane in the BorderContainer
                this.topPaneContainer = new BorderContainer({
                    style: "height: 10%; width: 100%; padding:0px;",
                    id: "tpc",
                    content: "",
                    region: "top",
                    gutters: false,
                    isLayoutContainer: true
                });
                this.topPane = new ContentPane({
                    region: "top",
                    style: "height: 30px;width: 100%; border:0px; margin:0px; padding:0px 0px 0px 0px;",
                    'class': "panel-heading",
                    content: '<div><span id="zyme-logo">zyme</span></div><div style="position: absolute;right:0"></div>',
                    id: "tpc_1",
                    gutters: false
                });


                this.topPaneContainer.addChild(this.topPane);
                this.container.addChild(this.topPaneContainer);

                // create a ContentPane as the center pane in the BorderContainer

                this.centerPane = new BorderContainer({
                    style: "height: 90%; width: 100%; padding:0px;",
                    id: "cenc",
                    content: "",
                    region: "top",
                    gutters: false,
                    isLayoutContainer: true
                });
                this.centerTopPane = new ContentPane({
                    region: "top",
                    style: "width: 100%; height:100%; border:0px; margin:0px; padding:0px 0px 0px 0px;",
                    id: "cenc_1",
                    gutters: false,
                    doLayout: true
                });

                var tabView = new TabView();
                this.centerTopPane.addChild(tabView);


                this.centerPane.addChild(this.centerTopPane);


                this.bottomPane = new ContentPane({
                    region: "top",
                    style: "width: 100%; height:5%;border:0px; margin:0px; padding:0px 0px 0px 0px;",
                    id: "botPane",
                    'class': "panel-footer",
                    gutters: false,
                    doLayout: true
                });


                this.container.addChild(this.centerPane);
                this.container.addChild(this.bottomPane);
                this.container.startup();
                tabView.setChildren();

            }


        });

    });
