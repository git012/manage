webpackJsonp([9],{1005:function(e,t,a){a(1168);var s=a(66)(a(1086),a(1286),null,null);s.options.__file="F:\\changhaochen\\GitHub\\manage\\src\\views\\own-space\\own-space.vue",s.esModule&&Object.keys(s.esModule).some(function(e){return"default"!==e&&"__esModule"!==e})&&console.error("named exports are not supported in *.vue files."),s.options.functional&&console.error("[vue-loader] own-space.vue: functional components are not supported with templates, they should use render functions."),e.exports=s.exports},1015:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"noUpFileInput",data:function(){return{uploadApi:"",imgName:"",newFilePath:"",fileData:"",visible:!1,upLoading:!1,fileType:{image:/\.(gif|jpg|jpeg|png)$/,rar:/\.(rar|zip|7z)$/,txt:/\.(doc|docx|pdf|xsl|xslx|ppt|pptx|txt)$/,music:/\.(mp3|mp4|wma)$/}}},props:["fileInfro"],computed:{FilePath:function(){return this.newFilePath?this.newFilePath:this.fileInfro.url},file_infro:function(){return this.fileInfro?{uploadApi:this.fileInfro.uploadApi||this.uploadApi,url:this.fileInfro.url||"",fileObj:this.fileInfro.fileObj||"uploadFile",fileObjName:this.fileInfro.fileObjName||"图片",uploadMenu:this.fileInfro.uploadMenu||"选择图片",uploadType:this.fileInfro.uploadType||"sync",type:this.fileInfro.type||"image",maxSize:this.fileInfro.maxSize?this.fileInfro.maxSize:2048}:{url:"",fileObj:"uploadFile",fileObjName:"图片",uploadMenu:"选择图片",uploadType:"sync",type:"image",maxSize:2048}}},methods:{handleView:function(){this.visible=!0},selectFile:function(){this.$refs.fileObj.click()},handleFormatError:function(e){this.upLoading=!1,this.$Notice.warning({title:"文件类型错误",desc:"上传文件："+e.name+" 文件类型不正确"})},handleMaxSize:function(e){this.upLoading=!1,this.$Notice.warning({title:"文件过大",desc:"上传文件："+e.name+" 过大，请不要超过"+this.bytesToSize(1024*this.file_infro.maxSize)})},handleGetFile:function(){var e=this.$refs.fileObj.files[0];if(e){var t=e.name.substr(e.name.lastIndexOf(".")).toLowerCase();if(!this.fileType[this.file_infro.type].test(t))return this.handleFormatError(e),!1;if(Math.round(e.size/1024*100)/100>this.file_infro.maxSize)return this.handleMaxSize(e),!1;this.imgName=e.name,this.showPreview(e),this.fileInfro.file=e}},showPreview:function(e){var t=this;if(window.FileReader&&e){var a=new FileReader;a.onloadend=function(e){t.newFilePath=e.target.result},a.readAsDataURL(e)}},bytesToSize:function(e){if(0===e)return"0 B";var t=["B","KB","MB","GB","TB","PB","EB","ZB","YB"],a=Math.floor(Math.log(e)/Math.log(1024));return(e/Math.pow(1024,a)).toPrecision(3)+" "+t[a]}}}},1016:function(e,t){},1017:function(e,t){},1018:function(e,t,a){a(1016),a(1017);var s=a(66)(a(1015),a(1019),"data-v-1409293c",null);s.options.__file="F:\\changhaochen\\GitHub\\manage\\src\\views\\my_components\\upload\\noUpFileInput.vue",s.esModule&&Object.keys(s.esModule).some(function(e){return"default"!==e&&"__esModule"!==e})&&console.error("named exports are not supported in *.vue files."),s.options.functional&&console.error("[vue-loader] noUpFileInput.vue: functional components are not supported with templates, they should use render functions."),e.exports=s.exports},1019:function(e,t,a){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"noUpFileInput"},[e.FilePath&&"image"==e.fileInfro.type?a("div",{staticClass:"noUpFileInput-filebox"},[a("img",{staticClass:"re-noUpFileInput-images",attrs:{src:e.FilePath,width:"auto",height:"58"},on:{click:function(t){e.handleView()}}})]):e._e(),e._v(" "),a("input",{ref:"fileObj",staticClass:"noup-file-Input",attrs:{type:"file"},on:{change:function(t){e.handleGetFile()}}}),e._v(" "),e.imgName?a("span",{staticClass:"noUpFileInput-newfile-name"},[e._v(e._s(e.imgName))]):e._e(),e._v(" "),a("Button",{attrs:{type:"ghost",icon:"ios-cloud-upload-outline"},on:{click:e.selectFile}},[e._v(e._s(e.file_infro.uploadMenu))]),e._v(" "),a("Modal",{attrs:{title:"图片预览","cancel-text":"关闭"},model:{value:e.visible,callback:function(t){e.visible=t},expression:"visible"}},[e.visible?a("img",{staticStyle:{width:"100%"},attrs:{src:e.FilePath}}):e._e()])],1)},staticRenderFns:[]},e.exports.render._withStripped=!0},1086:function(e,t,a){"use strict";(function(e){function s(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=a(155),r=s(o),i=a(100),n=s(i),l=a(231),d=s(l),u=a(1018),p=s(u);t.default={name:"own_space",components:{noUpFileInput:p.default},data:function(){var e=this;return{userForm:{account:"",name:"",salt:"",cellphone:"",face:{url:"",file:"",fileObjName:"用户头像",uploadMenu:"选择图片",uploadType:"sync",type:"image",maxSize:2048},user_group_id:"",department:"",group_id:""},origin_data:{},save_loading:!1,editPasswordModal:!1,savePassLoading:!1,oldPassError:"",inforValidate:{name:[{required:!0,message:"请输入姓名",trigger:"blur"}],cellphone:[{required:!0,message:"请输入手机号码"},{validator:function(e,t,a){/^1[0-9]{10}$/.test(t)?a():a(new Error("请输入正确格式的手机号"))}}]},editPasswordForm:{oldPass:"",newPass:"",rePass:""},passwordValidate:{oldPass:[{required:!0,message:"请输入原密码",trigger:"blur"}],newPass:[{required:!0,message:"请输入新密码",trigger:"blur"},{min:6,message:"请至少输入6个字符",trigger:"blur"},{max:32,message:"最多输入32个字符",trigger:"blur"}],rePass:[{required:!0,message:"请再次输入新密码",trigger:"blur"},{validator:function(t,a,s){a!==e.editPasswordForm.newPass?s(new Error("两次输入密码不一致")):s()},trigger:"blur"}]}}},computed:{hasDataChange:function(){return!((0,r.default)(this.origin_data)==(0,r.default)(this.userForm))}},methods:{showEditPassword:function(){this.editPasswordModal=!0},cancelEditUserInfor:function(){this.$store.commit("removeTag","ownspace_index"),localStorage.pageOpenedList=(0,r.default)(this.$store.state.pageOpenedList);var e="";e=this.$store.state.pageOpenedList.length>1?this.$store.state.pageOpenedList[1].name:this.$store.state.pageOpenedList[0].name,this.$router.push({name:e})},saveEdit:function(){var t=this;this.hasDataChange&&this.$refs.userForm.validate(function(a){if(a){var s=new FormData;s.append("ssid",n.default.get("ssid")),s.append("id",n.default.get("user_id")),s.append("user_group_id",t.userForm.group_id),s.append("username",t.userForm.account),s.append("name",t.userForm.name),s.append("mobile",t.userForm.cellphone),s.append("salt",t.userForm.salt),t.userForm.face.file&&s.append("image",t.userForm.face.file),t.save_loading=!0;e.ajax({url:d.default.apiRootPath+d.default.api.own_space.edit,type:"POST",dataType:"json",data:s,cache:!1,contentType:!1,processData:!1}).done(function(e){t.save_loading=!1,e?0==e.code?(t.userForm.face.file="",t.init(),t.$Message.success("成功保存基本信息！")):d.default.showError({vm:t,data:e,errorMsg:""}):d.default.showError({vm:t,data:e,errorMsg:"请求失败"})}).fail(function(e,a,s){t.save_loading=!1,d.default.showError({vm:t,data:data,errorMsg:"服务器通讯失败"})})}})},cancelEditPass:function(){this.editPasswordModal=!1},saveEditPass:function(){var t=this;this.$refs.editPasswordForm.validate(function(a){if(a){t.savePassLoading=!0;var s={ssid:n.default.get("ssid"),id:n.default.get("user_id"),password:t.editPasswordForm.oldPass,new_password:t.editPasswordForm.newPass,ok_new_password:t.editPasswordForm.rePass};e.ajax({url:d.default.apiRootPath+d.default.api.own_space.modifyPassword,type:"POST",dataType:"json",data:s}).done(function(e){t.savePassLoading=!1,e?0==e.code?(t.$Message.success("修改密码成功！"),t.editPasswordForm.oldPass="",t.editPasswordForm.newPass="",t.editPasswordForm.rePass="",t.editPasswordModal=!1):d.default.showError({vm:t,data:e,errorMsg:""}):d.default.showError({vm:t,data:e,errorMsg:"请求失败"})}).fail(function(e,a,s){t.savePassLoading=!1,d.default.showError({vm:t,data:data,errorMsg:"服务器通讯失败"})})}})},init:function(){var t=this,a={ssid:n.default.get("ssid"),id:n.default.get("user_id")};e.ajax({url:d.default.apiRootPath+d.default.api.own_space.detail,type:"POST",dataType:"json",data:a}).done(function(a){if(a){if(0!=a.code)return;t.userForm.account=a.data.username,t.userForm.name=a.data.name,t.userForm.salt=a.data.salt,t.userForm.group_id=a.data.user_group_id,t.userForm.cellphone=a.data.mobile,t.userForm.face.url=a.data.image,t.userForm.department=a.data.user_group_name,t.$store.commit("setAvator",a.data.image),t.origin_data=e.extend(!0,{},t.userForm)}else d.default.showError({vm:t,data:a,errorMsg:"获取用户基本信息失败"})}).fail(function(e,a,s){d.default.showError({vm:t,data:data,errorMsg:"获取用户基本信息失败"})})}},mounted:function(){},activated:function(){this.init()}}}).call(t,a(154))},1168:function(e,t){},1286:function(e,t,a){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("Card",[a("p",{attrs:{slot:"title"},slot:"title"},[a("Icon",{attrs:{type:"person"}}),e._v("\n            个人信息修改\n        ")],1),e._v(" "),a("div",[a("Form",{ref:"userForm",attrs:{model:e.userForm,"label-width":100,"label-position":"right",rules:e.inforValidate}},[a("FormItem",{attrs:{label:"用户帐号：",prop:"account"}},[a("div",{staticStyle:{display:"inline-block",width:"300px"}},[e._v("\n                        "+e._s(e.userForm.account)+"\n                    ")])]),e._v(" "),a("FormItem",{attrs:{label:"用户姓名：",prop:"name"}},[a("div",{staticStyle:{display:"inline-block",width:"204px"}},[a("Input",{model:{value:e.userForm.name,callback:function(t){e.$set(e.userForm,"name",t)},expression:"userForm.name"}})],1)]),e._v(" "),a("FormItem",{attrs:{label:"用户手机：",prop:"cellphone"}},[a("div",{staticStyle:{display:"inline-block",width:"204px"}},[a("Input",{model:{value:e.userForm.cellphone,callback:function(t){e.$set(e.userForm,"cellphone",t)},expression:"userForm.cellphone"}})],1)]),e._v(" "),a("FormItem",{attrs:{label:"头像：",prop:"userface"}},[a("noUpFileInput",{attrs:{fileInfro:e.userForm.face}})],1),e._v(" "),a("FormItem",{attrs:{label:"部门："}},[a("span",[e._v(e._s(e.userForm.department))])]),e._v(" "),a("FormItem",{attrs:{label:"登录密码："}},[a("Button",{attrs:{type:"text",size:"small"},on:{click:e.showEditPassword}},[e._v("修改密码")])],1),e._v(" "),a("div",[a("Button",{staticStyle:{width:"100px"},attrs:{type:"text"},on:{click:e.cancelEditUserInfor}},[e._v("取消")]),e._v(" "),a("Button",{staticStyle:{width:"100px"},attrs:{type:"primary",loading:e.save_loading},on:{click:e.saveEdit}},[e._v("保存")])],1)],1)],1)]),e._v(" "),a("Modal",{attrs:{closable:!1,"mask-closable":!1,width:500},model:{value:e.editPasswordModal,callback:function(t){e.editPasswordModal=t},expression:"editPasswordModal"}},[a("h3",{staticStyle:{color:"#2D8CF0"},attrs:{slot:"header"},slot:"header"},[e._v("修改密码")]),e._v(" "),a("Form",{ref:"editPasswordForm",attrs:{model:e.editPasswordForm,"label-width":100,"label-position":"right",rules:e.passwordValidate}},[a("input",{staticStyle:{display:"none"},attrs:{type:"password",name:"notAutoComplete"}}),e._v(" "),a("FormItem",{attrs:{label:"原密码",prop:"oldPass",error:e.oldPassError}},[a("Input",{attrs:{type:"password",placeholder:"请输入现在使用的密码"},model:{value:e.editPasswordForm.oldPass,callback:function(t){e.$set(e.editPasswordForm,"oldPass",t)},expression:"editPasswordForm.oldPass"}})],1),e._v(" "),a("FormItem",{attrs:{label:"新密码",prop:"newPass"}},[a("Input",{attrs:{placeholder:"请输入新密码，至少6位字符"},model:{value:e.editPasswordForm.newPass,callback:function(t){e.$set(e.editPasswordForm,"newPass",t)},expression:"editPasswordForm.newPass"}})],1),e._v(" "),a("FormItem",{attrs:{label:"确认新密码",prop:"rePass"}},[a("Input",{attrs:{placeholder:"请再次输入新密码"},model:{value:e.editPasswordForm.rePass,callback:function(t){e.$set(e.editPasswordForm,"rePass",t)},expression:"editPasswordForm.rePass"}})],1)],1),e._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"text"},on:{click:e.cancelEditPass}},[e._v("取消")]),e._v(" "),a("Button",{attrs:{type:"primary",loading:e.savePassLoading},on:{click:e.saveEditPass}},[e._v("保存")])],1)],1)],1)},staticRenderFns:[]},e.exports.render._withStripped=!0}});