webpackJsonp([26],{1056:function(t,a,e){"use strict";(function(t){function s(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(a,"__esModule",{value:!0});var r=e(155),i=s(r),n=e(231),o=s(n),l=e(116),d=s(l),c=e(100),u=s(c),h=e(232);s(h);a.default={name:"Lists",data:function(){var t=this,a=function(t,a,e){0==a||1==a?e():e(new Error(t.message))},e=function(t,a,e){/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(a)?e():e(new Error("请输入正确格式的金额"))};return{totalAmount:"",totalScore:"",getLists:[],columns:[{type:"selection",title:"批量审核",width:60,align:"center"},{title:"会员id",key:"member_id"},{title:"商户id",key:"merchant_id"},{title:"会员名称",key:"member_name"},{title:"商户名称",key:"merchant_name"},{title:"创建时间",key:"created"},{title:"积分",key:"score"},{title:"金额",key:"amount"},{title:"状态",key:"status",render:function(t,a){var e="拒绝";return-1==a.row.status?(a.row._disabled=!0,e="拒绝"):1==a.row.status?(a.row._disabled=!0,e="审核通过"):e="待审核",t("span",{},e)}},{title:"操作",key:"status",width:150,align:"center",render:function(a,e){var s=(a("Button",{props:{size:"small",type:"default"},style:{marginRight:"10px"}},"审核通过"),a("Button",{props:{size:"small",type:"success"},style:{marginRight:"10px"},on:{click:function(){t.doWhat("review",e.row.id,1)}}},"通过")),r=a("Button",{props:{size:"small",type:"error"},on:{click:function(){t.doWhat("review",e.row.id,-1)}}},"拒绝"),i=[];return 2==e.row.status&&(i.push(s),i.push(r)),a("div",i)}}],saveType:"new",doType:"list",switching:!1,tableData:[],merchantTypeData:[],areaData:{areaDataReady:3,province:[],citys:[],district:[]},shipStatus:["待审核","审核成功","审核失败"],Totals:{wait:"0.00",fail:"0.00",success:"0.00",sum_total:"0.00"},page:{dataCount:0,pageCount:0,pageSize:10,pageNumber:1,pageSizeOpts:[10,20,50,100]},dataReady:0,currentData:{},defaultData:{amount:"",rank:"",memberName:""},updateStatusForm:{},updateStatusValidate:{status:[{validator:a,message:"请选择审核结果",trigger:"blur"}]},oldPassError:"",allSelect:[],loadBut:!1,updateStatus:!1,saveUpdateStatusLoading:!1,searchData:{keyword:"",searchDate:[],startDate:"",shipStatus:"",endDate:"",status:"",type:""},addDataValidate:{amount:[{required:!0,message:"请输入金额"},{validator:e}],memberName:[{required:!0,message:"请输入姓名",trigger:"blur"}],rank:[{required:!0,message:"请选择期数"}]},searchValidata:{}}},computed:{getLoading:function(){return!(0==this.dataReady)},areaDataReady:function(){return!(0==this.areaData.areaDataReady)},doName:function(){return"list"==this.doType?"兑付方案":"edit"==this.doType?"编辑商户":"add"==this.doType?"添加":"商户详情"},currentDataValidate:function(){return"add"==this.doType?this.addDataValidate:this.editDataValidate},hasDataChange:function(){return!((0,i.default)(this.currentData)==(0,i.default)(this.tableData[this.currentData.listIndex]))}},methods:{changePage:function(t){this.page.pageNumber=t,this.search(t)},changePageSize:function(t){this.page.pageSize=t,this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize),this.search()},OnSelect:function(t){console.log(t),this.allSelect=t},selectionchange:function(t){console.log(t),this.allSelect=t},allOnSelect:function(t){console.log(t),this.allSelect=t,console.log(this.allSelect)},checkPower:function(t){return!!this.$store.state.Rights[o.default.api.integral.List[t].MD5()]},doWhat:function(t,a,e){if(!this.checkPower(t))return void this.$Message.warning("对不起，您没有此操作权限！");this.switching=!0,"add"==t&&(this.resetCurrentData(),this.doType="add"),"edit"==t&&(this.showEdit(a),this.doType="edit"),"delete"==t&&this.delete(a),"review"==t&&this.changeStatus(a,e),"list"==t&&(this.resetCurrentData(),this.dataReady+=1,this.init(),this.doType="list"),this.switching=!1},view:function(a){this.currentData=t.extend(!0,{},this.tableData[a]),this.doType="view"},showEdit:function(a){this.currentData=t.extend(!0,{},this.tableData[a]),this.currentData.userewm=o.default.apiRootPath+o.default.api.public.ewm+"&merchantId="+this.currentData.merchantId,this.setCity(this.currentData.merchantProvinceId,!0),this.setDistrict(this.currentData.merchantCityId,!0),this.doType="edit"},resetCurrentData:function(){this.currentData=t.extend(!0,{},this.defaultData)},search:function(t){this.searchData.searchDate.length&&(this.searchData.startDate=d.default.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd"),this.searchData.endDate=d.default.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd")),this.page.pageNumber=1,t&&(this.page.pageNumber=t),this.doWhat("list")},saveEdit:function(){var a=this;this.$refs.currentData.validate(function(e){if(e){var s={ssid:u.default.get("ssid"),amount:a.currentData.amount,rank:a.currentData.rank,memberName:a.currentData.memberName};t.ajax({url:o.default.apiRootPath+o.default.api.integral.List.add,type:"POST",dataType:"json",data:s}).done(function(t){a.dataReady--,t?0==t.code?(a.dataReady++,a.$Message.success("添加成功"),a.doWhat("list")):o.default.showError({vm:a,data:t,errorMsg:""}):o.default.showError({vm:a,data:t,errorMsg:"请求失败"})})}})},resetSearch:function(){this.searchData={keyword:"",searchDate:[],startDate:"",endDate:"",type:0},this.page.pageNumber=1,this.dataReady+=1,this.init()},init:function(){this.getList()},getList:function(){var a=this,e={ssid:u.default.get("ssid"),page:this.page.pageNumber,pageSize:this.page.pageSize};""!=this.searchData.keyword&&(e.name=this.searchData.keyword),""!=this.searchData.shipStatus&&(e.startDate=this.searchData.startDate),""!=this.searchData.status&&(e.status=this.searchData.status),""!=this.searchData.shipStatus&&(e.merchantId=this.searchData.shipStatus),""!=this.searchData.endDate&&(e.endDate=this.searchData.endDate),t.ajax({url:o.default.apiRootPath+o.default.api.integral.List.list,type:"POST",dataType:"json",data:e}).done(function(t){if(a.dataReady--,t)if(0==t.code){a.tableData=t.data.list,a.page.dataCount=t.data.count,a.totalAmount=null==t.data.totalAmount?0:Number(t.data.totalAmount).toFixed(2),a.totalScore=null==t.data.totalScore?0:Number(t.data.totalScore).toFixed(2);for(var e=0;e<a.tableData.length;e++)1!=a.tableData[e].status&&-1!=a.tableData[e].status||(a.tableData[e]._disabled=!0)}else o.default.showError({vm:a,data:t,errorMsg:""});else o.default.showError({vm:a,data:t,errorMsg:"请求失败"})}).fail(function(t,e,s){a.dataReady--,o.default.showError({vm:a,errorMsg:"服务器通讯失败"})})},getListss:function(){var a=this,e={ssid:u.default.get("ssid")};t.ajax({url:o.default.apiRootPath+o.default.api.integral.List.lists,type:"POST",dataType:"json",data:e}).done(function(t){t?0==t.code?a.getLists=t.data:o.default.showError({vm:a,data:t,errorMsg:""}):o.default.showError({vm:a,data:t,errorMsg:"请求失败"})}).fail(function(t,e,s){o.default.showError({vm:a,errorMsg:"服务器通讯失败"})})},batchOperation:function(){var a=this,e=[];console.log(this.allSelect,"wwww");for(var s=0;s<this.allSelect.length;s++)0==this.allSelect[s].status?this.allSelect[s].status=1:this.allSelect[s].status=0,e.push(this.allSelect[s].id);console.log(e);var r={ssid:u.default.get("ssid"),ids:(0,i.default)({ids:e}),status:1};t.ajax({url:o.default.apiRootPath+o.default.api.integral.List.review,type:"POST",dataType:"json",data:r}).done(function(e){if(e)if(0==e.code){a.$Message.success("操作成功！");var s=t.extend(!0,[],a.tableData);s[a.updateStatusForm.tableIndex]=a.updateStatusForm,a.updateStatusForm={},a.tableData=s,a.updateStatus=!1,a.doWhat("list")}else o.default.showError({vm:a,data:e,errorMsg:""});else o.default.showError({vm:a,data:e,errorMsg:"请求失败"})}).fail(function(t,e,s){o.default.showError({vm:a,data:r,errorMsg:"服务器通讯失败"})})},changeStatus:function(a,e){var s=this,r={ssid:u.default.get("ssid"),ids:(0,i.default)({ids:[a]}),status:e};this.$Modal.confirm({title:"积分审核",content:"<p>确定通过直营店添加会员白积分奖励申请？</p>",onOk:function(){t.ajax({url:o.default.apiRootPath+o.default.api.integral.List.review,type:"POST",dataType:"json",data:r}).done(function(t){t?0==t.code?(s.$Message.success("操作成功！"),s.doWhat("list")):o.default.showError({vm:s,data:t,errorMsg:""}):o.default.showError({vm:s,data:t,errorMsg:"请求失败"})}).fail(function(t,a){s.savePassLoading=!1,o.default.showError({vm:s,data:r,errorMsg:"服务器通讯失败"})})},onCancel:function(){s.$Message.info("放弃审核")}})},handleSelectAll:function(t){this.$refs.selection.selectAll(t)},cancelUpdateStatus:function(){this.updateStatusForm={},this.updateStatus=!1}},mounted:function(){},activated:function(){this.doWhat("list"),this.getListss()}}}).call(a,e(154))},1174:function(t,a){},1297:function(t,a,e){t.exports={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("Card",[e("p",{staticClass:"hasButtonP",attrs:{slot:"title"},slot:"title"},[t._v("\n           \n            积分审核\n    \n\n            \n        ")]),t._v(" "),e("div",{staticClass:"doBox"},[t.switching?e("Spin",{attrs:{size:"large",fix:""}}):t._e(),t._v(" "),"list"!=t.doType?e("div",[e("Form",{ref:"currentData",attrs:{model:t.currentData,"label-width":100,"label-position":"right",rules:t.currentDataValidate}},[e("FormItem",{attrs:{label:"用户名：",prop:"memberName"}},[e("div",{staticStyle:{display:"inline-block",width:"204px"}},[e("Input",{model:{value:t.currentData.memberName,callback:function(a){t.$set(t.currentData,"memberName",a)},expression:"currentData.memberName"}})],1)]),t._v(" "),e("FormItem",{attrs:{label:"期数",prop:"rank"}},[e("Select",{staticStyle:{width:"204px"},attrs:{placeholder:"选择期数"},model:{value:t.currentData.rank,callback:function(a){t.$set(t.currentData,"rank",a)},expression:"currentData.rank"}},[e("Option",{attrs:{value:"12"}},[t._v("12")]),t._v(" "),e("Option",{attrs:{value:"24"}},[t._v("24")]),t._v(" "),e("Option",{attrs:{value:"36"}},[t._v("36")])],1)],1),t._v(" "),e("FormItem",{attrs:{label:"金额：",prop:"amount"}},[e("div",{staticStyle:{display:"inline-block",width:"204px"}},[e("Input",{model:{value:t.currentData.amount,callback:function(a){t.$set(t.currentData,"amount",a)},expression:"currentData.amount"}})],1)]),t._v(" "),e("div",[e("Button",{staticStyle:{width:"100px"},attrs:{type:"text"},on:{click:function(a){t.doWhat("list")}}},[t._v("取消")]),t._v(" "),e("Button",{staticStyle:{width:"100px"},attrs:{type:"primary"},on:{click:t.saveEdit}},[t._v("保存")])],1)],1)],1):t._e(),t._v(" "),"list"==t.doType?e("div",{staticClass:"ordler-list"},[e("div",{staticClass:"search-box",staticStyle:{"margin-bottom":"20px"}},[e("Form",{ref:"searchData",staticStyle:{display:"inline-block"},attrs:{model:t.searchData,rules:t.searchValidata,inline:""}},[e("FormItem",{staticStyle:{"margin-bottom":"0px"},attrs:{prop:"keyword"}},[e("Input",{attrs:{type:"text",placeholder:"输入名称搜索帐号"},model:{value:t.searchData.keyword,callback:function(a){t.$set(t.searchData,"keyword",a)},expression:"searchData.keyword"}},[e("Icon",{attrs:{slot:"prepend",type:"ios-eye"},slot:"prepend"})],1)],1),t._v(" "),e("FormItem",{attrs:{prop:"searchDate"}},[e("DatePicker",{staticStyle:{width:"200px"},attrs:{type:"daterange",placeholder:"请选择时间范围"},model:{value:t.searchData.searchDate,callback:function(a){t.$set(t.searchData,"searchDate",a)},expression:"searchData.searchDate"}})],1),t._v(" "),e("Select",{staticStyle:{width:"240px"},attrs:{placeholder:"直营店"},model:{value:t.searchData.shipStatus,callback:function(a){t.$set(t.searchData,"shipStatus",a)},expression:"searchData.shipStatus"}},t._l(t.getLists,function(a,s){return e("Option",{key:s,attrs:{value:a.id}},[t._v(t._s(a.name))])})),t._v(" "),e("FormItem",{staticStyle:{"margin-bottom":"0px"}},[e("ButtonGroup",[e("Button",{attrs:{type:"primary",icon:"search"},on:{click:function(a){t.search()}}},[t._v("搜索")]),t._v(" "),e("Button",{on:{click:t.resetSearch}},[t._v("清空")])],1)],1),t._v(" "),e("span",{staticStyle:{color:"red","padding-right":"20px"}},[t._v("总金额："+t._s(t.totalAmount))]),t._v(" "),e("span",{staticStyle:{color:"red"}},[t._v("总积分："+t._s(t.totalScore))])],1)],1),t._v(" "),e("Button",{staticStyle:{margin:"10px 0 10px"},attrs:{type:"primary",loading:t.loadBut},on:{click:function(a){t.batchOperation()}}},[t._v("批量审核")]),t._v(" "),e("span",{staticStyle:{color:"red"}},[t._v("(注：批量审核只能通过不能拒绝，如果要拒绝操作，请在拒绝按钮单条数据操作)")]),t._v(" "),e("Table",{attrs:{border:"",columns:t.columns,loading:t.getLoading,data:t.tableData},on:{"on-select":t.OnSelect,"on-select-all":t.allOnSelect,"on-selection-change":t.selectionchange}}),t._v(" "),e("div",{staticClass:"page-box"},[t.page.dataCount>10?e("Page",{attrs:{total:t.page.dataCount,current:t.page.pageNumber,"show-total":"","page-size-opts":t.page.pageSizeOpts,"page-size":t.page.pageSize,"show-elevator":"",placement:"top","show-sizer":""},on:{"on-change":t.changePage,"on-page-size-change":t.changePageSize}}):t._e()],1)],1):t._e()],1)])],1)},staticRenderFns:[]},t.exports.render._withStripped=!0},988:function(t,a,e){e(1174);var s=e(66)(e(1056),e(1297),null,null);s.options.__file="F:\\changhaochen\\GitHub\\manage\\src\\views\\integral\\Lists.vue",s.esModule&&Object.keys(s.esModule).some(function(t){return"default"!==t&&"__esModule"!==t})&&console.error("named exports are not supported in *.vue files."),s.options.functional&&console.error("[vue-loader] Lists.vue: functional components are not supported with templates, they should use render functions."),t.exports=s.exports}});