(function(){
    Ext.define('Zenoss.portlet.MyPortletModel',{
        extend: 'Ext.data.Model',
        fields: [
            {name: 'uid', type: 'string'},
            {name: 'device', type: 'string'},
            {name: 'component', type: 'string'},
            {name: 'size', type: 'int'}
        ],
        idProperty: 'uid'
    });

    Ext.define("Zenoss.portlet.MyPortletStore", {
        alias: ['widget.myportletstore'],
        extend: "Zenoss.NonPaginatedStore",
        constructor: function(config) {
            config = config || {};
            Ext.applyIf(config, {
                autoLoad: true,
                model: 'Zenoss.portlet.MyPortletModel',
                initialSortColumn: "uid",
                directFn: Zenoss.remote.ZenDMDRouter.executeScript,
                baseParams: {
                    script: 'data = []\n' +
                            'for device in devices.Server.SSH.Linux.getSubDevices():\n' +
                            '    for fs in device.os.filesystems():\n' +
                            '        data.append({\n' +
                            '            "uid": fs.getPrimaryId(),\n' +
                            '            "device": device.titleOrId(),\n' +
                            '            "component": fs.titleOrId(),\n' +
                            '            "size": fs.totalBytes()})\n'
                },
                root: 'data'
            });
            this.callParent(arguments);
        }
    });

    Ext.define('Zenoss.Dashboard.portlets.MyPortlet', {
        extend: 'Zenoss.Dashboard.view.Portlet',
        alias: 'widget.myportlet',
        title: _t('My Portlet'),
        height: 400,
        initComponent: function(){
            var me = this;
            Ext.apply(this, {
                items: [{
                    xtype: 'grid',
                    ref: 'myportletgrid',
                    store: Ext.create('Zenoss.portlet.MyPortletStore', {}),
                    columns: [{
                        dataIndex: 'device',
                        header: _t('Device'),
                        flex: 2
                    },{
                        dataIndex: 'component',
                        header: _t('Filesystem'),
                        flex: 3
                    },{
                        dataIndex: 'size',
                        header: _t('Size'),
                        renderer: Zenoss.render.bytesString,
                        flex: 1
                    }]
                }]
            });

            this.callParent(arguments);
        }
    });

}());
