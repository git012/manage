<style lang="less">
    @import '../../styles/common.less';
    @import './department.less';
    .page-box{padding-top: 16px; text-align: center }
    .add-btu{ position: relative; float: right}
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .doBox{ position:relative}
    .rightsTree{line-height:22px; margin-top: -3px}
    .rightsTree .ivu-tree-arrow{ 
        // font-size: 16px;
        // line-height:22px;    
         width: 10px;
         padding-left:3px;
         display: inline-block;
        }
    .rightsTree .ivu-tree-arrow i{}
</style>

<template>
    <div>
        <Card>
            <p slot="title" class="hasButtonP">
                <Icon type="aperture"></Icon>
                {{doName}}
                <Button type="warning" class="add-btu margin-left-10" size="small" v-if="doType!='list'" @click="doWhat('list')">返回列表</Button>
                <Button type="primary" class="add-btu" size="small" v-if="doType!='add'" @click="doWhat('add')">添加部门</Button>
            </p>
            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>
                <div v-if="doType!='list'">
                    <Form ref="currentData" :model="currentData" :label-width="100" label-position="right" :rules="currentDataValidate">
                        <FormItem label="部门名称：" prop="name">
                            <Input style="width: 200px" v-model="currentData.name" placeholder="部门名称" ></Input>
                        </FormItem>
                        <FormItem label="操作权限：" prop="permission">
                            <Tree v-if="treeDataReady" multiple class="rightsTree" ref="rightsTree" @on-check-change="getSelectRights" :data="rightsTreeData" show-checkbox></Tree>
                        </FormItem>
                        <FormItem>
                             <Button type="primary" size="small" @click="saveEdit">保存</Button> 
                             <Button type="text" size="small" @click="doWhat('list')">取消</Button>
                        </FormItem>
                    </Form>     
                </div>
                <div v-if="doType=='list'" class="ordler-list">
                    <Table border :columns="columns" :loading="getLoading" :data="tableData"></Table>
                    <div class="page-box">
                    <Page v-if="page.pageCount>1" :total="page.dataCount" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                    </div>
                </div>
            </div>
        </Card>

    </div>
</template>

<script>
import Config from '../../config/config';
import Util from '../../libs/util';
import Cookies from 'js-cookie';


export default {
    name: 'admin_department',
    data () {
        const validePermission = (rule, value, callback) => {
            if (value.length<1) {
                callback(new Error('请选择部门操作权限'));
            } else {
                callback();
            }
        };
        return {
            columns: [
                {
                    title: 'ID',
                    key: 'id',
                    // width: "10%"
                },
                {
                    title: '部门名称', 
                    key: 'name'
                },
                {
                    title: '操作',
                    "sortable": true,
                    key: 'status',
                    // width: "140px",
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.showEdit(params.index)
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.delete(params.index)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            saveType: "new",
            doType:"list",
            switching:false,
            tableData: [],
            page: {
                dataCount:0,
                pageCount:0,
                pageSize: 10,
                pageNumber: 1,
                pageSizeOpts:[10,20,50,100]
            },
            rights:[],
            _rightsTreeData:[],
            rightsTreeData:[],
            treeDataReady:false,
            currentData: {
                "id":0,
                "name":"",
                "permission":[]
            },
            getLoading: false,
            searchData:{
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:""
            },
            currentDataValidate: {
                name: [
                    { required: true, message: '请输入部门名称', trigger: 'blur' }
                ],
                permission: [
                    { validator: validePermission, trigger: 'blur' }
                ]
            }
        };
    },
    computed : {
        doName () {
            if (this.doType=="list") return "部门管理";
            if (this.doType=="edit") return "编辑部门";
            return "添加部门";
        }
    },
    methods: {
        getSelectRights (selectedRights){
            let newPermission=[];
            $.each(selectedRights,(index, el)=>{
                if(el.id)newPermission.push(el.id);
            });
            this.currentData.permission=newPermission;
        },
        doWhat (dotype) {
            this.switching=true;
            if(dotype=="add"){
                this.currentData = {
                    "id":0,
                    "name":"",
                    "permission":[]
                };
                this.rightsTreeData=$.extend(true,[], this._rightsTreeData);
            };
            if(dotype=="list"){
                this.currentData = {
                    "id":0,
                    "name":"",
                    "permission":[]
                };
                this.init();
            };

            this.doType=dotype;
            this.switching=false;
        },
        saveEdit () {
            this.$refs['currentData'].validate((valid) => {
                if (valid) {
                    this.switching = true;
                    let postData={
                        ssid:Cookies.get('ssid'),
                        name:this.currentData.name,
                        permission:JSON.stringify(this.currentData.permission)
                    };
                    let requestUrl=Config.apiRootPath+Config.api.system.admin_department.add;
                    
                    if(this.doType=="edit"){
                        postData.id=this.currentData.id;
                        requestUrl=Config.apiRootPath+Config.api.system.admin_department.edit;
                    };
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
                                this.$Message.success("添加成功");
                                this.doWhat("list");
                                this.init();
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
                        this.doWhat("list");
                        Config.showError({vm:this,data:"",
                            errorMsg:"服务器通讯失败"
                        });
                    });
                }    
            })
        },
        showEdit (index) {
            this.switching=true;
            if(!this.treeDataReady){
                this.$Message.error("操作权限加载中，请稍后重试");
                return;
            };
            this.treeDataReady=false;
            this.currentData = $.extend(true, {}, this.tableData[index]);
            this.currentData.dataIndex=index;
            this.rightsTreeData=$.extend(true,[], this._rightsTreeData);
            $.each(this.rightsTreeData,(index, el)=>{
                if(el.children){
                    $.each(el.children,(childrenIndex, childrenEl)=>{
                        for(let i=0;i<this.currentData.permission.length;i++){
                            if(this.currentData.permission[i]==childrenEl.id){
                                //el.checked=true;
                                childrenEl.checked=true;
                            }
                        }
                    })
                };
            });
            this.treeDataReady=true;
            this.doType="edit";
            this.switching=false;
        },
        //for list
        changePage (pageNumber){
            this.page.pageNumber=pageNumber;
            this.search();
        },
        changePageSize (pageSize){
            this.page.pageSize=pageSize;
            this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
            this.search();
        },
        search () {
            if(this.searchData.searchDate.length){
                this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
            }
            this.init();
        },
        //for init
        setRights () {           
            let postData={
                ssid:Cookies.get('ssid')
            };
            $.ajax({
                url: Config.apiRootPath+Config.api.system.admin_department.rights,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                // getBankCardList
                if(!!data){
                    if(data.code==0){
                        this.rights=data.data;
                        let _this=this;
                        $.each(this.rights,function(index, el) {
                            let bigNode={
                                title:el.module,
                                expand: false,
                                children: []
                            };
                            if(el.form){
                                $.each(el.form,function(small_index, small_el) {
                                    bigNode.children.push({
                                        title:small_el.name,
                                        id:small_el.id,
                                        checked:false
                                    })
                                })
                            }
                            _this.rightsTreeData.push(bigNode);
                        });
                        this._rightsTreeData=$.extend(true,[], _this.rightsTreeData);
                        this.treeDataReady=true;
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
        },
        init () {
            this.getLoading=true;
            let postData={
                ssid:Cookies.get('ssid'),
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            $.ajax({
                url: Config.apiRootPath+Config.api.system.admin_department.list,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                // getBankCardList
                this.getLoading=false;
                if(!!data){
                    if(data.code==0){
                        this.page.dataCount=data.data.count;
                        this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                        this.tableData=data.data.list;
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
                this.getLoading=false;
                Config.showError({vm:this,
                    errorMsg:"服务器通讯失败"
                });
            });
        },
                //delete
        delete (index) {

            if(!this.tableData[index].id)return;
            //银行选择
            let postData=()=>({
                    ssid:Cookies.get('ssid'),
                    id:this.tableData[index].id,
                    status:0
                });
            $.ajax({
                url: Config.apiRootPath+Config.api.system.admin_department.delete,
                type: 'POST',
                dataType: 'json',
                data: postData()
            })
            .done((data)=>{
                //userTypeList
                if(!!data){
                    if(data.code==0){
                        this.$Message.success("删除成功!"); 
                        this.tableData.splice(index, 1);
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
        this.setRights();
    },
    activated () {
        this.init();
    }
};
</script>
