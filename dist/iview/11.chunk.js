webpackJsonp([11],{1003:function(t,e,a){a(1163);var s=a(66)(a(1072),a(1278),null,null);s.options.__file="F:\\changhaochen\\GitHub\\manage\\src\\views\\merchant\\orders.vue",s.esModule&&Object.keys(s.esModule).some(function(t){return"default"!==t&&"__esModule"!==t})&&console.error("named exports are not supported in *.vue files."),s.options.functional&&console.error("[vue-loader] orders.vue: functional components are not supported with templates, they should use render functions."),t.exports=s.exports},1011:function(t,e,a){t.exports={default:a(1013),__esModule:!0}},1012:function(t,e,a){"use strict";e.__esModule=!0;var s=a(1011),r=function(t){return t&&t.__esModule?t:{default:t}}(s);e.default=function(t,e,a){return e in t?(0,r.default)(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}},1013:function(t,e,a){a(1014);var s=a(67).Object;t.exports=function(t,e,a){return s.defineProperty(t,e,a)}},1014:function(t,e,a){var s=a(117);s(s.S+s.F*!a(85),"Object",{defineProperty:a(68).f})},1072:function(t,e,a){"use strict";(function(t){function s(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=a(1012),n=s(r),o=a(231),i=s(o),u=a(116),d=s(u),c=a(100),l=s(c);e.default={name:"merchant_orders",data:function(){var t,e=this,a=function(t,a,s){1==a||2==a?2==a?""!=!!e.updateStatusForm.express_number?s():s(new Error("已发货状态必须填写快递单号！")):s():s(new Error("请选择发货状态"))};return{tableOptions:{width:"100%"},payStatus:["不限","待支付","已支付"],shipStatus:["不限","待发货","已发货"],columns:[{title:"ID",align:"center",key:"id"},{title:"订单编号",align:"center",key:"order_no"},{title:"商户",align:"center",key:"merchant_name",render:function(t,e){return t("div",[t("span",{style:{color:"#999"}},"["+e.row.merchant_id+"] "),t("span",{},e.row.merchant_name)])}},{title:"会员",key:"member_name",align:"center",render:function(t,e){return t("div",[t("span",{style:{color:"#999"}},"["+e.row.member_id+"] "),t("span",{},e.row.member_name)])}},{title:"金额",align:"center",key:"total_score",render:function(t,e){return t("span",{},d.default.fmoney(d.default.numberCarry(e.row.total_score,100,4),6))}},{title:"返现",key:"cash",align:"center",render:function(t,e){return t("span",{},d.default.fmoney(d.default.numberCarry(e.row.cash,100,4),6))}},{title:"时间",width:130,align:"center",key:"date_added"},{title:"支付方式",align:"center",key:"payment_method",render:function(t,e){var a="default",s="";return 1==e.row.payment_method&&(a="green",s="购物积分"),2==e.row.payment_method&&(a="red",s="红积分"),3==e.row.payment_method&&(a="green",s="支付宝"),4==e.row.payment_method&&(a="red",s="微信"),5==e.row.payment_method&&(a="green",s="银行卡"),t("span",{props:{color:a,size:"small"}},s)}},(t={title:"状态",align:"center",key:"status"},(0,n.default)(t,"align","center"),(0,n.default)(t,"render",function(t,e){var a="default",s="已拆红包";return 2==e.row.status&&(a="green",s="已支付"),1==e.row.status&&(a="red",s="待支付"),t("Tag",{props:{color:a,size:"small"}},s)}),t)],doType:"list",switching:!1,tableData:[],defaultData:{id:0,order_no:"",merchant_id:0,merchant_name:"",member_id:0,member_name:"",total_score:"",status:0,date_added:"",cash:"0.0000",score:"0.0000",ship_status:"",express_number:"",product_name:""},page:{dataCount:0,pageCount:0,pageSize:10,pageNumber:1,pageSizeOpts:[10,20,50,100]},dataReady:0,searchData:{search:"",searchDate:[],startDate:"",endDate:"",payStatus:"",shipStatus:""},searchValidata:{},updateStatusForm:{},updateStatusValidate:{ship_status:[{required:!0,validator:a,trigger:"blur"}]},updateStatus:!1,saveUpdateStatusLoading:!1}},computed:{getLoading:function(){return!(0==this.dataReady)},doName:function(){return this.doType,"商户订单管理"}},methods:{checkPower:function(t){return!!this.$store.state.Rights[i.default.api.merchant.merchant_orders[t].MD5()]},doWhat:function(t,e){if(!this.checkPower(t))return void this.$Message.warning("对不起，您没有此操作权限！");this.switching=!0,"add"==t&&(this.resetCurrentData(),this.doType="add"),"edit"==t&&(this.showEdit(e),this.doType="edit"),"delete"==t&&this.delete(e),"review"==t&&this.changeStatus(e),"list"==t&&(this.resetCurrentData(),this.dataReady+=1,this.init(),this.doType="list"),this.switching=!1},showEdit:function(e){this.updateStatusForm=t.extend(!0,{},this.tableData[e]),this.updateStatusForm.dataIndex=e,this.saveType="edit",this.updateStatus=!0},cancelEdit:function(){this.updateStatusForm={},this.updateStatus=!1},saveUpdateStatus:function(){var e=this;this.$refs.updateStatusForm.validate(function(a){if(a){e.saveUpdateStatusLoading=!0;var s={ssid:l.default.get("ssid"),id:e.updateStatusForm.id,ship_status:e.updateStatusForm.ship_status,express_number:e.updateStatusForm.express_number};t.ajax({url:i.default.apiRootPath+i.default.api.merchant.merchant_orders.fahuo,type:"POST",dataType:"json",data:s}).done(function(a){if(e.saveUpdateStatusLoading=!1,a)if(0==a.code){e.$Message.success("操作成功！");var s=t.extend(!0,[],e.tableData);s[e.updateStatusForm.dataIndex]=e.updateStatusForm,e.updateStatusForm={},e.tableData=s,e.updateStatus=!1}else i.default.showError({vm:e,data:a,errorMsg:""});else i.default.showError({vm:e,data:a,errorMsg:"请求失败"})}).fail(function(t,a,s){e.saveUpdateStatusLoading=!1,i.default.showError({vm:e,errorMsg:"服务器通讯失败"})})}})},view:function(t){},resetCurrentData:function(){this.currentData=t.extend(!0,{},this.defaultData)},changePage:function(t){this.page.pageNumber=t,this.search(t)},changePageSize:function(t){this.page.pageSize=t,this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize),this.search()},resetSearch:function(){this.searchData={merchantId:"",memberId:"",searchDate:[],startDate:"",endDate:""},this.page.pageNumber=1,this.dataReady+=1,this.init()},search:function(t){this.searchData.searchDate.length&&(this.searchData.startDate=d.default.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd"),this.searchData.endDate=d.default.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd")),this.page.pageNumber=1,t&&(this.page.pageNumber=t),this.doWhat("list")},init:function(){this.getList()},getList:function(){var e=this,a={ssid:l.default.get("ssid"),page:this.page.pageNumber,pageSize:this.page.pageSize};""!=this.searchData.search&&(a.search=this.searchData.search),this.searchData.payStatus>0&&(a.status=this.searchData.payStatus),this.searchData.shipStatus>0&&(a.ship_status=this.searchData.shipStatus),""!=this.searchData.startDate&&(a.startDate=this.searchData.startDate),""!=this.searchData.endDate&&(a.endDate=this.searchData.endDate),t.ajax({url:i.default.apiRootPath+i.default.api.merchant.merchant_orders.list,type:"POST",dataType:"json",data:a}).done(function(t){e.dataReady--,t?0==t.code?(e.page.dataCount=t.data.count,e.page.pageCount=Math.ceil(e.page.dataCount/e.page.pageSize),e.tableData=t.data.list):i.default.showError({vm:e,data:t,errorMsg:""}):i.default.showError({vm:e,data:t,errorMsg:"请求失败"})}).fail(function(t,a,s){e.dataReady--,i.default.showError({vm:e,errorMsg:"服务器通讯失败"})})},delete:function(e){var a=this;if(this.tableData[e].id){t.ajax({url:i.default.apiRootPath+i.default.api.news.news_list.delete,type:"POST",dataType:"json",data:function(){return{ssid:l.default.get("ssid"),id:a.tableData[e].id,status:0}}()}).done(function(t){t?0==t.code?(a.$Message.success("删除成功!"),a.tableData.splice(e,1)):i.default.showError({vm:a,data:t,errorMsg:""}):i.default.showError({vm:a,data:t,errorMsg:"请求失败"})}).fail(function(t,e,s){i.default.showError({vm:a,errorMsg:"服务器通讯失败"})})}}},updated:function(){},mounted:function(){},deactivated:function(){},activated:function(){this.doWhat("list")}}}).call(e,a(154))},1163:function(t,e){},1278:function(t,e,a){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("Card",[a("p",{staticClass:"hasButtonP",attrs:{slot:"title"},slot:"title"},[a("Icon",{attrs:{type:"archive"}}),t._v("\n            "+t._s(t.doName)+"\n        ")],1),t._v(" "),a("div",{staticClass:"doBox"},[t.switching?a("Spin",{attrs:{size:"large",fix:""}}):t._e(),t._v(" "),"list"==t.doType?a("div",{staticClass:"ordler-list"},[a("div",{staticClass:"search-box"},[a("Form",{ref:"searchData",attrs:{model:t.searchData,rules:t.searchValidata,inline:""}},[a("FormItem",{attrs:{prop:"keyword"}},[a("Input",{attrs:{type:"text",placeholder:"输入商户名称或订单号搜索"},model:{value:t.searchData.search,callback:function(e){t.$set(t.searchData,"search",e)},expression:"searchData.search"}},[a("Icon",{attrs:{slot:"prepend",type:"ios-eye"},slot:"prepend"})],1)],1),t._v(" "),a("FormItem",{attrs:{prop:"searchDate"}},[a("DatePicker",{staticStyle:{width:"200px"},attrs:{type:"daterange",placeholder:"请选择时间范围"},model:{value:t.searchData.searchDate,callback:function(e){t.$set(t.searchData,"searchDate",e)},expression:"searchData.searchDate"}})],1),t._v(" "),a("Select",{staticStyle:{width:"140px"},attrs:{placeholder:"选择支付状态"},model:{value:t.searchData.payStatus,callback:function(e){t.$set(t.searchData,"payStatus",e)},expression:"searchData.payStatus"}},t._l(t.payStatus,function(e,s){return a("Option",{key:s,attrs:{value:s}},[t._v(t._s(e))])})),t._v(" "),a("FormItem",[a("ButtonGroup",[a("Button",{attrs:{type:"primary",icon:"search"},on:{click:function(e){t.search()}}},[t._v("搜索")]),t._v(" "),a("Button",{on:{click:t.resetSearch}},[t._v("清空")])],1)],1)],1)],1),t._v(" "),a("Table",{staticClass:"small_table",attrs:{border:"",columns:t.columns,loading:t.getLoading,data:t.tableData}}),t._v(" "),a("div",{staticClass:"page-box"},[t.page.dataCount>10?a("Page",{attrs:{total:t.page.dataCount,current:t.page.pageNumber,"show-total":"","page-size-opts":t.page.pageSizeOpts,"page-size":t.page.pageSize,"show-elevator":"",placement:"top","show-sizer":""},on:{"on-change":t.changePage,"on-page-size-change":t.changePageSize}}):t._e()],1)],1):t._e()],1),t._v(" "),a("Modal",{attrs:{width:500},model:{value:t.updateStatus,callback:function(e){t.updateStatus=e},expression:"updateStatus"}},[a("h3",{staticStyle:{color:"#2D8CF0"},attrs:{slot:"header"},slot:"header"},[t._v("订单处理")]),t._v(" "),a("Form",{ref:"updateStatusForm",attrs:{model:t.updateStatusForm,"label-width":100,"label-position":"right",rules:t.updateStatusValidate}},[a("FormItem",{staticStyle:{"margin-bottom":"0px"},attrs:{label:"订单编号："}},[t._v("\n                    "+t._s(t.updateStatusForm.order_no)+"\n                ")]),t._v(" "),a("FormItem",{staticStyle:{"margin-bottom":"0px"},attrs:{label:"商品名称："}},[0==t.updateStatusForm.product_pay_type?[t._v("\n                        线下购买\n                    ")]:[t._v("\n                        "+t._s(t.updateStatusForm.product_name)+"\n                    ")]],2),t._v(" "),a("FormItem",{staticStyle:{"margin-bottom":"0px"},attrs:{label:"用 户 名："}},[t._v("\n                    "+t._s(t.updateStatusForm.member_name)+"\n                ")]),t._v(" "),a("FormItem",{attrs:{label:"提交时间："}},[t._v("\n                    "+t._s(t.updateStatusForm.date_added)+"\n                ")]),t._v(" "),a("FormItem",{attrs:{label:"快递单号：",prop:"express_number"}},[a("Input",{staticStyle:{width:"200px"},attrs:{type:"text"},model:{value:t.updateStatusForm.express_number,callback:function(e){t.$set(t.updateStatusForm,"express_number",e)},expression:"updateStatusForm.express_number"}})],1),t._v(" "),a("FormItem",{attrs:{label:"发货状态：",prop:"ship_status"}},[a("RadioGroup",{model:{value:t.updateStatusForm.ship_status,callback:function(e){t.$set(t.updateStatusForm,"ship_status",e)},expression:"updateStatusForm.ship_status"}},[a("Radio",{attrs:{label:"1"}},[a("span",[t._v("待发货")])]),t._v(" "),a("Radio",{attrs:{label:"2"}},[a("span",[t._v("已发货")])])],1)],1)],1),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"text"},on:{click:t.cancelEdit}},[t._v("取消")]),t._v(" "),a("Button",{attrs:{type:"primary",loading:t.saveUpdateStatusLoading},on:{click:t.saveUpdateStatus}},[t._v("保存")])],1)],1)],1)],1)},staticRenderFns:[]},t.exports.render._withStripped=!0}});