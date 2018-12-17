webpackJsonp([17],{1009:function(t,a,e){e(1162);var r=e(65)(e(1091),e(1277),null,null);r.options.__file="F:\\changhaochen\\manage\\src\\views\\user\\realNameAuthentication.vue",r.esModule&&Object.keys(r.esModule).some(function(t){return"default"!==t&&"__esModule"!==t})&&console.error("named exports are not supported in *.vue files."),r.options.functional&&console.error("[vue-loader] realNameAuthentication.vue: functional components are not supported with templates, they should use render functions."),t.exports=r.exports},1091:function(t,a,e){"use strict";(function(t){function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(a,"__esModule",{value:!0});var i=e(155),s=r(i),n=e(230),o=r(n),d=e(116),u=r(d),c=e(100),l=r(c);a.default={name:"real_name_authentication",data:function(){var t=this,a=function(t,a,e){2==a||1==a?e():e(new Error("请选择认证结果"))};return{columns:[{title:"ID",align:"center",key:"id"},{title:"帐号",key:"user_name"},{title:"姓名",key:"name"},{title:"性别",key:"sex"},{title:"身份证号",key:"id_card"},{title:"手机",key:"mobile"},{title:"提交时间",align:"center",key:"date_added"},{title:"状态",key:"authentication_status",align:"center",render:function(t,a){var e="default",r="未审核";return 1==a.row.authentication_status&&(e="green",r="认证"),0==a.row.authentication_status&&(e="default",r="未认证"),2==a.row.authentication_status&&(e="default",r="认证拒绝"),t("Tag",{props:{color:e,size:"small"}},r)}},{title:"操作",key:"action",width:80,align:"center",render:function(a,e){var r=a("Button",{props:{type:"error",size:"small"},on:{click:function(){t.doWhat("authentication",e.index)}}},"审核"),i=[];return t.checkPower("authentication")&&0==e.row.authentication_status&&i.push(r),a("div",i)}}],saveType:"new",doType:"list",switching:!1,tableData:[],merchantTypeData:[],areaData:{areaDataReady:3,province:[],citys:[],district:[]},page:{dataCount:0,pageCount:0,pageSize:10,pageNumber:1,pageSizeOpts:[10,20,50,100]},dataReady:0,currentData:{},defaultData:{id:0,member_id:0,id_card:"",name:"",sex:0,province_id:0,city_id:0,district_id:0,address:"",validity_time:"",validity_status:0,date_added:"",front_image:"",reverse_image:"",image:"",is_authentication:0,user_name:"",mobile:""},updateStatusForm:{},updateStatusValidate:{is_authentication:[{required:!0,validator:a,trigger:"blur"}]},oldPassError:"",updateStatus:!1,saveUpdateStatusLoading:!1,searchData:{keyword:"",searchDate:[],startDate:"",endDate:"",type:0},searchValidata:{},isShowCurrentImage:!1,viewCurrentImage:"",viewCurrentImage_card:""}},computed:{getLoading:function(){return!(0==this.dataReady)},areaDataReady:function(){return!(0==this.areaData.areaDataReady)},doName:function(){return"待实名认证用户列表"},currentDataValidate:function(){return"add"==this.doType?this.addDataValidate:this.editDataValidate},hasDataChange:function(){return!((0,s.default)(this.currentData)==(0,s.default)(this.tableData[this.currentData.listIndex]))}},methods:{checkPower:function(t){return!!this.$store.state.Rights[o.default.api.user.real_name_authentication[t].MD5()]},doWhat:function(t,a){if(!this.checkPower(t))return void this.$Message.warning("对不起，您没有此操作权限！");this.switching=!0,"authentication"==t&&this.changeStatus(a),"list"==t&&(this.resetCurrentData(),this.dataReady+=2,this.init(),this.doType="list"),this.switching=!1},view:function(a){this.currentData=t.extend(!0,{},this.tableData[a]),this.doType="view"},showEdit:function(a){this.currentData=t.extend(!0,{},this.tableData[a]),this.currentData.userewm=o.default.apiRootPath+o.default.api.public.ewm+"&merchantId="+this.currentData.merchantId,this.setCity(this.currentData.merchantProvinceId,!0),this.setDistrict(this.currentData.merchantCityId,!0),this.doType="edit"},viewImage:function(t,a){t&&(this.viewCurrentImage=t,this.viewCurrentImage_card=a,this.isShowCurrentImage=!0)},closeViewImage:function(t){this.viewCurrentImage="",this.isShowCurrentImage=!1},resetCurrentData:function(){this.currentData=t.extend(!0,{},this.defaultData)},changePage:function(t){this.page.pageNumber=t,this.search(t)},changePageSize:function(t){this.page.pageSize=t,this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize),this.search()},resetSearch:function(){this.searchData={keyword:"",searchDate:[],startDate:"",endDate:"",type:""},this.page.pageNumber=1,this.dataReady+=2,this.init()},search:function(t){this.searchData.searchDate.length&&(this.searchData.startDate=u.default.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd"),this.searchData.endDate=u.default.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd")),this.page.pageNumber=1,t&&(this.page.pageNumber=t),this.doWhat("list")},init:function(){this.getMerchantType(),this.getList()},getList:function(){var a=this,e={ssid:l.default.get("ssid"),page:this.page.pageNumber,pageSize:this.page.pageSize};""!=this.searchData.keyword&&(e.user_name=u.default.trim(this.searchData.keyword)),t.ajax({url:o.default.apiRootPath+o.default.api.user.real_name_authentication.list,type:"POST",dataType:"json",data:e}).done(function(t){if(a.dataReady--,t)if(0==t.code){a.page.dataCount=t.data.count,a.page.pageCount=Math.ceil(a.page.dataCount/a.page.pageSize);for(var e=0;e<t.data.list.length;e++)1==t.data.list[e].sex?t.data.list[e].sex="男":t.data.list[e].sex="女";a.tableData=t.data.list}else o.default.showError({vm:a,data:t,errorMsg:""});else o.default.showError({vm:a,data:t,errorMsg:"请求失败"})}).fail(function(t,e,r){a.dataReady--,o.default.showError({vm:a,errorMsg:"服务器通讯失败"})})},getMerchantType:function(){var a=this,e={ssid:l.default.get("ssid"),page:this.page.pageNumber,pageSize:this.page.pageSize};t.ajax({url:o.default.apiRootPath+o.default.api.public.merchantType,type:"POST",dataType:"json",data:e}).done(function(t){if(a.dataReady--,t)if(0==t.code){var e=[];for(var r in t.data)e.push({value:parseInt(r),label:t.data[r]});a.merchantTypeData=e}else o.default.showError({vm:a,data:t,errorMsg:""});else o.default.showError({vm:a,data:t,errorMsg:"请求失败"})}).fail(function(t,e,r){a.dataReady--,o.default.showError({vm:a,errorMsg:"服务器通讯失败"})})},setProvince:function(){var a=this;t.ajax({url:o.default.apiRootPath+o.default.api.public.getProvince,type:"POST",dataType:"json",data:{ssid:l.default.get("ssid")}}).done(function(t){if(t&&0==t.code){var e=[];for(var r in t.data)e[parseInt(t.data[r].id)]={id:t.data[r].id,name:t.data[r].name};a.areaData.province=e}})},setCity:function(a,e){var r=this;a&&(e||(this.currentData.merchantCityId="",this.currentData.merchantDistrictId=""),this.areaData.citys=[],this.areaData.district=[],t.ajax({url:o.default.apiRootPath+o.default.api.public.getCity,type:"POST",dataType:"json",data:{ssid:l.default.get("ssid"),pid:a}}).done(function(t){if(t&&0==t.code){var a=[];for(var e in t.data)a[parseInt(t.data[e].id)]={id:t.data[e].id,name:t.data[e].name,pid:t.data[e].pid};r.areaData.citys=a}}))},setDistrict:function(a,e){var r=this;a&&(this.areaData.district=[],e||(this.currentData.merchantDistrictId=""),t.ajax({url:o.default.apiRootPath+o.default.api.public.getDistrict,type:"POST",dataType:"json",data:{ssid:l.default.get("ssid"),cid:a}}).done(function(t){if(t&&0==t.code){var a=[];for(var e in t.data)a[parseInt(t.data[e].id)]={id:t.data[e].id,name:t.data[e].name,cid:t.data[e].cid};r.areaData.district=a}}))},saveEdit:function(){var a=this;this.hasDataChange&&this.$refs.currentData.validate(function(e){if(e){a.switching=!0;var r=new FormData;r.append("ssid",l.default.get("ssid")),r.append("merchantType",a.currentData.merchantType),r.append("merchantBdMember",a.currentData.merchantBDName),r.append("userName",a.currentData.userName),r.append("merchantName",a.currentData.merchantName),r.append("merchantPhone",a.currentData.merchantPhone),r.append("merchantRatio",a.currentData.merchantRatio),r.append("merchantAddress",a.currentData.merchantAddress),r.append("applicantName",a.currentData.applicantName),r.append("applicantIdCard",a.currentData.applicantIdCard),r.append("merchantProvince",a.currentData.merchantProvinceId),r.append("merchantCity",a.currentData.merchantCityId),r.append("merchantDistrict",a.currentData.merchantDistrictId),r.append("userPassword",a.currentData.userPassword||""),r.append("userConfirmPassword",a.currentData.userConfirmPassword||"");var i=o.default.apiRootPath+o.default.api.user.real_name_authentication.add;"edit"==a.doType&&(r.append("merchantId",a.currentData.merchantId),i=o.default.apiRootPath+o.default.api.user.real_name_authentication.edit);t.ajax({url:i,type:"POST",dataType:"json",data:r,cache:!1,contentType:!1,processData:!1}).done(function(t){a.switching=!1,t?0==t.code?("add"==a.doType&&a.doWhat("list"),a.$Message.success("账户保存成功！")):o.default.showError({vm:a,data:t,errorMsg:""}):o.default.showError({vm:a,data:t,errorMsg:"请求失败"})}).fail(function(t,e,r){a.switching=!1,o.default.showError({vm:a,data:data,errorMsg:"服务器通讯失败"})})}})},changeStatus:function(a){this.updateStatusForm=t.extend(!0,{},this.tableData[a]),this.updateStatusForm.tableIndex=a,this.updateStatus=!0},cancelUpdateStatus:function(){this.updateStatusForm={},this.updateStatus=!1},saveUpdateStatus:function(){var a=this;this.$refs.updateStatusForm.validate(function(e){if(e){a.saveUpdateStatusLoading=!0;var r={ssid:l.default.get("ssid"),id:a.updateStatusForm.id,authentication_status:a.updateStatusForm.is_authentication};t.ajax({url:o.default.apiRootPath+o.default.api.user.real_name_authentication.authentication,type:"POST",dataType:"json",data:r}).done(function(e){if(a.saveUpdateStatusLoading=!1,e)if(0==e.code){a.$Message.success("操作成功！");t.extend(!0,[],a.tableData);a.doWhat("list"),a.updateStatus=!1}else o.default.showError({vm:a,data:e,errorMsg:""});else o.default.showError({vm:a,data:e,errorMsg:"请求失败"})}).fail(function(t,e,r){a.savePassLoading=!1,o.default.showError({vm:a,errorMsg:"服务器通讯失败"})})}})},delete:function(a){var e=this;if(this.tableData[a].id){t.ajax({url:o.default.apiRootPath+o.default.api.user.real_name_authentication.delete,type:"POST",dataType:"json",data:function(){return{ssid:l.default.get("ssid"),id:e.tableData[a].id,status:0}}()}).done(function(t){t?0==t.code?(e.$Message.success("删除成功!"),e.tableData.splice(a,1)):o.default.showError({vm:e,data:t,errorMsg:""}):o.default.showError({vm:e,data:t,errorMsg:"请求失败"})}).fail(function(t,a,r){o.default.showError({vm:e,errorMsg:"服务器通讯失败"})})}}},mounted:function(){window.addEventListener("resize",function(){var t=document.body.clientWidth,a=document.body.clientHeight;Math.sqrt(t*t+a*a)}),this.setProvince()},activated:function(){this.doWhat("list")}}}).call(a,e(154))},1162:function(t,a){},1277:function(t,a,e){t.exports={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("Card",[e("p",{staticClass:"hasButtonP",attrs:{slot:"title"},slot:"title"},[e("Icon",{attrs:{type:"person"}}),t._v("\n            "+t._s(t.doName)+"\n            "),t.checkPower("list")&&"list"!=t.doType?e("Button",{staticClass:"add-btu margin-left-10",attrs:{type:"warning",size:"small"},on:{click:function(a){t.doWhat("list")}}},[t._v("返回列表\n            ")]):t._e()],1),t._v(" "),e("div",{staticClass:"doBox"},[t.switching?e("Spin",{attrs:{size:"large",fix:""}}):t._e(),t._v(" "),"list"==t.doType?e("div",{staticClass:"ordler-list"},[e("div",{staticClass:"search-box"},[e("Form",{ref:"searchData",attrs:{model:t.searchData,rules:t.searchValidata,inline:""}},[e("FormItem",{attrs:{prop:"keyword"}},[e("Input",{attrs:{type:"text",placeholder:"输入名称搜索"},model:{value:t.searchData.keyword,callback:function(a){t.$set(t.searchData,"keyword",a)},expression:"searchData.keyword"}},[e("Icon",{attrs:{slot:"prepend",type:"ios-eye"},slot:"prepend"})],1)],1),t._v(" "),e("FormItem",[e("ButtonGroup",[e("Button",{attrs:{type:"primary",icon:"search"},on:{click:function(a){t.search()}}},[t._v("搜索")]),t._v(" "),e("Button",{on:{click:function(a){t.resetSearch()}}},[t._v("清空")])],1)],1)],1)],1),t._v(" "),e("Table",{staticClass:"small_table",attrs:{border:"",columns:t.columns,loading:t.getLoading,data:t.tableData}}),t._v(" "),e("div",{staticClass:"page-box"},[t.page.dataCount>10?e("Page",{attrs:{total:t.page.dataCount,"show-total":"","page-size-opts":t.page.pageSizeOpts,"page-size":t.page.pageSize,"show-elevator":"",placement:"top","show-sizer":""},on:{"on-change":t.changePage,"on-page-size-change":t.changePageSize}}):t._e()],1)],1):t._e()],1),t._v(" "),e("Modal",{attrs:{closable:!1,"mask-closable":!1,width:500},model:{value:t.updateStatus,callback:function(a){t.updateStatus=a},expression:"updateStatus"}},[e("h3",{staticStyle:{color:"#2D8CF0"},attrs:{slot:"header"},slot:"header"},[t._v("会员实名认证")]),t._v(" "),e("Form",{ref:"updateStatusForm",attrs:{model:t.updateStatusForm,"label-width":150,"label-position":"right",rules:t.updateStatusValidate}},[e("FormItem",{staticStyle:{"margin-bottom":"0px"},attrs:{label:"会员帐号："}},[t._v("\n                    "+t._s(t.updateStatusForm.user_name)+"\n                ")]),t._v(" "),e("FormItem",{staticStyle:{"margin-bottom":"0px"},attrs:{label:"姓名："}},[t._v("\n                    "+t._s(t.updateStatusForm.name)+"\n                ")]),t._v(" "),e("FormItem",{staticStyle:{"margin-bottom":"0px"},attrs:{label:"性别："}},[t._v("\n                    "+t._s(t.updateStatusForm.sex)+"\n                ")]),t._v(" "),e("FormItem",{staticStyle:{"margin-bottom":"0px"},attrs:{label:"身份证号码："}},[t._v("\n                    "+t._s(t.updateStatusForm.id_card)+"\n                ")]),t._v(" "),e("FormItem",{staticStyle:{"margin-bottom":"0px"},attrs:{label:"电话："}},[t._v("\n                    "+t._s(t.updateStatusForm.mobile)+"\n                ")]),t._v(" "),e("FormItem",{staticStyle:{"margin-bottom":"0px"},attrs:{label:"地区："}},[t._v("\n                    "+t._s(t.updateStatusForm.province_name)+t._s(t.updateStatusForm.city_name)+t._s(t.updateStatusForm.district_name)+"\n                ")]),t._v(" "),e("FormItem",{staticStyle:{"margin-bottom":"0px"},attrs:{label:"地址："}},[t._v("\n                    "+t._s(t.updateStatusForm.address)+"\n                ")]),t._v(" "),e("FormItem",{staticStyle:{"margin-bottom":"0px"},attrs:{label:"身份证正面照片："}},[e("img",{staticClass:"viewImg",attrs:{height:"60",src:t.updateStatusForm.front_image},on:{click:function(a){t.viewImage(t.updateStatusForm.front_image,t.updateStatusForm.id_card)}}})]),t._v(" "),e("FormItem",{staticStyle:{"margin-bottom":"0px"},attrs:{label:"身份证背面照片："}},[e("img",{staticClass:"viewImg",attrs:{height:"60",src:t.updateStatusForm.reverse_image},on:{click:function(a){t.viewImage(t.updateStatusForm.reverse_image,t.updateStatusForm.id_card)}}})]),t._v(" "),e("FormItem",{staticStyle:{"margin-bottom":"0px"},attrs:{label:"身份证手持照片："}},[e("img",{staticClass:"viewImg",attrs:{height:"60",src:t.updateStatusForm.image},on:{click:function(a){t.viewImage(t.updateStatusForm.image,t.updateStatusForm.id_card)}}})]),t._v(" "),e("FormItem",{attrs:{label:"审核状态：",prop:"is_authentication"}},[e("RadioGroup",{model:{value:t.updateStatusForm.is_authentication,callback:function(a){t.$set(t.updateStatusForm,"is_authentication",a)},expression:"updateStatusForm.is_authentication"}},[e("Radio",{attrs:{label:"2"}},[e("span",[t._v("拒绝")])]),t._v(" "),e("Radio",{attrs:{label:"1"}},[e("span",[t._v("审核通过")])])],1)],1)],1),t._v(" "),e("div",{attrs:{slot:"footer"},slot:"footer"},[e("Button",{attrs:{type:"text"},on:{click:t.cancelUpdateStatus}},[t._v("取消")]),t._v(" "),e("Button",{attrs:{type:"primary",loading:t.saveUpdateStatusLoading},on:{click:t.saveUpdateStatus}},[t._v("保存")])],1)],1),t._v(" "),e("Modal",{attrs:{width:600},model:{value:t.isShowCurrentImage,callback:function(a){t.isShowCurrentImage=a},expression:"isShowCurrentImage"}},[e("h3",{staticStyle:{color:"#2D8CF0"},attrs:{slot:"header"},slot:"header"},[t._v(t._s(t.viewCurrentImage_card))]),t._v(" "),e("div",{attrs:{align:"center"}},[e("img",{attrs:{src:t.viewCurrentImage,width:"100%"}})]),t._v(" "),e("div",{attrs:{slot:"footer"},slot:"footer"},[e("Button",{attrs:{type:"primary"},on:{click:t.closeViewImage}},[t._v("关闭")])],1)])],1)],1)},staticRenderFns:[]},t.exports.render._withStripped=!0}});