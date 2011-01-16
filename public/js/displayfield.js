Ext.form.DisplayField = Ext.extend(Ext.form.Field,  {
    ui: 'text',
    isField: true,
    isFormField : true,
    inputCls: 'x-displayfield',
    
    initComponent : function() {
        this.addEvents('displaytap');
        Ext.form.DisplayField.superclass.initComponent.call(this);
    },
    
    afterRender: function() {
        Ext.form.DisplayField.superclass.afterRender.call(this);
        this.mon(this.fieldEl, {
            tap: this.onTap,
            scope: this
        });
    },
    
    onTap : function(e){
        this.fireEvent('displaytap',this.originalValue,this.getValue());
    },
    renderTpl: [
        '<tpl if="label">',
        	'<div class="x-form-label" id="{inputId}" style="width:30%"><span>{label}</span></div>',
            //'<label <tpl if="fieldEl">for="{inputId}"</tpl>>{label}</label>',
        '</tpl>',
        '<tpl if="fieldEl">',
            '<div id="{inputId}" name="{name}"  class="{fieldCls}""',
            '<tpl if="style">style="{style}" </tpl>',
        '></div></tpl>',
        '<div class="x-field-mask"></div>'
    ],
    getValue : function(){
        if (!this.rendered || !this.fieldEl) {
           
            return this.dom.innerHTML;
        }
        
        return this.fieldEl.dom.innerHTML || '';
    },
    setValue : function(v){
        this.value = v;
        if (this.rendered && this.fieldEl) {
            this.fieldEl.dom.innerHTML = (Ext.isEmpty(v) ? '' : v);
        }
        return this;
    }
});
Ext.reg('displayfield', Ext.form.DisplayField);