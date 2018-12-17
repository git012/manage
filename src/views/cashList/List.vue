/*评论管理*/
<style lang="less">
    /*@import './merchant/merchant.less';*/
    /*.page-box{padding-top: 16px; text-align: center }*/
    /*.add-btu{ position: relative; float: right}*/
    /*.ivu-card-head p.hasButtonP{ overflow:visible;}*/
    /*.doBox{ position:relative}*/
    /*.small_table .ivu-table-cell{ padding-left:8px; padding-right: 8px}*/
    /*.small_table table th{ text-align:center}*/
    /*.shop-ewm{ position: absolute; right:0px; top:0px;width:180px; text-align: center;font-size:12px}*/
    /*.shop-ewm img{width:180px; height: auto; border:1px solid #dededf}*/
</style>
<template>
    <div>
        <Card>
            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>
                <div v-if="doType!='list'">
                    <Form 
                        ref="currentData"
                        :model="currentData" 
                        :label-width="100" 
                        label-position="right"
                        :rules="currentDataValidate"
                    >
                        <FormItem label="用户名：" prop="memberName">
                            <div style="display:inline-block;width:204px;">
                                <Input v-model="currentData.memberName" ></Input>
                            </div>
                        </FormItem>
                      <!--   <FormItem label="期数" prop="rank">
                            

                            <Select v-model="currentData.rank" style="width:204px" @on-change="rankclick" placeholder="选择期数" disabled="disabled">
                                    <Option value="12">12</Option>
                                    <Option value="24">24</Option>
                                    <Option value="36">36</Option>
                                </Select>
                        </FormItem> -->
                       <!--  <FormItem label="兑付方案">
                         
                            <Select v-model="currentData.ranks" style="width:204px" placeholder="选择兑付方案" disabled="disabled">
                                    <Option :value="1">方案一</Option>
                                    <Option :value="2">方案二</Option>
                                    <Option :value="3">方案三</Option>
                                </Select>
                        </FormItem> -->
                        <FormItem label="金额：" prop="amount" >
                            <div style="display:inline-block;width:204px;">
                                <Input v-model="currentData.amount" ></Input>
                            </div>
                        </FormItem>
                        <div>
                            <Button type="text" style="width: 100px;" @click="doWhat('list')">取消</Button>
                            <Button type="primary" style="width: 100px;" @click="saveEdit">保存</Button>
                        </div>
                    </Form>    
                </div>
                <div class="ordler-list" v-if="doType=='list'">
                      <div class="search-box" style="margin-bottom: 20px;">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline style="display: inline-block">
                            <FormItem prop="keyword" style="margin-bottom:0px">
                                <Input type="text" v-model="searchData.keyword" placeholder="输入名称搜索帐号">
                                <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem style="margin-bottom:0px">
                                <ButtonGroup>
                                    <Button type="primary" icon="search" @click="search()">搜索</Button>
                                    <!-- <Button type="success" icon="android-download" @click="download()">导出</Button> -->
                                    <Button @click="resetSearch">清空</Button>
                                </ButtonGroup>
                            </FormItem>
                        </Form>
                    <Button type="primary" class="add-btu" size="small" 
                        v-if="doType=='list'" 
                        @click="doWhat('add')" >添加
                    </Button>
                    </div>
                  <!--   <Button type="primary" :loading="loadBut" style="margin: 10px 0 10px" @click="batchOperation()" >批量操作</Button> -->
                    <Table border :columns="columns" :loading="getLoading" :data="tableData" ></Table>
                    <div class="page-box">
                        <Page v-if="page.dataCount>10" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
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
    import MD5 from '../../libs/md5';
    export default {
        name: 'List',
        data () {
            const valideCashStatus = (rule, value, callback) => {
                if (value==0||value==1) {
                    callback();
                } else {
                    callback(new Error(rule.message));
                }
            };
        const valideUserGroupId = (rule, value, callback) => {
                if (value>0) {
                    callback();
                } else {
                    callback(new Error('请选择部门'));
                }
            };
        const validePhone = (rule, value, callback) => {
            var re = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!re.test(value)) {
                callback(new Error('请输入正确格式的金额'));
            } else {
                callback();
            }
        };
            return {
                // tableOptions:{
                //     width:"100%"
                // },
                columns: [
                    {
                        title: '用户名',
                        key: 'name'
                    },
                    {
                        title: '已返',
                        key: 'amount_yes',
                        render: (h, params) => {
                        let tagText=(Number(params.row.amount_yes)/100).toFixed(2);
                        return h('span', {}, tagText);
                    } 
                    
                    },
                    {
                        title: '待返',
                        key: 'amount_no',
                         render: (h, params) => {
                        let tagText=(Number(params.row.amount_no)/100).toFixed(2);
                        return h('span', {}, tagText);
                    }
                       
                
                    },
                    {
                        title: '总金额',
                        key: 'total'                
                    },
                    {
                        title: '日期',
                        key: 'created'                
                    },
                    {
                        title: '期数',
                        key: 'rank'

                    },
                      {
                        title: '兑付方案',
                        key: 'type',
                         render: (h, params) => {
                             let tagText='';
                            if(params.row.type==1){
                             
                                tagText='方案一';
                            }else if(params.row.type==2){
                               

                                tagText='方案二';
                            }else{
                                tagText='方案三';
                            }
                        return h('span', {}, tagText);
                     }

                    },
                  
                    {
                        title: '操作',
                        key: 'status',
                        // fixed: 'right',
                        width:150,
                        align: 'center',
                        render: (h, params) => {
                            let deleteButton=h('Button', {
                                props: {

                                    size: 'small',
                                    type:'default'
                                },
                                style:{
                                    marginRight:'10px'
                                }
                               
                            }, '审核通过');
                            let eButton=h('Button', {
                                props: {

                                    size: 'small',
                                     type:'success'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("review",params.row.id)
                                    }
                                }
                            }, '审核');
                            let dobutton=[];
                            if(params.row.status==1){
                                dobutton.push(deleteButton);
                               
                            }else{
                                dobutton.push(eButton); 
                            }
                        

                            return h('div', dobutton);
                        }
                    }
                ],
                saveType: "new",
                doType:"list",
                switching:false,
                tableData: [],
                merchantTypeData: [],
                areaData:{
                    areaDataReady:3,
                    province:[],
                    citys:[],
                    district:[]
                },
                shipStatus:["待审核","审核成功","审核失败"],
                Totals :{
                    wait: "0.00",
                    fail: '0.00',
                    success: '0.00',
                    sum_total:'0.00'
                },
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
                    amount:"",
                    rank:"24",
                    ranks:"",
                    memberName:"",
                },
                updateStatusForm: {},
                updateStatusValidate: {
                    status: [
                        { validator: valideCashStatus, message: '请选择审核结果', trigger: 'blur' }
                    ]
                },
                oldPassError: '',
                allSelect:[],
                loadBut:false,
                updateStatus: false, // 修改密码模态框显示
                saveUpdateStatusLoading: false,
                searchData:{
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    status:"",
                    type:"",
                },
                addDataValidate: {
                amount: [
                    { required: true, message: '请输入金额'},
                    { validator: validePhone }
                ],
                memberName: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                rank: [
                    { required: true, message: '请选择期数' },
                ],
                 ranks: [
                    { required: true, message: '请选择兑付方案' },
                ],
            },
                searchValidata: {}
            };
        },
        computed : {
            getLoading () {
                return !(this.dataReady==0);
            },
            areaDataReady () {
                return !(this.areaData.areaDataReady==0);
            },
            doName () {
                if (this.doType=="list") return "兑付方案";
                if (this.doType=="edit") return "编辑商户";
                if (this.doType=="add") return "添加";
                return "商户详情";
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
            changePage (pageNumber){
                this.page.pageNumber=pageNumber;
                this.search(pageNumber);
            },
            changePageSize (pageSize){
                this.page.pageSize=pageSize;
                this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                this.search();
            },
            rankclick:function (e) {
                console.log(e);
                if (e==12) {
                    this.currentData.ranks=1
                }else if(e==24){
                    this.currentData.ranks=2
                }else{
                    this.currentData.ranks=3
                }
                console.log(this.currentData.ranks);
                // body...
            },
            OnSelect(event){
                // console.log(event);
            },
            selectionchange(event){
                // console.log(event);
            },
            allOnSelect(event){
                // console.log(event);
                this.allSelect=event
            },
            //controller
            checkPower (dotype) {
                return !!this.$store.state.Rights[Config.api.cashList.List[dotype].MD5()];
            },
            doWhat (dotype,dataIndex,index) {
                if(!this.checkPower(dotype)){
                    this.$Message.warning("对不起，您没有此操作权限！");
                    return;
                }
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
                if(dotype=="review"){//审核

                    this.changeStatus(dataIndex);
                };
                if(dotype=="list"){
                    this.resetCurrentData();
                    this.dataReady+=1;
                    this.init();
                    this.doType="list";
                };
                this.switching=false;
            },
            view (index) {
                this.currentData=$.extend(true, {}, this.tableData[index]);
                this.doType="view";
            },
            showEdit (index) {
                this.currentData=$.extend(true, {}, this.tableData[index]);
                this.currentData.userewm=Config.apiRootPath+Config.api.public.ewm+"&merchantId="+this.currentData.merchantId;
                this.setCity(this.currentData.merchantProvinceId,true);
                this.setDistrict(this.currentData.merchantCityId,true);
                this.doType="edit";
            },
            //comm
            resetCurrentData () {
                this.currentData = $.extend(true, {}, this.defaultData);
            },
            search (pageNumber) {
                if(this.searchData.searchDate.length){
                    this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                    this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
                }
                this.page.pageNumber=1;
                if(pageNumber)this.page.pageNumber=pageNumber;
                this.doWhat("list");
            },
            saveEdit () {
                this.$refs['currentData'].validate((valid) => {
                   if (valid){
                        let postData={
                            ssid:Cookies.get('ssid'),
                            amount:this.currentData.amount,
                            rank:24,
                            type:2,
                            memberName:this.currentData.memberName
                        };
                        $.ajax({
                            url: Config.apiRootPath+Config.api.cashList.List.add,
                            type: 'POST',
                            dataType: 'json',
                            data: postData
                        })
                        .done((data)=>{
                            this.dataReady--;
                            // getList
                            if(!!data){
                                if(data.code==0){
                                    this.dataReady++;
                                    // this.tableData=data.data.list;
                                     this.$Message.success("添加成功");
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
                    }
                })
            },
            //list
            resetSearch () {
                this.searchData={
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:0
                };
                this.page.pageNumber=1;
                this.dataReady+=1;
                this.init();
            },
            init () {
                this.getList();
            },
            getList () {
                let postData={
                    ssid:Cookies.get('ssid'),
                    page:this.page.pageNumber,
                    pageSize:this.page.pageSize
                };
                if(this.searchData.keyword!="")postData.name=this.searchData.keyword;
                if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
                if(this.searchData.status!="")postData.status=this.searchData.status;
                if(this.searchData.type!="")postData.type=this.searchData.type;
                if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
                $.ajax({
                    url: Config.apiRootPath+Config.api.cashList.List.list,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        this.dataReady--;
                        // getList
                        if(!!data){
                            if(data.code==0){
                                this.page.dataCount=data.data.count;
                                // if(data.data.sum_list==undefined){
                                // }else{
                                //     this.Totals.fail=data.data.sum_list.reject_total==null?"0.00":Number(data.data.sum_list.reject_total)/100;
                                //     this.Totals.wait=Number(data.data.sum_list.unreviewed_total)/100;
                                //     this.Totals.success=Number(data.data.sum_list.consent_total)/100;
                                //     this.Totals.sum_total=Number(data.data.sum_list.sum_total)/100;
                                // // }
                                // this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                                // //format list data
                                // for(var i=0;i<data.data.list.length;i++){
                                //     data.data.list[i].text=decodeURI(data.data.list[i].text);
                                // }
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
                        this.dataReady--;
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });
            },
           
            //edit password
            changeStatus (index) {
        
                    this.$Modal.confirm({
                        title: '兑付方案审核',
                        content: '<p>确定通过兑付方案申请？</p>',
                        onOk: () => {
                          let postData={
                                ssid:Cookies.get('ssid'),
                                id:index,
                                status:1,
                              
                            };
                            $.ajax({
                                url: Config.apiRootPath+Config.api.cashList.List.review,
                                type: 'POST',
                                dataType: 'json',
                                data: postData
                            })
                            .done((data)=>{
                               
                                //userTypeList
                                if(!!data){
                                    if(data.code==0){
                                        this.$Message.success("操作成功！");
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
                            .fail((xhr,error)=>{
                                this.savePassLoading=false;
                                Config.showError({vm:this,data:data,
                                    errorMsg:"服务器通讯失败"
                                });
                            });
                        },
                        onCancel: () => {
                            this.$Message.info('放弃审核');
                        }
                    });
              
                
            },
            handleSelectAll(status){
                this.$refs.selection.selectAll(status);
            },
            cancelUpdateStatus () {
                this.updateStatusForm={};
                this.updateStatus = false;
            },
        },
        mounted () {
        },
        activated (){
            this.doWhat("list");
        }
    };
</script>