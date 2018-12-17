
<style lang="less">
    @import "../../styles/common.less";
    .page-box{padding-top: 16px; text-align: center }
    .add-btu{ position: relative; float: right}
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .doBox{ position:relative}
    .small_table .ivu-table-cell{ padding-left:8px; padding-right: 8px}
    .small_table table th{ text-align:center}
    .shop-ewm{ position: absolute; right:0px; top:0px;width:180px; text-align: center;font-size:12px}
    .shop-ewm img{width:180px; height: auto; border:1px solid #dededf}
    .ivu-tree{width: 600px}
</style>
<template>
    <div>
        <Card>
            <p slot="title" class="hasButtonP">
                <Icon type="person"></Icon>
                {{doName}}
                <Button type="warning" class="add-btu margin-left-10" size="small"
                        v-if="checkPower('list')&&doType!='list'"
                        @click="doWhat('list')" >返回列表
                </Button>
                <Button type="primary" class="add-btu" size="small"
                        v-if="checkPower('add')&&doType=='list'"
                        @click="doWhat('add')" >添加分类
                </Button>
            </p>
            <div class="doBox">


                <Spin size="large" fix v-if="switching"></Spin>
                <div v-if="doType!='list'">
                    <Form
                            ref="currentData"
                            :model="currentData"
                            :label-width="120"
                            label-position="right"
                            :rules="currentDataValidate"
                    >
                        <FormItem label="分类名称：" prop="title">
                            <div style="display:inline-block;width:204px;">
                                <Input v-model="currentData.title" ></Input>
                            </div>
                        </FormItem>
                        <FormItem label="上级分类：" prop="parent_id">
                            <!--<div style="display:inline-block;width:204px;">-->
                                <!--<Input v-model="currentData.parent_id" ></Input>-->
                            <!--</div>-->

                            <div style="width:204px;">
                                <Select v-model="currentData.parent_id"  placeholder="请选择上级分类">
                                    <Option :value="0" :key="0">顶级分类</Option>
                                    <Option v-for="(item,key) in groupData" v-if="item" :label="item.name" :value="item.id" :key="item.id"><label class="bank-card-username">{{item.name}}</label></Option>
                                </Select>
                            </div>
                        </FormItem>

                        <FormItem label="分类图片：" prop="face">
                            <noUpFileInput :fileInfro="currentData.face"></noUpFileInput>
                        </FormItem>
                        <FormItem label="分类类型：" prop="type">
                            <div style="width:204px;">
                                <Select v-model="currentData.typeData"  placeholder="请选择分类类型">
                                    <Option v-for="item,key in typeData" :value="key" :key="key">{{ item }}</Option>
                                </Select>
                            </div>
                        </FormItem>
                        <FormItem label="是否为积分分类：" prop="is_integral">
                            <RadioGroup v-model="currentData.is_integral">
                                <Radio label="0">
                                    <span>否</span>
                                </Radio>
                                <Radio label="1">
                                    <span>是</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        <div>
                            <Button type="text" style="width: 120px;" @click="doWhat('list')">取消</Button>
                            <Button type="primary" style="width: 120px;" @click="saveEdit">保存</Button>
                        </div>
                    </Form>
                </div>
                <div class="ordler-list" v-if="doType=='list'">
                    <!--<div class="search-box">-->
                        <!--<Form ref="searchData" :model="searchData" :rules="searchValidata" inline>-->
                            <!--<FormItem prop="keyword">-->
                                <!--<Input type="text" v-model="searchData.keyword" placeholder="输入名称搜索帐号">-->
                                <!--<Icon type="ios-eye" slot="prepend"></Icon>-->
                                <!--</Input>-->
                            <!--</FormItem>-->
                            <!--<FormItem>-->
                                <!--<Button type="primary" icon="search" @click="search()">搜索</Button>-->
                            <!--</FormItem>-->
                        <!--</Form>-->
                    <!--</div>-->
                    <!--<Table border :columns="columns" :loading="getLoading" :data="tableData"></Table>-->
                    <div class="top" style="height: 50px;line-height: 50px">
                        <RadioGroup v-model="disabledGroup" @on-change="typeOnChang" type="button" style="width: 300px">
                            <Radio label="1" style="width: 50%">商圈分类</Radio>
                            <Radio label="2" style="width: 50%">商城分类</Radio>
                        </RadioGroup>
                    </div>
                    <Tree :data="tableData" :render="renderContent"></Tree>
                    <div class="page-box">
                        <Page v-if="page.pageCount>1" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                    </div>

                </div>
            </div>
        </Card>
    </div>
</template>

<script>
    import Config from '../../config/config';
    import Util from '../../libs/util';
    import noUpFileInput from '../my_components/upload/noUpFileInput.vue';
    import Cookies from 'js-cookie';
    import { Button, Icon, Form, FormItem, Input, Select, Option, Table, Page } from 'iview';
    import MD5 from '../../libs/md5';

    export default {
        name: 'classify',
        components: {
            noUpFileInput
        },
        data () {
            const valideUserGroupId = (rule, value, callback) => {
                if (value>0) {
                    callback();
                } else {
                    callback(new Error('请选择部门'));
                }
            };
            const validePhone = (rule, value, callback) => {
                var re = /^1[0-9]{10}$/;
                if (!re.test(value)) {
                    callback(new Error('请输入正确格式的手机号'));
                } else {
                    callback();
                }
            };
            const valideRePassword = (rule, value, callback) => {
                if (value !== this.editPasswordForm.newPass) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };
            const valideFace = (rule, value, callback) => {
                if (!value.file) {
                    callback(new Error('请上传分类图片'));
                } else {
                    callback();
                }
            };
            return {

                disabledGroup:2,
                saveType: "new",
                doType:"list",
                switching:false,
                tableData: [],
                groupData: [],
                typeData:['商圈分类','商品分类'],
                page: {
                    dataCount:0,
                    pageCount:0,
                    pageSize: 10,
                    pageNumber: 1,
                    pageSizeOpts:[10,20,50,100]
                },
                dataReady:0,
                currentData: {},
                defaultData:{
                    account: "",
                    name: "",
                    salt:"",
                    mobile: "",
                    face: {
                        url:"",
                        file:"",
                        fileObjName:"分类图片",
                        uploadMenu:"选择图片",
                        uploadType:"sync",
                        type:"image",
                        maxSize:2048
                    },
                    password:"",
                    user_group_id:""
                },
                addDataValidate: {
                    title: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' }
                    ],
                    is_integral: [
                        { required: true, message: '请勾选是否为积分分类', trigger: 'change' }
                    ],
                    // parent_id: [
                    //     { required: true, message: '请输选择父级', trigger: 'blur' }
                    // ],
                    // type: [
                    //     { required: true, message: '请选择分类类型', trigger: 'blur' }
                    // ],
                    // face: [
                    //     { required:false,trigger: 'blur' }
                    // ]
                },
                editDataValidate: {
                    account: [
                        { required: true, message: '请输入帐号', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号码' },
                        { validator: validePhone }
                    ],
                    user_group_id: [
                        { required: true, validator: valideUserGroupId, trigger: 'blur' }
                    ],
                },
                editPasswordForm: {
                    userid: '',
                    oldPass: '',
                    newPass: '',
                    rePass: ''
                },
                passwordValidate: {
                    oldPass: [
                        { required: true, message: '请输入原密码', trigger: 'blur' }
                    ],
                    newPass: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                        { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                    ],
                    rePass: [
                        { required: true, message: '请再次输入新密码', trigger: 'blur' },
                        { validator: valideRePassword, trigger: 'blur' }
                    ]
                },
                oldPassError: '',
                editPasswordModal: false, // 修改密码模态框显示
                savePassLoading: false,
                searchData:{
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:""
                },
                searchValidata: {}
            };
        },
        computed : {
            getLoading () {
                return !(this.dataReady==0);
            },
            doName () {
                if (this.doType=="list") return "商品分类列表";
                if (this.doType=="edit") return "编辑分类";
                return "添加分类";
            },
            currentDataValidate () {
                if(this.doType=="add")return this.addDataValidate;
                return this.editDataValidate;
            },
            hasDataChange () {
                return !(JSON.stringify(this.currentData)==JSON.stringify(this.tableData[this.currentData.listIndex]));
            }
        },
        methods: {

            renderContent (h, { root, node, data }) {
                    return h('span', {
                        style: {
                            display: 'inline-block',
                            width: '100%'
                        }
                    }, [
                        h('span', [
                            h('Icon', {
                                props: {
                                    type: 'ios-folder-outline'
                                },
                                style: {
                                    marginRight: '8px'
                                }
                            }),
                            h('span', data.title)
                        ]),
                        h('span', {
                            style: {
                                display: 'inline-block',
                                float: 'right',
                                marginRight: '32px'
                            }
                        }, [
                            h('Button', {
                                props: {
                                    // icon: 'ios-plus-empty',
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => { this.showEdit(data) }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    // icon: 'ios-plus-empty',
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => { this.delete(data)}
                                }
                            }, '删除')

                        ])
                    ]);

            },

            //typeOnChang
            typeOnChang(event){
                this.getList();
            },
            append (data) {
                const children = data.children || [];
                children.push({
                    title: 'appended node',
                    expand: false
                });
                this.$set(data, 'children', children);
            },
            remove (root, node, data) {

                // const parentKey = root.find(el => el === node).parent;
                // const parent = root.find(el => el.nodeKey === parentKey).node;
                // const index = parent.children.indexOf(data);
                // parent.children.splice(index, 1);
            },
            //controller
            checkPower (dotype) {
               
                return !!this.$store.state.Rights[Config.api.management.classify[dotype].MD5()];
            },
            doWhat (dotype,dataIndex) {
                console.log(this.checkPower(dotype));
                // if(!this.checkPower(dotype)){
                //     this.$Message.warning("对不起，您没有此操作权限！");
                //     return;
                // };
                this.switching=true;
                if(dotype=="add"){
                    this.resetCurrentData();
                    this.doType="add";
                };
                if(dotype=="edit"){
                    this.showEdit(dataIndex);
                    this.doType="edit";
                };
                if(dotype=="delete"){
                    this.delete(dataIndex);
                };
                if(dotype=="list"){
                    this.resetCurrentData();
                    this.dataReady+=2;
                    this.init();
                    this.doType="list";
                };
                this.switching=false;
            },
            showEdit (index) {
                this.currentData=index;
                this.doType="edit";
            },
            //comm
            resetCurrentData () {
                this.currentData = $.extend(true, {}, this.defaultData);
            },
            changePage (pageNumber){
                this.page.pageNumber=pageNumber;
                this.search(pageNumber);
            },
            changePageSize (pageSize){
                this.page.pageSize=pageSize;
                this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                this.search();
            },
            resetSearch: function () {
                this.searchData = {
                    keyword: '',
                    searchDate: [],
                    startDate: '',
                    endDate: '',
                    type: 0
                };
                this.page.pageNumber = 1;
                this.dataReady += 1;
                this.init();
            },
            //list
            resetSearch () {
                this.searchData={
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:""
                };
                this.page.pageNumber=1;
                this.dataReady+=1;
                this.init();
            },
            search (pageNumber) {
                if(this.searchData.searchDate.length){
                    this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                    this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
                };
                this.page.pageNumber=1;
                if(pageNumber)this.page.pageNumber=pageNumber;
                this.doWhat("list");
            },
            init () {
                this.getGroups();
                this.getList();
            },
            getList () {
                let postData={
                    ssid:Cookies.get('ssid'),
                    page:this.page.pageNumber,
                    pageSize:this.page.pageSize,
                    type:this.disabledGroup
                };
                if(this.searchData.keyword!="")postData.user_name=this.searchData.keyword;

                $.ajax({
                    url: Config.apiRootPath+Config.api.management.classify.list,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        this.dataReady--;
                        // getList
                        if(!!data){
                            if(data.code==0){
                                // this.page.dataCount=data.data.count;
                                // this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                                //format list data

                                let newListData=[];
                                    for (var i=0;i<data.data.list.length;i++){

                                        newListData.push({
                                            id:data.data.list[i].id,
                                            url:data.data.list[i].image,
                                            parent_id:data.data.list[i].parent_id,
                                            title:data.data.list[i].name,
                                            typeData:data.data.list[i].type-1,
                                            children:[],
                                            face: {
                                                url:data.data.list[i].image,
                                                file:"",
                                                fileObjName:"分类图片",
                                                uploadMenu:"选择图片",
                                                uploadType:"sync",
                                                type:"image",
                                                maxSize:2048
                                            },
                                            expand:false


                                        })
                                        if(data.data.list[i].subclass==undefined){

                                        }else{
                                            for (let j = 0; j <data.data.list[i].subclass.length ; j++) {
                                                newListData[i].children.push({
                                                    id:data.data.list[i].subclass[j].id,
                                                    title:data.data.list[i].subclass[j].name,
                                                    face: {
                                                        url:data.data.list[i].subclass[j].image,
                                                        file:"",
                                                        fileObjName:"分类图片",
                                                        uploadMenu:"选择图片",
                                                        uploadType:"sync",
                                                        type:"image",
                                                        maxSize:2048
                                                    },
                                                    typeData:data.data.list[i].subclass[j].type-1,
                                                    parent_id:data.data.list[i].subclass[j].parent_id,
                                                    url:data.data.list[i].subclass[j].image,
                                                    expand:false
                                                })
                                            }
                                        }

                                    } ;
                                this.tableData=newListData;

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
                        this.dataReady--;
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });
            },
            getGroups () {
                let postData={
                    ssid:Cookies.get('ssid')
                };
                $.ajax({
                    url: Config.apiRootPath+Config.api.management.classify.lists,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        // getBankCardList
                        this.dataReady--;
                        if(!!data){
                            if(data.code==0){
                                this.groupData=data.data.list;
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
                        this.dataReady--;
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });
            },
            //add && edit
            saveEdit () {
                if(!this.hasDataChange)return;
                this.$refs['currentData'].validate((valid) => {

                    if (valid) {
                        this.switching = true;

                        var formData = new FormData();
                        formData.append("ssid", Cookies.get('ssid'));
                        formData.append("name", this.currentData.title);

                        formData.append("parent_id", this.currentData.parent_id);
                        formData.append("type", this.currentData.typeData+1);
                        if(this.currentData.is_integral){
                        	formData.append("is_integral", this.currentData.is_integral);
                        }
                        if(this.currentData.face.file){
                            formData.append("image", this.currentData.face.file);
                        };

                        let requestUrl=Config.apiRootPath+Config.api.management.classify.add;

                        if(this.doType=="edit"){
                            // formData.append("id", this.currentData.groupData);
                            formData.append("id", this.currentData.id);
                            requestUrl=Config.apiRootPath+Config.api.management.classify.edit;
                        };

                        let _this=this;
                        //拉取用户类型
                        $.ajax({
                            url: requestUrl,
                            type: 'POST',
                            dataType: 'json',
                            data: formData,
                            cache: false,
                            contentType: false,
                            processData: false
                        })
                            .done((data)=>{
                                this.switching=false;
                                //userTypeList
                                if(!!data){
                                    if(data.code==0){
                                        this.currentData.face.file="";
                                        // if(this.doType=="add")this.doWhat("list");
                                        this.doWhat("list");
                                        this.$Message.success("账户保存成功！");
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


            //delete
            delete (index) {

                let postData= {
                    ssid: Cookies.get('ssid'),
                    id: index.id
                    // status:0
                };
                $.ajax({
                    url: Config.apiRootPath+Config.api.management.classify.delete,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        //userTypeList
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("删除成功!");
                                this.doWhat("list");
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
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });
            }
        },
        mounted () {
        },
        activated (){
            this.init();
        }
    };
</script>
