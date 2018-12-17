<style lang="less">
    @import "../../styles/common.less";
</style>

<template>
    <Form
        id="editForm"
        ref="currentData"
        :model="currentData" 
        :label-width="100"
        label-position="right"
        :rules="currentDataValidate"
        @submit="saveEdit"
    >
        <FormItem label="标题：" prop="title">
            <div style="width:500px;">
                <Input v-model="currentData.title" ></Input>
            </div>
        </FormItem>
        <FormItem label="作者：" prop="author">
            <div style="display:inline-block;width:200px;">
                <Input v-model="currentData.author" ></Input>
            </div>
        </FormItem>
        
        <FormItem label="内容：" prop="content">
            <textarea v-model="currentData.content" id="articleEditor"></textarea>
        </FormItem>
        <div>
            <Button type="text" style="width: 100px;" @click="$emit('doWhat','list')" >取消</Button>
            <Button :disable="hasDataChange" type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit()">保存</Button>
        </div>
    </Form>
</template>

<script>
import Cookies from 'js-cookie';
import Config from '../../config/config';


export default {
    name: 'news_add',
    data () {
        const valideMerchantType = (rule, value, callback) => {
            if (value>0) {
                callback();
            } else {
                callback(new Error('请选择商户类型'));
            }
        };
        return {
            editorOption:{
                  modules: {
                    toolbar: '#toolbar'
                  }   
            },
            Kind:{},
            uploadUrl:{},
            currentData:{},
            defaultData:{
                id: 0,
                content: "",
                title: "",
                author: "",
                status: 0,
                date_added: ""
            },
            FormSubmiting:false,
            save_loading: false,
            addDataValidate: {
                title: [
                    { required: true, message: '请填写标题', trigger: 'blur' }
                ],
                author: [
                    { required: true, message: '请输入作者', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请编辑内容', trigger: 'blur' }
                ]
            },
            editDataValidate: {
                title: [
                    { required: true, message: '请填写标题', trigger: 'blur' }
                ],
                author: [
                    { required: true, message: '请输入作者', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请编辑内容', trigger: 'blur' }
                ]
            }
        }
    },
    props : [
        "editData",
        "editType"
    ],
    computed : {
        dowhat (){
            return this.editType
        },
        editor() {
        return this.$refs.myTextEditor.quill;
      },
        beEditData () {
            return this.editData
        },
        contentBody () {
            return this.currentData.content
        },
        currentDataValidate () {
            if(this.doType=="add")return this.addDataValidate;
            return this.editDataValidate;
        },
        hasDataChange () {
            return !(JSON.stringify(this.currentData)==JSON.stringify(this.editData));
        }
    },
    methods: {
        //add && edit
        saveEdit () {

            this.$refs['currentData'].validate((valid) => {

                if (valid) {

                    this.switching = true;
                    let postData={
                        ssid:Cookies.get('ssid'),
                        title:this.currentData.title,
                        author:this.currentData.author,
                        content:this.currentData.content,
                        status:1
                    };
                    let requestUrl=Config.apiRootPath+Config.api.news.news_list.add;
                    
                    if(this.dowhat=="edit"){
                        postData.id=this.currentData.id;
                        requestUrl=Config.apiRootPath+Config.api.news.news_list.edit;
                    };

                    let _this=this;
                    //拉取用户类型
                    $.ajax({
                        url: requestUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: postData
                    })
                    .done((data)=>{
                        this.switching=false;
                        //userTypeList
                        if(!!data){
                            if(data.code==0){
                                if(this.dowhat=="add")this.$emit("doWhat","list");
                                this.$Message.success("保存成功！");
                            }else{
                                Config.showError({vm:this,data:data,
                                    errorMsg:""
                                });
                            }
                        }else{
                            Config.showError({vm:this,data:data,
                                errorMsg:"请求失败"
                            });
                        }
                    })
                    .fail((xhr,status,error)=>{
                        this.switching=false;
                        Config.showError({vm:this,data:data,
                            errorMsg:"服务器通讯失败"
                        });
                    });
                }
            })
        },
        init () {          
        }
    },
    beforeMount () {
    
    },
    mounted () {
        var _this=this;
        this.$store.state.KindEditor.create('#articleEditor',{
            ssid:Cookies.get('ssid'),
            $:$,
            width:800,
            height:300,
            fieldName:"image",
            uploadJson : Config.apiRootPath+Config.api.public.editerUpload,
            allowFileManager : false,
            items:[
                'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
                'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
                'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
                'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 
                'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
                'anchor', 'link', 'unlink', '|', 'about'
            ],
            afterBlur:function (){
                _this.currentData.content=this.html();
            }
        });  
    },
    created () {
        if(this.beEditData.id){
            this.currentData=$.extend(true,{}, this.beEditData)
        }else{
            this.currentData=$.extend(true,{}, this.defaultData)
        };
    },
    deactivated () {
      
    },
    destroyed () {
       // tinyMCE.remove();
    },
    activated (){
    },
    watch : {
    }
};
</script>
